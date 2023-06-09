const ipConnections = new Map<string, number>();

export default defineEventHandler((event) => {
  const rep = event.node.req;
  const url = rep.url || "";
  const ip =
    rep.headers["x-forwarded-for"] ||
    rep.socket.remoteAddress ||
    rep.connection.remoteAddress ||
    "";
  if (url.startsWith("/api")) {
    const hashIP = murmurhash(ip.toString() + "#rate-limit").toString();
    let count = ipConnections.get(hashIP) || 0;
    if (count > 15) {
      event.node.res.statusCode = 429;
      const response = {
        code: -1,
        data: null,
        msg: "Too many requests, please try again later.",
      };
      return response;
    }
    count++;
    ipConnections.set(hashIP, count);
    // reset count
    setTimeout(() => {
      ipConnections.set(hashIP, 0);
    }, 1000 * 60);
  }
});
