import nodemailer from "nodemailer";

const registerTemplate = `<div style="padding: 35px; max-width: 600px; min-height: 400px;">
<table cellpadding="0" align="center"
  style="width: 600px; margin: 0px auto; text-align: left; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; font-size: 14px; font-family:微软雅黑, 黑体; line-height: 1.5; box-shadow: rgb(153, 153, 153) 0px 0px 5px; border-collapse: collapse; background-position: initial initial; background-repeat: initial initial;background:#fff;">
  <tbody>
    <tr>
      <th valign="middle"
        style="height: 25px; line-height: 25px; padding: 15px 35px; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #C46200; background-color: #FEA138; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;">
        <font face="微软雅黑" size="5" style="color: rgb(255, 255, 255); ">小于GPT - 小于同学的个人GPT站点</font>
      </th>
    </tr>
    <tr>
      <td>
        <div style="padding:25px 35px 40px; background-color:#fff;">
          <h2 style="margin: 5px 0px; ">
            <font color="#333333" style="line-height: 20px; ">
              <font style="line-height: 22px; " size="4">亲爱的注册用户：</font>
            </font>
          </h2>
          <p>首先感谢您申请使用小于GPT！ </p>
          <p>如果不是您所为，请无视本邮件，很有可能是他人错误地键入了你的邮件</p>
          <p style="max-width: 300px; word-wrap: break-word;">为了正常使用小于GPT，您需要在 {{url}} 激活您的邮箱。</p>
          <p>验证的有效期在2小时以内，请您尽快激活。</p>
        </div>
      </td>
    </tr>
  </tbody>
</table>
</div>`;
const welcomeTemplate = `<div style="padding: 35px; max-width: 600px; min-height: 400px;">
  <table cellpadding="0" align="center"
    style="width: 600px; margin: 0px auto; text-align: left; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; font-size: 14px; font-family:微软雅黑, 黑体; line-height: 1.5; box-shadow: rgb(153, 153, 153) 0px 0px 5px; border-collapse: collapse; background-position: initial initial; background-repeat: initial initial;background:#fff;">
    <tbody>
      <tr>
        <th valign="middle"
          style="height: 25px; line-height: 25px; padding: 15px 35px; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #C46200; background-color: #FEA138; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;">
          <font face="微软雅黑" size="5" style="color: rgb(255, 255, 255); ">小于GPT - 小于同学的个人GPT站点</font>
        </th>
      </tr>
      <tr>
        <td>
          <div style="padding:25px 35px 40px; background-color:#fff;">
            <h2 style="margin: 5px 0px; ">
              <font color="#333333" style="line-height: 20px; ">
                <font style="line-height: 22px; " size="4">亲爱的{{username}}：</font>
              </font>
            </h2>
            <p>欢迎您的加入，您现在已经正式成为小于GPT的注册用户。</p>
            <p>小于GPT平台将为您提供一个自由的发言平台，您可以在这里发表自己的观点，也可以在这里与其他用户进行交流。</p>
            <p>您的登录名为：{{email}}</p>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.SMTP_FROM || "My Site <" + process.env.SMTP_USERNAME + ">",
};

/**
 * Email template insert sytax: {{}} replace with the value.
 * @param {string} template
 * @param {object} data
 * @returns {string}
 */
function renderTemplate(
  template: string,
  data: { [s: string]: any } | ArrayLike<unknown>
): string {
  const keys = Object.keys(data);
  const values = Object.values(data);
  let result = template;
  for (let i = 0; i < keys.length; i++) {
    result = result.replace(new RegExp(`{{${keys[i]}}}`, "g"), values[i]);
  }
  return result;
}

/**
 * Send a register email to the user.
 * @param {string} email
 * @param {string} token
 * @returns {Promise}
 */
export async function sendRegisterEmail(
  email: string,
  token: string
): Promise<any> {
  // render the template
  const html = renderTemplate(registerTemplate, {
    url: process.env.SITE_URL + "/api/verify/register?token=" + token,
  });
  // send the email
  return transporter.sendMail({
    ...mailOptions,
    to: email,
    subject: "欢迎申请使用小于GPT，让我们开始吧！",
    html,
  });
}

/**
 * Send a welcome email to the user.
 * @param {string} email
 * @param {string} username
 * @returns {Promise}
 */
export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<any> {
  // render the template
  const html = renderTemplate(welcomeTemplate, {
    username: username,
    email: email,
  });

  // send the email
  return transporter.sendMail({
    ...mailOptions,
    to: email,
    subject: "您的账号已经成功激活，尽情享受吧！",
    html,
  });
}
