/**
 * @api {post} /user/login login
 * @apiName Login icl. auto register.
 */

import { sha256 } from "js-sha256";
import { sendRegisterEmail } from "../../utils/smtp";

/* login.post.ts */
export default defineEventHandler(async (event) => {
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

  const { username, password, email, inviteCode } = body;

  // params validation
  if (!email || !password) {
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

  const record = await collection.findOne({ email });

  if (!record) {
    // res.statusCode = 404;
    // return {
    //   code: -1,
    //   msg: "user not found.",
    //   data: null,
    // };

    // if user not found, use info from params to register a new user
    const insert_user = {
      username: username || email,
      password: hashPassword(password, process.env.HASH_SALT),
      email,
      inviteCode: inviteCode,
    };

    // register user
    const token = generateRegisterToken(insert_user);

    sendRegisterEmail(email, token);

    return {
      code: 1,
      msg: "send email success.",
      data: null,
    };
  }

  const passwordMatch =
    record.password === hashPassword(password, process.env.HASH_SALT);

  if (!passwordMatch) {
    res.statusCode = 403;
    return {
      code: -1,
      msg: "email or password error.",
      data: null,
    };
  }

  // set a random password to trick the hacker
  record.password = sha256(Math.random().toString() + Date.now().toString());

  // generate token
  const token = generateLoginToken(record);

  // save token to redis
  const redis = await getRedis();
  if (!redis) {
    res.statusCode = 500;
    return {
      code: -1,
      msg: "redis error.",
      data: null,
    };
  }

  const murmurhash32 = murmurhash(token + process.env.HASH_SALT);
  set("token:" + murmurhash32, token, 60 * 60 * 24 * 15);

  // check if the user is expired or disabled
  // NOTICE: expired_at is a Date object, and when is zero(1970-01-01), it means the user is not expired.
  if (
    record.disabled ||
    (record.expired_at.getTime() && record.expired_at.getTime() < Date.now())
  ) {
    res.statusCode = 403;
    return {
      code: -1,
      msg: "user is disabled or expired.",
      data: null,
    };
  }

  // login certificate
  set("user:" + record.email, JSON.stringify(record), 60 * 60 * 24 * 15);

  // return user info
  res.statusCode = 200;
  return {
    code: 0,
    msg: "success.",
    data: {
      token,
      user: record,
    },
  };
});
