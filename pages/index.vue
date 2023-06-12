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
              <n-button ghost circle>
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
              v-for="list in nowChat.messages.filter((e) => e.choose_flag)"
            >
              <template #avatar>
                <n-avatar
                  v-if="list.role === 'user'"
                  src="https://source.yby.zone/avatar.jpg"
                />
                <n-avatar v-else src="/images/robot.png" />
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
          style="
            min-height: 120px;
            position: absolute;
            width: 100%;
            background-color: white;
          "
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
  startNewModelChat,
  getModelStream,
} from "~/request";

// markdown
import "highlight.js/styles/vs2015.css";
import clipboard from "clipboard";
import { md } from "~/utils/markdownit";
let clipboardjs: any = null;

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

// route
const route = useRoute();
const nowChatId = route.query.chat;

// refs reactive
const appConfig = useAppConfig();
const userConfig = useUserConfig();
const { collapsed } = storeToRefs(appConfig);
const { user } = storeToRefs(userConfig);

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
    window.$message.error("标题不能为空");
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

// sendMessages
const promptValue = ref<string>("");
const sendMessages = () => {
  const value = promptValue.value;
  if (value.trim() === "") {
    window.$message.error("请输入内容");
    return;
  }
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
  // copy message
  const messages = nowChat.value!.messages.map((item) => {
    return {
      _id: item._id,
      role: item.role,
      content: item.content,
      created_at: item.created_at,
      choose_flag: item.choose_flag,
      updated_at: item.updated_at,
    };
  });
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
  startNewModelChat({
    name: "gpt-35-turbo",
    messages: filter!,
  }).then((res) => {
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
      console.log(reference);
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
      window.$message.error("模型启动失败");
    }
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
        data.forEach((item) => {
          item.messages = JSON.parse(item.messages as string);
        });
        chatList.value = data;
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
  const newChat = {
    type,
    messages: [],
    title: "New Chat",
  };
  nowChat.value = newChat;
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
