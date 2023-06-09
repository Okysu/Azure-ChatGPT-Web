import { RedisClientType, createClient } from "redis";

let client: any = null;

/**
 * Connect to the redis server.
 */
async function connect() {
  const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    database: Number(process.env.REDIS_DATABASE),
    url: process.env.REDIS_URL,
  });

  await redisClient
    .connect()
    .then(() => {
      client = redisClient;
      console.log("Connected successfully to redis server.");
    })
    .catch((err) => {
      console.log("Failed to connect to redis server.", err);
      process.exit(1);
    });
}

/**
 * Get the redis client instance.
 * @returns {RedisClientType} client
 */
async function getRedis(): Promise<RedisClientType | null> {
  if (!client) {
    await connect();
  }
  return client;
}

/**
 * Set the value of a key.
 * @param {string} key
 * @param {string} value
 * @param {number} [expire] expire time in seconds
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
async function set(
  key: string,
  value: string,
  expire?: number
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (expire) {
      client?.set(
        key,
        value,
        {
          EX: expire,
        },
        (err: any, reply: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(reply === "OK");
          }
        }
      );
    } else {
      client?.set(key, value, (err: any, reply: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply === "OK");
        }
      });
    }
  });
}

/**
 * Get the value of a key.
 * @param {string} key
 * @returns {Promise<string>}
 * @throws {Error}
 */
async function get(key: string): Promise<string | null> {
  return (await client?.get(key)) ?? null;
}

/**
 * Delete a key.
 * @param {string} key
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
async function del(key: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    client?.del(key, (err: any, reply: number) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply === 1);
      }
    });
  });
}

/**
 * Check if a key exists.
 * @param {string} key
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
async function exists(key: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    client?.exists(key, (err: any, reply: number) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply === 1);
      }
    });
  });
}

/**
 * Expire a key.
 * @param {string} key
 * @param {number} seconds
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
async function expire(key: string, seconds: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    client?.expire(key, seconds, (err: any, reply: number) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply === 1);
      }
    });
  });
}

/**
 * murmurhash3_32
 * @param {string} key
 * @param {number} seed
 * @returns {number}
 */
function murmurhash(key: string, seed: number = 0): number {
  var remainder, bytes, h1, h1b, c1, c2, k1, i;

  remainder = key.length & 3; // key.length % 4
  bytes = key.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = ((k1 & 0xffff) * c1 + (((k1 >>> 16) * c1) & 0xffff)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((k1 & 0xffff) * c2 + (((k1 >>> 16) * c2) & 0xffff)) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((h1 & 0xffff) * 5 + (((h1 >>> 16) * 5) & 0xffff)) & 0xffffffff;
    h1 =
      ((h1b & 0xffff) + 0x6b64 + (((h1b >>> 16) + 0xe654) & 0xffff)) &
      0xffffffff;
  }

  k1 = 0;

  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
    case 1:
      k1 ^= key.charCodeAt(i) & 0xff;

      k1 = ((k1 & 0xffff) * c1 + (((k1 >>> 16) * c1) & 0xffff)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = ((k1 & 0xffff) * c2 + (((k1 >>> 16) * c2) & 0xffff)) & 0xffffffff;
      h1 ^= k1;
  }

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 =
    ((h1 & 0xffff) * 0x85ebca6b + (((h1 >>> 16) * 0x85ebca6b) & 0xffff)) &
    0xffffffff;
  h1 ^= h1 >>> 13;
  h1 =
    ((h1 & 0xffff) * 0xc2b2ae35 + (((h1 >>> 16) * 0xc2b2ae35) & 0xffff)) &
    0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

export { getRedis, murmurhash, set, get, del, exists, expire };
