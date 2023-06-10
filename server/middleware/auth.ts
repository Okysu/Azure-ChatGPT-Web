const auth = ["auth", "model", "logout"];
export default defineEventHandler(async (event) => {
  // if url has auth, need to check permission
  const req = event.node.req;
  const res = event.node.res;
  const url = req.url || "";
  if (url.startsWith("/api") && auth.some((item) => url.includes(item))) {
    const { authorization } = req.headers;
    if (!authorization) {
      res.statusCode = 401;
      return {
        code: -1,
        msg: "unauthorized.",
        data: null,
      };
    }
    if (!authorization.startsWith("Bearer ")) {
      res.statusCode = 401;
      return {
        code: -1,
        msg: "invalid token.",
        data: null,
      };
    }
    const token = authorization.slice(7, authorization.length);
    const payload = verifyLoginToken(token);
    if (!payload) {
      res.statusCode = 401;
      return {
        code: -1,
        msg: "invalid token.",
        data: null,
      };
    }
    // get redis value
    const murmurhash32 = murmurhash(token + process.env.HASH_SALT);
    const record = await get("token:" + murmurhash32);

    if (!record) {
      res.statusCode = 401;
      return {
        code: -1,
        msg: "invalid token.",
        data: null,
      };
    }
    // check if token is equal to redis value
    if (record !== token) {
      res.statusCode = 401;
      return {
        code: -1,
        msg: "invalid token.",
        data: null,
      };
    }

    // get user info from redis
    const user = await get("user:" + payload.email);
    if (!user) {
      res.statusCode = 401;
      return {
        code: -1,
        msg: "invalid token.",
        data: null,
      };
    }

    // write user info to event.context.auth
    event.context.auth = {
      token: token,
      user: JSON.parse(user),
    };
  }
});
