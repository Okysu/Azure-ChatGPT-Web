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

  const { _id } = body;

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
  const collection = db.collection("chat");

  // delete chat but set del_flag to true
  await collection.updateOne(
    { _id: _id, created_by: _uid },
    {
      $set: {
        del_flag: true,
        updated_at: new Date(),
      },
    }
  );

  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: null,
  };
});
