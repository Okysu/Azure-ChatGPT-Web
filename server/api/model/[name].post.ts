const supportedModels = process.env.SUPPORT_MODEL?.split(",") || [];
import { v4 as uuidv4 } from "uuid";
import { encode } from "gpt-3-encoder";

/* SSE Connections Endpoint */
export const activeConnections = [] as sseConnection[];

/**
 * Generate a client id.
 * @param {string} token
 * @returns {string} client id
 */
function generateClientId(
  token: string,
  messages: message[],
  options: options,
  name: string
): string {
  const clientId = uuidv4();
  console.log("generate client id: " + clientId);
  activeConnections.push({
    name,
    clientId,
    token,
    messages,
    options,
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

  const clientId = generateClientId(token, messages, options || defaultOptions, name);

  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: {
      _id: clientId,
    },
  };
});
