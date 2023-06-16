export default defineEventHandler(async (event) => {
  const { user } = event.context.auth;
  const { _id } = user;
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

  const { key } = body;

  if (!key) {
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

  const collection = db.collection("key");
  // find
  const record = await collection.findOne({ key });

  if (!record) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }

  if (record.used) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "key used.",
      data: null,
    };
  }

  // insert
  const walletCollection = db.collection("wallet_" + _id);
  walletCollection.insertOne({
    type: 0,
    title: record.title,
    count: record.count,
    valid_flag: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // remove key
  collection.updateOne(
    { key },
    {
      $set: {
        used: true,
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
