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
            <n-input placeholder="搜索">
              <template #prefix>
                <n-icon :component="SearchOutline" />
              </template>
            </n-input>
            <n-button
              style="width: 36px"
              strong
              secondary
              type="primary"
              @click="nowChat = null"
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
              v-for="list in chatList"
              :title="list.title"
              size="small"
              :class="[list._id === nowChat!._id ? 'active' : '']"
            >
              <template #header-extra>
                <n-button-group size="tiny">
                  <n-button strong secondary circle>
                    <template #icon>
                      <n-icon>
                        <PencilOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button strong secondary circle type="error">
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
                src="https://source.yby.zone/avatar.jpg"
                round
                size="medium"
              />
            </template>
            <template #header>
              <span class="nickname">{{ user.username }}</span>
            </template>
            <template #header-extra>
              <n-button strong secondary circle size="small">
                <n-icon>
                  <SettingsOutline />
                </n-icon>
              </n-button>
            </template>
            <template #description>
              <span>4000/5000</span>
              <n-progress type="line" status="success" :percentage="80">
                80%
              </n-progress>
            </template>
          </n-thing>
        </n-layout-footer>
      </n-layout-sider>
      <n-layout>
        <n-layout-header
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
              >新的聊天</span
            >
          </div>
          <div>
            <n-button-group size="small">
              <n-button ghost circle>
                <template #icon>
                  <n-icon>
                    <PencilOutline />
                  </n-icon>
                </template>
              </n-button>
              <n-button ghost circle>
                <template #icon>
                  <n-icon>
                    <TrashBinOutline />
                  </n-icon>
                </template>
              </n-button>
            </n-button-group>
          </div>
        </n-layout-header>
        <n-layout-content content-style="padding: 24px; padding-top: 64px;">
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
            <n-thing v-else v-for="list in nowChat.messages">
              <template #avatar>
                <n-avatar
                  v-if="list.role === 'user'"
                  src="https://source.yby.zone/avatar.jpg"
                />
                <n-avatar
                  v-else
                  :style="{
                    color: getMatchingTextColor(color),
                    backgroundColor: colorToHex(color),
                  }"
                >
                  {{ user.username.slice(0, 2).toLocaleUpperCase() }}
                </n-avatar>
              </template>
              <template #header>
                <span class="time">{{
                  list.created_at!.toLocaleString()
                }}</span>
              </template>
              <template #description>
                <div class="message">{{ list.content }}</div>
              </template>
              <template #footer>
                <n-button-group size="tiny">
                  <n-button strong secondary circle>
                    <template #icon>
                      <n-icon>
                        <RefreshOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button strong secondary circle>
                    <template #icon>
                      <n-icon>
                        <CopyOutline />
                      </n-icon>
                    </template>
                  </n-button>
                  <n-button strong secondary circle>
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
          style="
            min-height: 120px;
            position: absolute;
            width: 100%;
            background-color: white;
          "
        >
          <n-button-group size="small" style="margin-bottom: 10px">
            <n-button>
              <template #icon>
                <n-icon>
                  <BulbOutline />
                </n-icon>
              </template>
              模型
            </n-button>
            <n-button>
              <template #icon>
                <n-icon>
                  <BookOutline />
                </n-icon>
              </template>
              历史消息
            </n-button>
            <n-button>
              <template #icon>
                <n-icon>
                  <HandLeftOutline />
                </n-icon>
              </template>
              <n-checkbox> 单轮对话 </n-checkbox>
            </n-button>
          </n-button-group>
          <n-input
            @keydown.enter.native=""
            autosize
            style="min-height: 100px"
            type="textarea"
            placeholder="开始你的对话..."
          />
          <n-button type="primary" class="fab-btn">
            <n-icon>
              <PaperPlaneOutline />
            </n-icon>
            发送
          </n-button>
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
// pinia stores
import { useAppConfig } from "~/stores/appConfig";
import { useUserConfig } from "~/stores/userConfig";
import { storeToRefs } from "pinia";
import { FormInst, FormItemRule } from "naive-ui";
import { v4 as uuidv4 } from "uuid";
import {
  Response,
  getChatList,
  updateChat,
  deleteChat,
  insertChat,
} from "~/api";

// icons
import {
  AddOutline,
  PaperPlaneOutline,
  BulbOutline,
  BookOutline,
  SettingsOutline,
  CloseOutline,
  HandLeftOutline,
  InformationOutline,
  TrashBinOutline,
  SearchOutline,
  PencilOutline,
  CopyOutline,
  RefreshOutline,
  MenuOutline,
} from "@vicons/ionicons5";

// refs reactive
const appConfig = useAppConfig();
const userConfig = useUserConfig();
const { isMobile, collapsed } = storeToRefs(appConfig);
const { user } = storeToRefs(userConfig);

// avatar color
const color = randomColor();

// chat list
const chatList = ref<chat[]>([]);

// now chat
const nowChat = ref<chat | null>(null);

// getChatList
const getChatLists = () => {
  getChatList().then((res) => {
    const { code, data, msg } = res.data.value as Response<any>;
    if (code === 0) {
      // if data is array , set chatList
      if (Array.isArray(data)) {
        data.forEach((item) => {
          item.messages = JSON.parse(item.messages as string);
        });
        chatList.value = data;
      } else {
        window.$message.error("获取历史记录失败，请重试");
      }
    } else {
      window.$message.error("获取历史记录失败，请重试");
    }
  });
};

const startNewChat = (type: string) => {
  const newChat = {
    type,
    messages: [],
    title: "New Chat",
  };
  nowChat.value = newChat;
};

onMounted(async () => {
  // history.pushState(null, "", '/?chat=1');
  getChatLists();
});

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
  color: #000000;
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

.message {
  display: inline-flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 1px solid #ebedf0;
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  width: auto;
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

.n-card:hover {
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

@media screen and (max-width: 1000px) {
  .chat-list {
    width: 100%;
  }
}
</style>
