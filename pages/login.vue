<template>
  <div>
    <div class="login">
      <n-card>
        <n-grid :cols="isMobile ? 1 : 2">
          <n-gi class="gird-box" v-if="!isMobile">
            <n-result status="404" title="AI Tools" description="The Azure OpenAI ChatGPT Web" size="huge">
            </n-result>
          </n-gi>
          <n-gi class="gird-box">
            <n-card :bordered="false">
              <n-alert type="warning">
                此为预览站，仅技术预览和学习使用，不保证账户或记录的永久性，违反国内法律使用会被监管并在不主动通知下清除内容或帐号。
              </n-alert>
              <n-tabs v-model:value="nowTabValue" size="large" style="margin-top: 16px" @update:value="emptyForm()">
                <n-tab-pane name="login" tab="登录" />
                <n-tab-pane name="register" tab="注册" />
              </n-tabs>
              <n-form ref="form" :model="formValue" :rules="formRule">
                <n-form-item path="email">
                  <n-input v-model:value="formValue.email" type="text" placeholder="邮箱" />
                </n-form-item>
                <n-form-item path="password">
                  <n-input v-model:value="formValue.password" type="password" placeholder="密码" show-password-on="click" />
                </n-form-item>
                <n-form-item path="codeCheck">
                  <n-input v-model:value="formValue.codeCheck" type="text" placeholder="验证码" />
                  <canvas ref="code" @click="valid.draw" height="34" width="120"></canvas>
                </n-form-item>
                <n-form-item v-if="nowTabValue === 'register'" path="inviteCode">
                  <n-input :disabled="isInvited" v-model:value="formValue.inviteCode" type="text"
                    placeholder="邀请码，没有可不填" />
                </n-form-item>
                <n-button block type="primary" @click="formHandler" :loading="formValue.loading">登录/注册</n-button>
                <span class="license">登录前我们默认你已知晓并同意
                  <a href="/license.html" target="_blank">《服务条款》</a>
                </span>
              </n-form>
              <template #footer>
                <div class="footer-tools">
                  <n-select style="width: 100px" v-model:value="theme" size="small" :options="themeOptions" />
                  <a href="/forget" target="_blank">忘记密码?</a>
                </div>
              </template>
            </n-card>
          </n-gi>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// pinia stores
import { useAppConfig } from "~/stores/appConfig";
import { useUserConfig } from "~/stores/userConfig";
import { storeToRefs } from "pinia";
import { FormInst, FormItemRule } from "naive-ui";
import { Response, login, request } from "~/api";

// route & router
const route = useRoute();
const router = useRouter();

let isInvited = route.query.inviteCode ? true : false;

// refs reactive
const appConfig = useAppConfig();
const userConfig = useUserConfig();
const { theme, isMobile } = storeToRefs(appConfig);
const { user, token, loginTime } = storeToRefs(userConfig);

// theme
const themeOptions = [
  { label: "系统", value: "auto" },
  { label: "亮色", value: "light" },
  { label: "暗色", value: "dark" },
];

// now tab
const nowTabValue = ref("login");

// form
const formRule = {
  email: [
    {
      required: true,
      trigger: "blur",
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入邮箱");
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return new Error("邮箱格式错误");
        }
        return true;
      },
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 64,
      message: "密码长度应为6 - 64位",
      trigger: "blur",
    },
  ],
  codeCheck: [
    {
      required: true,
      trigger: "blur",
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入验证码");
        }
        if (!valid.validate(value)) {
          return new Error("验证码错误");
        }
        return true;
      },
    },
  ],
};

const code = ref<HTMLCanvasElement>();
const valid = new validcode();

const formValue = ref({
  username: "",
  email: "",
  password: "",
  inviteCode: "",
  codeCheck: "",
  loading: false,
});

const emptyForm = () => {
  formValue.value = {
    username: "",
    email: "",
    password: "",
    inviteCode: route.query.inviteCode
      ? (route.query.inviteCode as string)
      : "",
    codeCheck: "",
    loading: false,
  };
  valid.draw();
};

const form = ref<FormInst>();
const formHandler = (e: Event) => {
  // prevent default
  e.preventDefault();
  form.value?.validate(async (errors) => {
    if (errors) {
      valid.draw();
      return;
    }

    // submit
    formValue.value.loading = true;

    // NOTE: Do not pass parameters directly using formValue.value, as it can lead to overflow.
    const data = {
      ...formValue.value
    }

    login(data)
      .then((res) => {
        const { code, data, msg } = res.data.value as Response<any>;
        if (code === -1) {
          valid.draw();
          return;
        } else if (code === 0) {
          // login success
          token.value = data.token;
          user.value = data.user;
          loginTime.value = new Date().getTime();
          window.$message.success("登录成功");
          router.push("/");
        } else if (code === 1) {
          window.$message.success("发送邮件成功，请注意查收激活");
        } else {
          window.$message.error(msg);
        }
      })
      .catch((err) => {
        window.$message.error("登录失败，请检查用户名密码是否正确");
        console.error(err);
        valid.draw();
      })
      .finally(() => {
        formValue.value.loading = false;
      });
  });
};

onMounted(() => {
  if (route.query.inviteCode) {
    formValue.value.inviteCode = route.query.inviteCode as string;
    isInvited = true;
  }

  // generate validate code
  valid.setRef(code.value as HTMLCanvasElement);
  valid.draw();
});

// title
useHead({
  titleTemplate: "主页 - %s",
});
</script>

<style scoped>
.login {
  width: 800px;
  height: 555px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login .footer-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.login .footer-tools a {
  color: var(--n-color-text-light);
}

.login .n-form-item {
  display: block;
}

.login .n-form-item:first-child {
  margin-top: 20px;
}

.login>.n-card {
  --n-padding-top: 0;
  --n-padding-bottom: 0;
  --n-padding-left: 0;
}

.login .n-card {
  width: 100%;
  height: 100%;
}

.login .gird-box {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 550px;
}

.n-tab-pane {
  padding: 0 !important;
  margin: 0 !important;
}

@media screen and (max-width: 768px) {
  .login {
    width: 100%;
    min-height: 100%;
    left: 0;
    top: 0;
    transform: none;
  }

  .login .gird-box {
    height: 100vh;
  }
}

.license {
  margin-top: 2px;
  font-size: 10px;
  color: grey;
}

.license a {
  color: cornflowerblue;
}
</style>
