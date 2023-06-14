export default defineEventHandler(async (event) => {
  const { user } = event.context.auth;
  const { res } = event.node;
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
  const collection = db.collection("wallet_" + _id);
  // query chat list
  const records = await collection.find({ valid_flag: true }).toArray();
  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: records,
  };
});
