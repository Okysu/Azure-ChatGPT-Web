<template>
  <div>
    <n-layout style="height: 100vh" has-sider>
      <n-layout-sider
        content-style="padding: 16px"
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="0"
        :width="264"
        :native-scrollbar="false"
        v-model:collapsed="collapsed"
        @contextmenu.prevent=""
      >
        <n-layout-header bordered style="width: 240px">
          <div style="display: flex; gap: 4px">
            <n-input placeholder="搜索" v-model:value="filterValue">
              <template #prefix>
                <n-icon :component="SearchOutline" />
              </template>
            </n-input>
            <n-button
              style="width: 36px"
              strong
              secondary
              type="primary"
              @click="createNewChat"
            >
              <template #icon>
                <n-icon :component="AddOutline" />
              </template>
            </n-button>
          </div>
        </n-layout-header>
        <n-layout-content>
          <div class="message-list">
            <n-card
              v-for="list in chatListFilter"
              :title="list.title"
              size="small"
              :class="[list._id === nowChat?._id ? 'active' : '']"
              @click="changeNowChat(list)"
            >
              <template #header-extra>
                <n-button-group size="tiny">
                  <n-button strong secondary circle @click="setTitle(list)">
                    <template #icon>
                      <n-icon>
                        <PencilOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button
                    strong
                    secondary
                    circle
                    type="error"
                    @click="deleteNowChat(list._id!)"
                  >
                    <template #icon>
                      <n-icon>
                        <TrashBinOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-button-group>
              </template>
            </n-card>
          </div>
        </n-layout-content>
        <n-layout-footer
          v-if="!collapsed"
          class="fixed-bottom"
          style="width: 264px; flex-grow: 1; height: 106px"
        >
          <n-thing>
            <template #avatar>
              <n-avatar
                @click="goToInfoPage('info')"
                :src="user.avatar"
                size="medium"
              />
            </template>
            <template #header>
              <span class="nickname">{{ user.username }}</span>
            </template>
            <template #header-extra>
              <n-button
                @click="goToInfoPage('system')"
                strong
                secondary
                circle
                size="small"
              >
                <n-icon>
                  <SettingsOutline />
                </n-icon>
              </n-button>
            </template>
            <template #description>
              <div style="display: flex; justify-content: space-between">
                <span
                  >{{ Math.round(computedWallet.rest) }} /
                  {{ Math.round(computedWallet.total) }}</span
                >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    gap: 3px;
                  "
                >
                  <n-a @click="getWalletInfo">刷新</n-a>
                  <n-a @click="goToInfoPage('wallet')">详情</n-a>
                </div>
              </div>
              <n-progress
                type="line"
                status="success"
                :percentage="(computedWallet.rest / computedWallet.total) * 100"
              >
                {{
                  Math.round((computedWallet.rest / computedWallet.total) * 100)
                }}
                %
              </n-progress>
            </template>
          </n-thing>
        </n-layout-footer>
      </n-layout-sider>
      <n-layout>
        <n-layout-header
          v-if="nowChat"
          style="
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
          bordered
        >
          <div style="display: flex; align-items: center; gap: 18px">
            <n-button
              style="width: 34px"
              strong
              secondary
              @click="collapsed = !collapsed"
            >
              <template #icon>
                <n-icon>
                  <MenuOutline />
                </n-icon>
              </template>
            </n-button>
            <span
              style="
                margin: 0;
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              >{{ nowChat.title || "New Chat" }}</span
            >
          </div>
          <div>
            <n-button-group v-if="nowChatSaveFlag" size="small">
              <n-button ghost circle @click="setNowChatTitle">
                <template #icon>
                  <n-icon>
                    <PencilOutline />
                  </n-icon>
                </template>
              </n-button>
              <n-button ghost circle @click="showModalOptions = true">
                <template #icon>
                  <n-icon>
                    <BulbOutline />
                  </n-icon>
                </template>
              </n-button>
              <n-button ghost circle @click="deleteNowChat(nowChat._id!)">
                <template #icon>
                  <n-icon>
                    <TrashBinOutline />
                  </n-icon>
                </template>
              </n-button>
            </n-button-group>
          </div>
        </n-layout-header>
        <n-layout-content
          content-style="padding: 24px; padding-top: 64px; max-width: 100%"
        >
          <div class="chat-list" :style="`${!nowChat ? 'height: 100vh;' : ''}`">
            <div v-if="!nowChat">
              <n-result
                status="418"
                title="让我们开始吧！"
                description="请选择一个你喜欢的任务。"
              >
                <template #footer>
                  <n-grid :cols="2" x-gap="12">
                    <n-gi>
                      <div @click="startNewChat('chat')" class="task">
                        对话生成
                      </div>
                    </n-gi>
                    <n-gi>
                      <div @click="startNewChat('image')" class="task">
                        绘画创作
                      </div>
                    </n-gi>
                  </n-grid>
                </template>
              </n-result>
            </div>
            <n-thing
              v-else
              v-for="list in nowChat.messages.filter(
                (e) => e.choose_flag && e.role !== 'system'
              )"
            >
              <template #avatar>
                <n-avatar
                  v-if="list.role === 'user'"
                  :src="user.avatar || 'https://source.yby.zone/avatar.jpg'"
                />
                <n-avatar
                  :style="{
                    color: getMatchingTextColor(color),
                    backgroundColor: colorToHex(color),
                  }"
                  v-else-if="list.role === 'system'"
                >
                  <n-icon>
                    <KeyOutline />
                  </n-icon>
                </n-avatar>
                <n-avatar
                  :style="{
                    color: getMatchingTextColor(color),
                    backgroundColor: colorToHex(color),
                  }"
                  v-else
                >
                  <n-icon>
                    <CompassOutline />
                  </n-icon>
                </n-avatar>
              </template>
              <template #header>
                <span class="time">{{
                  new Date(list.created_at!).toLocaleString()
                }}</span>
              </template>
              <template #description>
                <div v-html="md.render(list.content)" class="message"></div>
              </template>
              <template #footer>
                <n-button-group size="tiny">
                  <n-button
                    v-if="list.role === 'user'"
                    strong
                    secondary
                    circle
                    @click="refreshMessage(nowChat, list)"
                  >
                    <template #icon>
                      <n-icon>
                        <RefreshOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button
                    strong
                    secondary
                    circle
                    class="copy-btn"
                    :data-clipboard-text="list.content"
                  >
                    <template #icon>
                      <n-icon>
                        <CopyOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button
                    strong
                    secondary
                    circle
                    @click="deleteMessage(list._id!)"
                  >
                    <template #icon>
                      <n-icon>
                        <TrashBinOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-button-group>
              </template>
            </n-thing>
          </div>
        </n-layout-content>
        <n-layout-footer
          v-if="nowChat !== null"
          class="fixed-bottom"
          bordered
          style="min-height: 120px; position: absolute; width: 100%"
        >
          <n-button-group size="small" style="margin-bottom: 10px">
          </n-button-group>
          <n-input
            v-model:value="promptValue"
            @keydown.enter.native="quickSend"
            autosize
            style="min-height: 100px"
            type="textarea"
            placeholder="开始你的对话..."
          />
          <n-button type="primary" class="fab-btn" @click="sendMessages">
            <n-icon>
              <PaperPlaneOutline />
            </n-icon>
            发送
          </n-button>
        </n-layout-footer>
      </n-layout>
    </n-layout>
    <n-modal v-model:show="showModalOptions">
      <n-card
        class="modal-card"
        title="模型设置"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button circle strong secondary @click="showModalOptions = false">
            <n-icon>
              <CloseOutline />
            </n-icon>
          </n-button>
        </template>
        <n-tabs type="line" animated>
          <n-tab-pane name="basic" tab="基础设置">
            <n-scrollbar style="max-height: 540px">
              <n-form-item label-placement="left" size="small" label="模型角色">
                <n-input
                  v-model:value="nowChat!.options!.playRole"
                  type="textarea"
                  placeholder="例如：你可以设置模型角色为“你是精通中国历史的历史学家”，那么模型将更加倾向于回答关于历史的问题。"
                />
              </n-form-item>
              <n-form-item
                label-placement="left"
                size="small"
                label="最长生成长度"
                :show-feedback="false"
              >
                <n-slider
                  :min="100"
                  :max="4000"
                  v-model:value="nowChat!.options!.maxTokens"
                  :step="10"
                />
                <n-input-number
                  style="max-width: 120px; margin-left: 15px"
                  v-model:value="nowChat!.options!.maxTokens"
                  :min="100"
                  :max="4000"
                  size="small"
                />
              </n-form-item>
              <n-text depth="3">
                令牌数量越大，模型生成的文本越长，但可能会耗费更多Token哦。
              </n-text>
              <n-form-item
                style="margin-top: 24px"
                label-placement="left"
                size="small"
                label="温度"
                :show-feedback="false"
              >
                <n-slider
                  :min="0"
                  :max="2"
                  v-model:value="nowChat!.options!.temperature"
                  :step="0.1"
                />
                <n-input-number
                  style="max-width: 100px; margin-left: 15px"
                  v-model:value="nowChat!.options!.temperature"
                  :min="0"
                  :max="2"
                  size="small"
                />
              </n-form-item>
              <n-text depth="3">
                温度越高，模型生成的文本越随机，对于富有创造力的生成要求，我们推荐为0.9，对有明确答案的生成，我们建议设置为0。
              </n-text>
              <n-form-item
                style="margin-top: 24px"
                label-placement="left"
                size="small"
                label="Top P"
                :show-feedback="false"
              >
                <n-slider
                  :min="0"
                  :max="1"
                  v-model:value="nowChat!.options!.topP"
                  :step="0.1"
                />
                <n-input-number
                  style="max-width: 100px; margin-left: 15px"
                  v-model:value="nowChat!.options!.topP"
                  :min="0"
                  :max="1"
                  size="small"
                />
              </n-form-item>
              <n-text depth="3">
                当值为0.1意味着只考虑包含前10%概率质量的内容生产。我们通常建议更改此设置或温度，但不要同时更改这两者。
              </n-text>
              <n-form-item
                style="margin-top: 24px"
                label-placement="left"
                size="small"
                label="频率惩罚"
                :show-feedback="false"
              >
                <n-slider
                  :min="-2"
                  :max="2"
                  v-model:value="nowChat!.options!.frequencyPenalty"
                  :step="0.1"
                />
                <n-input-number
                  style="max-width: 100px; margin-left: 15px"
                  v-model:value="nowChat!.options!.frequencyPenalty"
                  :min="-2"
                  :max="2"
                  size="small"
                />
              </n-form-item>
              <n-text depth="3">
                当设置为较高的值时，生成文本会更加辞藻华丽，避免出现过于常见的单词或短语。
              </n-text>
              <n-form-item
                style="margin-top: 24px"
                label-placement="left"
                size="small"
                label="存在惩罚"
                :show-feedback="false"
              >
                <n-slider
                  :min="-2"
                  :max="2"
                  v-model:value="nowChat!.options!.presencePenalty"
                  :step="0.1"
                />
                <n-input-number
                  style="max-width: 100px; margin-left: 15px"
                  v-model:value="nowChat!.options!.presencePenalty"
                  :min="-2"
                  :max="2"
                  size="small"
                />
              </n-form-item>
              <n-text depth="3">
                当设置为较高的值时，生成文本会更加多样化，避免出现重复的内容。
              </n-text>
              <n-form-item
                style="margin-top: 24px"
                label-placement="left"
                size="small"
                label="单对话模式"
                :show-feedback="false"
              >
                <n-switch v-model:value="nowChat!.options!.singleMode">
                  <template #checked> 已开启 单对话模式 </template>
                  <template #unchecked> 已关闭 单对话模式 </template>
                </n-switch>
              </n-form-item>
              <n-text depth="3">
                对于关联性不强的对话，我们建议开启此模式。并且，此模式下，所消耗的Token数量会减少。与此同时，单对话模式下刷新消息将不可用。
              </n-text>
            </n-scrollbar>
          </n-tab-pane>
          <n-tab-pane name="history" tab="历史消息">
            <n-scrollbar style="max-height: 540px">
              <n-thing
                v-for="list in nowChat!.messages.filter(e=>e.role !== 'system')"
              >
                <template #avatar>
                  <n-avatar
                    v-if="list.role === 'user'"
                    :src="user.avatar || 'https://source.yby.zone/avatar.jpg'"
                  />
                  <n-avatar
                    :style="{
                      color: getMatchingTextColor(color),
                      backgroundColor: colorToHex(color),
                    }"
                    v-else-if="list.role === 'system'"
                  >
                    <n-icon>
                      <KeyOutline />
                    </n-icon>
                  </n-avatar>
                  <n-avatar
                    :style="{
                      color: getMatchingTextColor(color),
                      backgroundColor: colorToHex(color),
                    }"
                    v-else
                  >
                    <n-icon>
                      <CompassOutline />
                    </n-icon>
                  </n-avatar>
                </template>
                <template #header>
                  <span class="time">{{
                    new Date(list.created_at!).toLocaleString()
                  }}</span>
                </template>
                <template #description>
                  <div v-html="md.render(list.content)" class="message"></div>
                </template>
                <template #header-extra>
                  <n-switch v-model:value="list.choose_flag">
                    <template #checked> 已选中 </template>
                    <template #unchecked> 已舍弃 </template>
                  </n-switch>
                </template>
                <template #footer>
                  <n-button-group size="tiny">
                    <n-button
                      strong
                      secondary
                      circle
                      class="copy-btn"
                      :data-clipboard-text="list.content"
                    >
                      <template #icon>
                        <n-icon>
                          <CopyOutline />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-button-group>
                </template>
              </n-thing>
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
        <template #footer>
          <div style="display: flex; justify-content: space-between">
            <n-text depth="3">
              修改将立即生效，但仅限于本次设置有效，若想将配置内容保存到会话记录漫游，可以选择上传到服务器。
            </n-text>
            <n-button @click="updateModelOptions"> 上传到服务器 </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showSettinglOptions">
      <n-card
        class="modal-card"
        title="应用设置"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button
            circle
            strong
            secondary
            @click="showSettinglOptions = false"
          >
            <n-icon>
              <CloseOutline />
            </n-icon>
          </n-button>
        </template>
        <n-tabs v-model:value="settingTabsValue" type="line" animated>
          <n-tab-pane tab="个人信息" name="info">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <n-avatar :src="user.avatar" round :size="100" />
            </div>
            <div style="text-align: center; margin-top: 10px">
              <n-text>{{ user.username }}</n-text>
            </div>
            <n-form-item label="用户头像">
              <n-input
                v-model:value="user.avatar"
                placeholder="输入Q+你的QQ号将自动获取你的QQ头像，或者自行使用网络图片。"
                @blur="onAvatarChange"
              />
            </n-form-item>
            <n-form-item label="用户昵称">
              <n-input
                v-model:value="user.username"
                placeholder="输入你的昵称"
              />
            </n-form-item>
            <n-space>
              <n-button size="small" secondary strong @click="update">
                保存
              </n-button>
              <n-button
                size="small"
                secondary
                strong
                type="error"
                @click="logout"
              >
                退出登录
              </n-button>
            </n-space>
          </n-tab-pane>
          <n-tab-pane tab="余额管理" name="wallet">
            <n-grid :cols="3">
              <n-gi>
                <n-statistic label="倍率" :value="user.expense_base" />
              </n-gi>
              <n-gi>
                <n-statistic label="拥有" :value="computedWallet.total" />
              </n-gi>
              <n-gi>
                <n-statistic label="剩余" :value="computedWallet.rest" />
              </n-gi>
            </n-grid>
            <n-space>
              <n-button @click="walletPush"> 卡密充值 </n-button>
            </n-space>
            <n-data-table
              :data="wallet"
              :columns="columns"
              style="margin-top: 10px"
              :pagination="pagination"
              max-height="calc(100vh - 500px)"
            />
          </n-tab-pane>
          <n-tab-pane tab="系统设置" name="system">
            <n-form-item label="主题配色">
              <n-select v-model:value="theme" :options="themeOptions" />
            </n-form-item>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
// pinia stores
import { useAppConfig } from "~/stores/appConfig";
import { useUserConfig } from "~/stores/userConfig";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import {
  Response,
  getChatList,
  updateChat,
  deleteChat,
  insertChat,
  startNewModelChat,
  getModelStream,
  getWallet,
  pushWallet,
  updateUser,
  logout as userlogout,
} from "~/request";

// markdown
import "highlight.js/styles/vs2015.css";
import clipboard from "clipboard";
import { md } from "~/utils/markdownit";
let clipboardjs: ClipboardJS | null = null;

// icons
import {
  AddOutline,
  PaperPlaneOutline,
  BulbOutline,
  SettingsOutline,
  CloseOutline,
  KeyOutline,
  TrashBinOutline,
  SearchOutline,
  PencilOutline,
  CopyOutline,
  RefreshOutline,
  MenuOutline,
  CompassOutline,
} from "@vicons/ionicons5";

// route
const route = useRoute();
const router = useRouter();
const nowChatId = route.query.chat;

// refs reactive
const appConfig = useAppConfig();
const userConfig = useUserConfig();
const { collapsed, theme } = storeToRefs(appConfig);
const { user } = storeToRefs(userConfig);

const color = randomColor();

// chat list
const chatList = ref<chat[]>([]);

const filterValue = ref<string>("");
const chatListFilter = computed(() => {
  if (!filterValue.value.trim()) return chatList.value;
  return chatList.value.filter(
    (item) =>
      item.title.includes(filterValue.value) ||
      item.messages.some((message) =>
        message.content.includes(filterValue.value)
      )
  );
});

// createNewChat
const createNewChat = () => {
  nowChat.value = null;
  nowChatSaveFlag.value = false;
  history.pushState(null, "", "/");
};

// now chat
const nowChat = ref<chat | null>(null);
const nowChatSaveFlag = ref<boolean>(false);

// changeNowChat
const changeNowChat = (chat: chat) => {
  nowChat.value = chat;
  nowChatSaveFlag.value = true;
  nowChat.value.options = nowChat.value.options || defaultModelOptions;
  history.pushState(null, "", "/?chat=" + chat._id);
};

// setNowChatTitle
const setNowChatTitle = () => {
  const title = prompt("请输入新的对话标题", nowChat.value!.title);
  if (title && title.trim() !== "") {
    nowChat.value!.title = title;
  } else {
    window.$message.error("标题不能为空");
    return;
  }
  if (nowChatSaveFlag.value) {
    updateChat({
      _id: nowChat.value!._id!,
      title: title,
    }).then((res) => {
      const { code } = res.data.value as Response<any>;
      if (code !== 0) {
        window.$message.error("消息保存失败，可能会导致无法漫游");
      } else {
        getChatLists(false);
      }
    });
  }
};

// setTitle
const setTitle = (chat: chat) => {
  const title = prompt("请输入新的对话标题", chat.title);
  if (title && title.trim() !== "") {
    chat.title = title;
  } else {
    return;
  }
  updateChat({
    _id: chat._id!,
    title: title,
  }).then((res) => {
    const { code } = res.data.value as Response<any>;
    if (code !== 0) {
      window.$message.error("消息保存失败，可能会导致无法漫游");
    } else {
      getChatLists(false);
    }
  });
};

// refreshMessage
const refreshMessage = (chat: chat, message: messages) => {
  if (nowChat.value?.options?.singleMode) {
    window.$message.error("单消息模式下刷新消息将不可用");
    return;
  }
  addPlayRole(chat.options?.playRole || "");
  // if role is user, get the next assistant message
  if (message.role === "user") {
    const startIndex = chat.messages.findIndex(
      (item) => item._id === message._id
    );
    // search the next assistant message
    let nextAssistantMessage = chat.messages.find(
      (item, index) =>
        index > startIndex && item.role === "assistant" && item.choose_flag
    );
    // cut the message list
    if (!nextAssistantMessage) {
      const _id = uuidv4();
      const replyMessage = {
        _id: _id,
        role: "assistant",
        content: "正在思考中...",
        choose: true,
        created_at: new Date(),
        choose_flag: true,
      } as messages;
      nowChat.value!.messages.push(replyMessage);
      nextAssistantMessage = nowChat.value!.messages.find(
        (item) => item._id === _id
      );
    }
    nextAssistantMessage!.content = "正在思考中...";
    const messages = chat.messages.slice(0, startIndex + 1);
    const filter = messages
      .filter((e) => e.choose_flag)
      .map((e) => {
        return {
          role: e.role,
          content: e.content,
        };
      });
    startNewModelChat({
      name: "gpt-35-turbo",
      messages: filter,
    })
      .then((res) => {
        const { code, data } = res.data.value as Response<any>;
        if (code === 0) {
          // copy message
          let messages = nowChat.value!.messages.map((item) => {
            return {
              _id: item._id,
              role: item.role,
              content: item.content,
              created_at: item.created_at,
              choose_flag: item.choose_flag,
              updated_at: item.updated_at,
            };
          });
          getModelStream(data._id)
            .then((res) => {
              if (!res.body) return;
              const reader = res.body.getReader();
              const decoder = new TextDecoder("utf-8");
              let result = "";

              async function readStream(): Promise<any> {
                const { done, value } = await reader.read();
                if (done) {
                  messages = nowChat.value!.messages.map((item) => {
                    return {
                      _id: item._id,
                      role: item.role,
                      content: item.content,
                      created_at: item.created_at,
                      choose_flag: item.choose_flag,
                      updated_at: item.updated_at,
                    };
                  });
                  return result;
                }
                const chunk = decoder.decode(value, { stream: true });
                result += chunk;
                if (nextAssistantMessage) {
                  nextAssistantMessage.content = result;
                }
                return readStream();
              }
              return readStream();
            })
            .then((res) => {
              nextAssistantMessage!.updated_at = new Date();
              updateChat({
                _id: nowChat.value!._id!,
                messages: messages,
              }).then((res) => {
                const { code } = res.data.value as Response<any>;
                if (code !== 0) {
                  window.$message.error("消息保存失败，可能会导致无法漫游");
                } else {
                  nowChatSaveFlag.value = true;
                  getChatLists(false);
                }
              });
            });
        } else {
          window.$message.error("模型启动失败，或账号余额不足");
        }
      })
      .catch((err) => {
        window.$message.error("模型启动失败，或账号余额不足");
      });
  }
};

// defaultModelOptions
const defaultModelOptions = {
  modelName: "gpt-35-turbo",
  maxTokens: 1000,
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  playRole: "",
  singleMode: false,
};

// sendMessages
const promptValue = ref<string>("");
const sendMessages = () => {
  const value = promptValue.value;
  if (value.trim() === "") {
    window.$message.error("请输入内容");
    return;
  }
  addPlayRole(nowChat.value!.options?.playRole || "");
  nowChatSaveFlag.value =
    nowChat.value!.messages.filter((item) => item.role === "user").length > 0;
  const newMessage = {
    _id: uuidv4(),
    role: "user",
    content: value,
    created_at: new Date(),
    choose_flag: true,
  } as messages;
  nowChat.value!.messages.push(newMessage);
  promptValue.value = "";
  let messages: messages[] = [];
  // if single mode, send only one message
  if (nowChat.value?.options?.singleMode) {
    messages = nowChat.value!.messages.filter((item) => item.role === "system");
    const assistant = nowChat.value!.messages.filter(
      (item) => item.role === "assistant"
    );
    if (assistant.length) {
      messages.push(assistant[assistant.length - 1]);
    }
    messages.push(newMessage);
  } else {
    // copy message don't = nowChat.value!.messages
    messages = nowChat.value!.messages.map((item) => {
      return {
        _id: item._id,
        role: item.role,
        content: item.content,
        created_at: item.created_at,
        choose_flag: item.choose_flag,
        updated_at: item.updated_at,
      };
    });
  }
  if (nowChatSaveFlag.value) {
    updateChat({
      _id: nowChat.value!._id!,
      messages: messages,
    }).then((res) => {
      const { code } = res.data.value as Response<any>;
      if (code !== 0) {
        window.$message.error("消息保存失败，可能会导致无法漫游");
      }
    });
  } else {
    insertChat({
      type: nowChat.value!.type as "chat" | "image",
      messages: messages,
      options: defaultModelOptions,
    }).then((res) => {
      const { code, data } = res.data.value as Response<any>;
      if (code === 0) {
        nowChat.value!._id = data._id;
        history.pushState(null, "", "/?chat=" + data._id);
      } else {
        window.$message.error("消息保存失败，可能会导致无法漫游");
      }
    });
  }
  getChatLists(false);

  const filter = messages
    .filter((e) => e.choose_flag)
    .map((e) => {
      return {
        role: e.role,
        content: e.content,
      };
    });

  // ready for modelOptions
  const modelOptions = {
    maxTokens: nowChat.value!.options?.maxTokens || 1000,
    temperature: nowChat.value!.options?.temperature || 0.7,
    topP: nowChat.value!.options?.topP || 1,
    frequencyPenalty: nowChat.value!.options?.frequencyPenalty || 0,
    presencePenalty: nowChat.value!.options?.presencePenalty || 0,
  };

  startNewModelChat({
    name: "gpt-35-turbo",
    messages: filter!,
    options: modelOptions,
  })
    .then((res) => {
      const { code, data } = res.data.value as Response<any>;
      if (code === 0) {
        const replyMessage = {
          _id: data._id,
          role: "assistant",
          content: "正在思考中...",
          choose: true,
          created_at: new Date(),
          choose_flag: true,
        } as messages;
        nowChat.value!.messages.push(replyMessage);
        const reference = nowChat.value!.messages.find(
          (item) => item._id === data._id
        );
        // copy message
        let messages = nowChat.value!.messages.map((item) => {
          return {
            _id: item._id,
            role: item.role,
            content: item.content,
            created_at: item.created_at,
            choose_flag: item.choose_flag,
            updated_at: item.updated_at,
          };
        });
        getModelStream(data._id)
          .then((res) => {
            if (!res.body) return;
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let result = "";

            async function readStream(): Promise<any> {
              const { done, value } = await reader.read();
              if (done) {
                messages = nowChat.value!.messages.map((item) => {
                  return {
                    _id: item._id,
                    role: item.role,
                    content: item.content,
                    created_at: item.created_at,
                    choose_flag: item.choose_flag,
                    updated_at: item.updated_at,
                  };
                });
                return result;
              }
              const chunk = decoder.decode(value, { stream: true });
              result += chunk;
              if (reference) {
                reference.content = result;
              }
              return readStream();
            }
            return readStream();
          })
          .then((res) => {
            reference!.created_at = new Date();
            if (nowChatSaveFlag.value) {
              updateChat({
                _id: nowChat.value!._id!,
                messages: messages,
              }).then((res) => {
                const { code } = res.data.value as Response<any>;
                if (code !== 0) {
                  window.$message.error("消息保存失败，可能会导致无法漫游");
                } else {
                  nowChatSaveFlag.value = true;
                  getChatLists(false);
                }
              });
            } else {
              const title = cutTitle(res!);
              updateChat({
                _id: nowChat.value!._id!,
                title: title,
                messages: messages,
              }).then((res) => {
                const { code } = res.data.value as Response<any>;
                if (code !== 0) {
                  window.$message.error("消息保存失败，可能会导致无法漫游");
                } else {
                  nowChatSaveFlag.value = true;
                  nowChat.value!.title = title;
                  getChatLists(false);
                }
              });
            }
          });
      } else {
        window.$message.error("模型启动失败，或账号余额不足");
      }
    })
    .catch((err) => {
      window.$message.error("模型启动失败，或账号余额不足");
    });
};

// deleteMessage
const deleteMessage = (_id: string) => {
  const message = nowChat.value!.messages.find((e) => e._id === _id);
  if (message) {
    window.$dialog.warning({
      title: "删除消息",
      content:
        "确定要删除这条消息吗？但在历史记录里面仍然可以看到这条消息，您仍然可以再次选中它！",
      positiveText: "确定",
      negativeText: "取消",
      transformOrigin: "center",
      onPositiveClick: async () => {
        message.choose_flag = false;
      },
    });
  }
};

const quickSend = (e: KeyboardEvent) => {
  // ctrl + enter send message
  if (e.ctrlKey && e.key === "Enter") {
    sendMessages();
  }
};

// getChatList
const getChatLists = async (needNow: boolean = true) => {
  await nextTick();
  getChatList().then((res) => {
    const { code, data } = res.data.value as Response<any>;
    if (code === 0) {
      // if data is array , set chatList
      if (Array.isArray(data)) {
        data.forEach((item: chat) => {
          item.messages = JSON.parse(item.messages as unknown as string);
          item.options = item.options
            ? JSON.parse(item.options as unknown as string)
            : defaultModelOptions;
        });
        chatList.value = data;
        getWalletInfo();
        if (nowChatId && needNow) {
          const chat = data.find((e) => e._id === nowChatId);
          if (chat) {
            nowChat.value = chat;
            nowChatSaveFlag.value = true;
          } else {
            createNewChat();
          }
        }
      } else {
        window.$message.error("获取历史记录失败，请重试");
      }
    } else {
      window.$message.error("获取历史记录失败，请重试");
    }
  });
};

// delete chat
const deleteNowChat = (_id: string) => {
  window.$dialog.warning({
    title: "删除会话记录",
    content: "确定要删除这条会话记录吗？请注意这是不可逆的操作！",
    positiveText: "确定",
    negativeText: "取消",
    transformOrigin: "center",
    onPositiveClick: async () => {
      deleteChat({
        _id,
      }).then((res) => {
        const { code } = res.data.value as Response<any>;
        if (code === 0) {
          window.$message.success("删除会话记录成功");
          if (nowChat.value?._id === _id) {
            createNewChat();
          }
          getChatLists(false);
        } else {
          window.$message.error("删除会话记录失败，请重新再试");
        }
      });
    },
  });
};

const startNewChat = (type: string) => {
  if (type === "image") {
    window.$message.error("将与GPT4一同上线，敬请期待");
    return;
  }
  const newChat = {
    type,
    messages: [],
    title: "New Chat",
  };
  nowChat.value = newChat;
};

// getWalletInfo
const wallet = ref<wallet[]>([]);
const computedWallet = computed(() => {
  let rest = 0;
  let total = 0;
  wallet.value.forEach((item) => {
    if (item.type === 0) {
      rest += item.count;
      total += item.count;
    } else if (item.type === 1) {
      rest -= item.count;
    }
  });
  return {
    rest,
    total,
  };
});
const getWalletInfo = async () => {
  await nextTick();
  getWallet().then((res) => {
    const { code, data } = res.data.value as Response<any>;
    if (code === 0) {
      // order by time
      data.sort((a: wallet, b: wallet) => {
        return (
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        );
      });
      wallet.value = data;
    }
  });
};

onMounted(async () => {
  getChatLists();
  clipboardjs = new clipboard(".copy-btn");
  clipboardjs.on("success", () => {
    window.$message.success("复制成功");
  });
  clipboardjs.on("error", () => {
    window.$message.success("复制失败");
  });
});

// showModel
const showModalOptions = ref(false);

// addPlayRole
const addPlayRole = (e: string) => {
  if (!e) {
    return;
  }
  // add message to nowChat.messages
  const message = {
    role: "system",
    content: e,
    created_at: new Date(),
    updated_at: new Date(),
    choose_flag: true,
    _id: uuidv4(),
  } as messages;
  if (nowChat.value?.messages[0]?.role === "system") {
    nowChat.value.messages[0] = message;
  } else {
    nowChat.value?.messages.unshift(message);
  }
};

// updateModelOptions
const updateModelOptions = async () => {
  await nextTick();
  const options = nowChat.value?.options;
  updateChat({
    _id: nowChat.value!._id!,
    options: options,
  }).then((res) => {
    const { code } = res.data.value as Response<any>;
    if (code !== 0) {
      window.$message.error("消息保存失败，可能会导致无法漫游");
    }
  });
};

// goToInfoPage
const goToInfoPage = (query?: string) => {
  showSettinglOptions.value = true;
  settingTabsValue.value = query || "info";
};

// showSettinglOptions
const showSettinglOptions = ref(false);
const settingTabsValue = ref("info");

onMounted(async () => {
  getWalletInfo();
});

const logout = () => {
  window.$dialog.warning({
    title: "退出登录",
    content: "确定要退出登录吗？",
    positiveText: "确定",
    negativeText: "取消",
    transformOrigin: "center",
    onPositiveClick: async () => {
      await userlogout();
      userConfig.logout();
      router.push("/login");
    },
  });
};

const update = () => {
  updateUser({
    avatar: user.value.avatar,
    username: user.value.username,
  }).then((res) => {
    const { code } = res.data.value as Response<any>;
    if (code === 0) {
      window.$message.success("修改成功");
    } else {
      window.$message.error("修改失败");
    }
  });
};

const walletPush = () => {
  const key = prompt("请输入充值密钥");
  if (key) {
    window.$dialog.warning({
      title: "充值卡密",
      content: "确定充值本卡密吗？",
      positiveText: "确定",
      negativeText: "取消",
      transformOrigin: "center",
      onPositiveClick: async () => {
        pushWallet({ key }).then((res) => {
          const { code } = res.data.value as Response<any>;
          if (code === 0) {
            window.$message.success("充值成功");
            getWalletInfo();
          } else {
            window.$message.error("充值失败");
          }
        });
      },
    });
  }
};

const columns = [
  {
    title: "消费内容",
    key: "title",
  },
  {
    title: "消费类型",
    key: "type",
    render: (row: wallet) => {
      return h("span", {}, row.type === 1 ? "花费" : "充值");
    },
  },
  {
    title: "数量",
    key: "count",
    render: (row: wallet) => {
      return h("span", {}, row.type === 1 ? `-${row.count}` : `+${row.count}`);
    },
  },
  {
    title: "时间",
    key: "time",
    render: (row: wallet) => {
      return h("span", {}, new Date(row.created_at!).toLocaleString());
    },
  },
];

const onAvatarChange = () => {
  const avatar = user.value.avatar;
  if (avatar.startsWith("Q")) {
    user.value.avatar = `https://q1.qlogo.cn/g?b=qq&nk=${avatar.slice(
      1
    )}&s=100`;
  }
};

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30, 35, 40, 45, 50, 100],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});

const themeOptions = [
  { label: "系统", value: "auto" },
  { label: "亮色", value: "light" },
  { label: "暗色", value: "dark" },
];

// title
useHead({
  titleTemplate: "Playground - %s",
});
</script>

<style scoped>
.n-layout-header {
  position: absolute;
  z-index: 999;
  height: 50px;
  top: 0;
  padding: 12px;
}

.n-input-number {
  width: 100%;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  padding: 12px;
}

.nickname {
  display: inline-block;
  width: 120px;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: ltr;
}

.time {
  font-size: 12px;
  color: darkgray;
  direction: ltr;
}

.message-list {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 106px;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 1000px;
  margin: 0 auto;
  height: calc(100vh - 260px);
}

.fab-btn {
  position: absolute;
  right: 30px;
  bottom: 30px;
}

.message-list .n-card:hover {
  cursor: pointer;
  border: 1px solid var(--n-color-target);
}

.active {
  border: 1px solid var(--n-color-target);
}

.n-avatar:hover {
  cursor: pointer;
}

.n-result {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.task {
  border: 1px solid #ebedf0;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 12px;
  transition: all 0.3s ease-in-out;
}

.task:hover {
  cursor: pointer;
  border: 1px solid #333;
}

.modal-card {
  width: 1000px;
  height: 780px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media screen and (max-width: 1000px) {
  .chat-list {
    width: 100%;
  }

  .modal-card {
    min-height: 100vh;
  }
}
</style>
