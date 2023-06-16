import auth from "../../middleware/auth";

export default defineEventHandler(async (event) => {
  const { user } = event.context.auth;
  const { res } = event.node;
  const body = await readBody(event);
  if (!body) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }

  const { username, avatar } = body;

  if (!username || !avatar) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }

  const db = await getDB();
  if (!db) {
    res.statusCode = 500;
    return {
      code: -1,
      msg: "db error.",
      data: null,
    };
  }

  const collection = db.collection("user");
  // update
  user.username = username;
  user.avatar = avatar;

  collection.updateOne(
    { email: user.email },
    {
      $set: {
        username,
        avatar,
      },
    }
  );

  set("user:" + user.email, JSON.stringify(user), 60 * 60 * 24 * 15);

  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: null,
  };
});
