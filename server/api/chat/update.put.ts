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

  const { _id, messages, title, options } = body;

  const { _id: _uid } = user;
  const db = await getDB();
  if (!db) {
    res.statusCode = 500;
    return {
      code: -1,
      msg: "db error.",
      data: null,
    };
  }
  const collection = db.collection("chat_" + _uid);

  if ((!messages || !Array.isArray(messages)) && !options) {
    // just update title
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          title: title || "New Chat",
          updated_at: new Date(),
        },
      }
    );
  } else if (!title && !options) {
    // just update messages
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          messages: JSON.stringify(messages),
          updated_at: new Date(),
        },
      }
    );
  } else if (!title && !messages && options) {
    // just update options
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          options: JSON.stringify(options),
          updated_at: new Date(),
        },
      }
    );
  } else {
    // update both
    await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          messages: JSON.stringify(messages),
          title: title || "New Chat",
          updated_at: new Date(),
        },
      }
    );
  }

  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: null,
  };
});
