# Azure-ChatGPT-Web

A ChatGPT web page compatible with Azure OpenAI Key, built using Nuxt3.

一个适用于Azure OpenAI的ChatGPT网页，使用Nuxt3构建。

# Note 注意

This project is currently **under development** and is not yet available.

本项目目前**正在开发**，尚未可用。

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