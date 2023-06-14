import { activeConnections, closeSSEConnection } from "../[name].post";
import OpenAIClient from "../../../utils/openai";
import { encode } from "gpt-3-encoder";

export default defineEventHandler(async (event) => {
  const { res } = event.node;
  if (!event.context.params || !event.context.params.clientId) {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "model not found.",
      data: null,
    };
  }
  const { clientId } = event.context.params;
  const connection = activeConnections.find(
    (item) => item.clientId === clientId
  );

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const { token, user } = event.context.auth;
  const { _id } = user;
  if (connection && connection.token === token) {
    const asyncResult = OpenAIClient.listChatCompletions(
      connection.name,
      connection.messages,
      connection.options
    );
    let finishText = "";
    const result = await asyncResult;
    // Stream the result to the client
    for await (const stream of result) {
      if (!stream.choices[0].delta) {
        res.statusCode = 400;
        return {
          code: -1,
          msg: "model error.",
          data: null,
        };
      }
      const { role, content } = stream.choices[0].delta;
      if (role === undefined && content === undefined) {
        // count the number of tokens
        const count = encode(finishText).length;
        expenseToken(user, count, true);
        // close SSE connection
        closeSSEConnection(clientId);
        res.statusCode = 200;
        res.end();
        break;
      } else if (content !== undefined) {
        // send SSE message
        res.write(content);
        // save message
        finishText += content;
      }
    }
  } else {
    res.statusCode = 400;
    return {
      code: -1,
      msg: "client not found.",
      data: null,
    };
  }
});

// expense wallet token
export const expenseToken = async (
  user: user,
  count: number,
  finished: boolean = false
) => {
  if (!user || !user._id || !count) return -1;
  const db = await getDB();
  if (!db) return -1;
  const collection = db.collection("wallet_" + user._id);
  const record = await collection.find({ valid_flag: true }).toArray();
  if (!record) return -1;

  // get rest token count
  let restCount = 0;
  record.forEach((item) => {
    if (item.type === 0) {
      restCount += item.count;
    } else if (item.type === 1) {
      restCount -= item.count;
    }
  });

  if (user.expense_base === null || user.expense_base === undefined) {
    user.expense_base = 1;
  }

  count *= user.expense_base;

  // if rest token count is not enough, return
  if (restCount < count && !finished) return -2;

  // insert token count
  collection.insertOne({
    type: 1,
    title: "对话花费",
    count: count,
    valid_flag: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return 0;
};
