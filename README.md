# Azure-ChatGPT-Web

A ChatGPT web page compatible with Azure OpenAI Key, built using Nuxt3.

一个适用于Azure OpenAI的ChatGPT网页，使用Nuxt3构建。

# Note 注意

The basic part of the project has been developed, and the backend management part is under development.

本项目目前基础部分已开发完毕，正在开发后台管理部分。

DEMO: https://chat.ecanse.com

![DEMO](https://source.yby.zone/azure-gpt-login.png)
![DEMO](https://source.yby.zone/azure-gpt-home.png)

# Features 特性

- Built with Nuxt3
- Support for login, registration, and SMTP sending
- Support for payment system
- Support for backend management
- Support for multiple languages (Waiting for translation)



- 使用Nuxt3构建
- 支持登录、注册、SMTP邮件发送
- 额度计算付费系统
- 后台管理
- 支持多语言(等待翻译)

### Prerequisites 先决条件

- Node.js 16+
- MongoDB
- Redis


## Deployment 部署

Run `pnpm run build`.

Because Nuxt3 cannot use environment variable files in the Deployment environment, you need to manually set the environment variables before starting.

由于Nuxt3在Deployment环境下无法使用环境变量文件，因此启动之前需要手动设置环境变量。

```bash
export SITE_URL='https://example.com'
export MONGODB_URI='mongodb://localhost:27017/azure'
export MONGODB_USERNAME='azure'
export MONGODB_PASSWORD='************'
export MONGODB_DB='azure'
export REDIS_URL='redis://localhost:6379'
export REDIS_PASSWORD=''
export REDIS_DATABASE=1
export JWT_SECRET_KEY='*********'
export JWT_SUBJECT='Azure-Web-Next'
export HASH_SALT='your-salt'
export OPENAI_API_KEY='your-key'
export OPENAI_API_ENDPOINT='your-endpoint'
export SUPPORT_MODEL='gpt-35-turbo'
export SMTP_HOST='smtp.example.com'
export SMTP_PORT=465
export SMTP_USERNAME=''
export SMTP_PASSWORD=''
```


## Development 开发

First, create a copy of the `.env.prod` file named `.env.dev`, and fill it in with the relevant information.

首先，创建一个`.env.prod`文件的副本，命名为`.env.dev`，并填写相关信息。

Run `pnpm run dev`.

## Messages Back 消息回传

This system allows users to return messages as much as possible. In the backend, we will continue to trim to ensure that no more than 4000 tokens are used. The reason why automatic summarization is not used is because this will cause the model to not accurately understand the user's intentions.

本系统允许用户仅可能多的回传消息，在后端我们会不断进行裁剪保证不超过4000个Token，没有采用自动总结的方式是因为这样会导致模型无法准确地了解用户的意图。

Handle messages as follows:
消息处理如下：
```typescript
  // count the number of tokens
  // 计算token数量
  let count = 0;
  messages.forEach((item: message) => {
    count += encode(item.content).length;
  });

  if (count > 4000 && messages.length > 1) {
    // save all messages that its role is system, and remove others
    // 保存所有role为system的消息，删除其他消息
    let count = 0;
    let index = 0;
    while (
      (count > 4000 ||
        (messages[index] && messages[index].role !== "system")) &&
      index < messages.length
    ) {
      const msg = messages.shift();
      if (!msg) {
        break;
      }
      count -= encode(msg.content).length;
      index++;
    }
    // if count > 4000, return error
    // 如果count > 4000，返回错误
    if (count > 4000) {
      res.statusCode = 400;
      return {
        code: -1,
        msg: "messages too long.",
        data: null,
      };
    }
  } else if (count > 4000 && messages.length === 1) {
    // return error
    // 返回错误
    res.statusCode = 400;
    return {
      code: -1,
      msg: "messages too long.",
      data: null,
    };
  }
```