const supportedModels = process.env.SUPPORT_MODEL?.split(",") || [];
import { v4 as uuidv4 } from "uuid";
import OpenAIClient from "../../utils/openai";
import { encode } from "gpt-3-encoder";

/* SSE Connections Endpoint */
export const activeConnections = [] as sseConnection[];

/**
 * Send SSE message to client.
 * @param {string} clientId
 * @param {any} message
 */
function sendSSEMessage(clientId: string, message: string) {
  const connection = activeConnections.find(
    (item) => item.clientId === clientId
  );
  if (connection && connection.res && message) {
    const response = `${message}`;
    connection.res.write(response);
    console.log("send message to client: " + clientId, message);
  }
}

/**
 * Generate a client id.
 * @param {string} token
 * @returns {string} client id
 */
function generateClientId(token: string): string {
  const clientId = uuidv4();
  console.log("generate client id: " + clientId);
  activeConnections.push({
    clientId,
    res: null,
    token,
  });
  console.log("active connections: " + activeConnections.length);
  return clientId;
}

/**
 * Close SSE connection.
 * @param {string} clientId
 */
export function closeSSEConnection(clientId: string) {
  const index = activeConnections.findIndex(
    (item) => item.clientId === clientId
  );
  if (index !== -1) {
    const connection = activeConnections[index];
    connection.res.end();
    activeConnections.splice(index, 1);
    console.log("close connection: " + clientId);
  }
}

export default defineEventHandler(async (event) => {
  if (!event.context.params || !event.context.params.name) {
    return {
      code: -1,
      msg: "model not found.",
      data: null,
    };
  }
  const { name } = event.context.params;
  const { res } = event.node;
  const { token } = event.context.auth;
  // if don't support this model, return 404
  if (!supportedModels.includes(name)) {
    res.statusCode = 404;
    return {
      code: -1,
      msg: "model not found.",
      data: null,
    };
  }

  const body = await readBody(event);
  if (!body) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }

  const { messages, options } = <{ messages: message[]; options: any }>body;

  if (!messages) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }

  // default options
  const defaultOptions = {
    maxTokens: 1000,
    temperature: 0.9,
  };

  // count the number of tokens
  let count = 0;
  messages.forEach((item: message) => {
    count += encode(item.content).length;
  });

  if (count > 4000 && messages.length > 1) {
    // save all messages that its role is system, and remove others
    let count = 0;
    let index = 0;
    while (
      (count > 4000 ||
        (messages[index] && messages[index].role !== "system")) &&
      index < messages.length
    ) {
      const msg = messages.shift();
      if (!msg) {
        break;
      }
      if (msg.role !== "system") {
        count -= encode(msg.content).length;
      }
      index++;
    }
    // if count > 4000, return error
    if (count > 4000) {
      res.statusCode = 400;
      return {
        code: -1,
        msg: "messages too long.",
        data: null,
      };
    }
  } else if (count > 4000 && messages.length === 1) {
    // return error
    res.statusCode = 400;
    return {
      code: -1,
      msg: "messages too long.",
      data: null,
    };
  }

  const asyncResult = OpenAIClient.listChatCompletions(
    name,
    messages,
    options || defaultOptions
  );
  const result = await asyncResult;
  // Stream the result to the client
  const clientId = generateClientId(token);

  async function processResult() {
    for await (const stream of result) {
      if (!stream.choices[0].delta) {
        closeSSEConnection(clientId);
        return {
          code: -1,
          msg: "model error.",
          data: null,
        };
      }
      const { role, content } = stream.choices[0].delta;
      if (role === undefined && content === undefined) {
        // close SSE connection
        closeSSEConnection(clientId);
        res.end();
        break;
      } else if (content !== undefined) {
        // send SSE message
        sendSSEMessage(clientId, content);
      }
    }
  }

  processResult();

  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: {
      clientId,
    },
  };
});
