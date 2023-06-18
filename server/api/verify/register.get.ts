import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  const { res } = event.node;
  const query = getQuery(event);
  if (!query) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }
  const { token } = query;
  if (!token) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "params error.",
      data: null,
    };
  }
  const payload = await verifyRegisterToken(token as string);
  if (!payload) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "token error.",
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
  const record = await collection.findOne({ email: payload.email });
  if (record) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "user already exists.",
      data: null,
    };
  }
  const _id = new ObjectId();
  const user = {
    _id,
    username: payload.username,
    password: payload.password,
    email: payload.email,
    type: "user",
    created_at: new Date(),
    updated_at: new Date(),
    expired_at: new Date(0), // never expire
    disabled_flag: false,
    expense_base: 1,
  };

  collection.insertOne(user);

  // give user 10000 tokens
  const wallerCollection = db.collection("wallet_" + _id);
  wallerCollection.insertOne({
    type: 0,
    title: "新用户注册赠送",
    count: 20000,
    valid_flag: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (payload.inviteCode) {
    const inviteCollection = db.collection("invitation");
    inviteCollection.insertOne({
      code: payload.inviteCode,
      email: payload.email,
      valid_flag: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  sendWelcomeEmail(payload.email, payload.username);

  return {
    code: 0,
    msg: "success.",
    data: null,
  };
});
