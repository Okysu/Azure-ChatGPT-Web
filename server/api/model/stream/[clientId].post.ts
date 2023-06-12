import { activeConnections, closeSSEConnection } from "../[name].post";
import OpenAIClient from "../../../utils/openai";

export default defineEventHandler(async (event) => {
  const { res } = event.node;
  if (!event.context.params || !event.context.params.clientId) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "model not found.",
      data: null,
    };
  }
  const { clientId } = event.context.params;
  const connection = activeConnections.find(
    (item) => item.clientId === clientId
  );

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const { token } = event.context.auth;
  if (connection && connection.token === token) {
    const asyncResult = OpenAIClient.listChatCompletions(
      connection.name,
      connection.messages,
      connection.options
    );
    const result = await asyncResult;
    // Stream the result to the client
    for await (const stream of result) {
      if (!stream.choices[0].delta) {
        res.statusCode = 400;
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
        res.statusCode = 200;
        res.end();
        break;
      } else if (content !== undefined) {
        // send SSE message
        res.write(content);
      }
    }
  } else {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "client not found.",
      data: null,
    };
  }
});
