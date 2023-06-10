import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
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

  const { messages } = body;

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
  const collection = db.collection("chat");
  const uuid = new ObjectId(uuidv4());
  // create chat
  await collection.insertOne({
    _id: uuid,
    created_by: _id,
    created_at: new Date(),
    updated_at: new Date(),
    del_flag: false,
    messages: messages,
    title: "新的聊天",
  });
});
