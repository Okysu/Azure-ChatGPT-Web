import { readFileSync } from "fs";
import nodemailer from "nodemailer";
const registerTemplate = readFileSync("./template/register.html", "utf8");
const welcomeTemplate = readFileSync("./template/welcome.html", "utf8");

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
async function sendRegisterEmail(email: string, token: string): Promise<any> {
  // render the template
  const html = renderTemplate(registerTemplate, {
    url: import.meta.env.BASE_URL + "/user/verify/register?token=" + token,
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
async function sendWelcomeEmail(email: string, username: string): Promise<any> {
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
