export default defineEventHandler(async (event) => {
  const { token } = event.context.auth;
  const murmurhash32 = murmurhash(token + process.env.HASH_SALT);
  del("token:" + murmurhash32);
  event.node.res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: null,
  };
});