import { activeConnections, closeSSEConnection } from "../[name]";

export default defineEventHandler(async (event) => {
  if (!event.context.params || !event.context.params.name) {
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
  const { token } = event.context.auth;
  const { res, req } = event.node;
  if (connection && connection.token === token) {
    connection.res = res;
    req.on("close", () => {
      closeSSEConnection(clientId);
    });
  } else {
    return {
      code: -1,
      msg: "client not found.",
      data: null,
    };
  }
});
