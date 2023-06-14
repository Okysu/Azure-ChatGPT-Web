import { ObjectId } from "mongodb";

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

  const { messages, type, options } = body;

  if (!messages || !Array.isArray(messages) || !type) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }

  const { _id } = user;
  const db = await getDB();
  if (!db) {
    res.statusCode = 500;
    return {
      code: -1,
      msg: "db error.",
      data: null,
    };
  }
  const collection = db.collection("chat_" + _id);
  const objectId = new ObjectId();
  // create chat
  await collection.insertOne({
    _id: objectId,
    created_at: new Date(),
    updated_at: new Date(),
    del_flag: false,
    messages: JSON.stringify(messages),
    options: options ? JSON.stringify(options) : null,
    title: "New Chat",
    type: type,
  });

  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: {
      _id: objectId,
    },
  };
});
