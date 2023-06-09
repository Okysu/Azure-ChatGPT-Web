<template>
  <n-layout style="height: 100vh" has-sider>
    <n-layout-sider content-style="padding: 16px" bordered show-trigger collapse-mode="width" :collapsed-width="0"
      :width="264" :native-scrollbar="false" v-model:collapsed="collapsed" @contextmenu.prevent="">
      <n-layout-header bordered style="width: 240px;">
        <div style="display: flex; gap: 4px;">
          <n-input placeholder="搜索">
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button style="width: 36px;" strong secondary type="primary">
            <template #icon>
              <n-icon :component="AddOutline" />
            </template>
          </n-button>
        </div>
      </n-layout-header>
      <n-layout-content>
        <div class="message-list">
          <n-card v-for="i in 15" title="新的聊天" size="small" :class="[i === 1 ? 'active' : '']">
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
      <n-layout-footer v-if="!collapsed" class="fixed-bottom" style="width: 264px; flex-grow: 1; height: 106px;">
        <n-thing>
          <template #avatar>
            <n-avatar src="https://source.yby.zone/avatar.jpg" round size="medium" />
          </template>
          <template #header>
            <span class="nickname">{{ "Okysu" }}</span>
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
      <n-layout-header style="padding: 15px; display: flex; justify-content: space-between; align-items: center;"
        bordered>
        <span>新的聊天</span>
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
        <div class="chat-list">
          <n-thing v-for="i in 15">
            <template #avatar>
              <n-avatar src="https://source.yby.zone/avatar.jpg" />
            </template>
            <template #header>
              <span class="time">{{ "2023/6/9 07:58:09 " }}</span>
            </template>
            <template #description>
              <div class="message">
                在的，有什么可以帮助您的吗？
              </div>
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
      <n-layout-footer class="fixed-bottom" bordered
        style="min-height: 120px; position: absolute; width: 100%; background-color: white;">
        <n-button-group size="small" style="margin-bottom: 10px;">
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
            <n-checkbox>
              单轮对话
            </n-checkbox>
          </n-button>
        </n-button-group>
        <n-input @keydown.enter.native="" autosize style="min-height: 100px;" type="textarea" placeholder="开始你的对话..." />
        <n-button type="primary" class="fab-btn">
          <n-icon>
            <PaperPlaneOutline />
          </n-icon>
          发送
        </n-button>
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
// pinia stores
import { useAppConfig } from '~/stores/appConfig';
import { useUserConfig } from '~/stores/userConfig';
import { storeToRefs } from 'pinia';
import { FormInst, FormItemRule } from 'naive-ui';
import { Response, request } from '~/api';

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
} from "@vicons/ionicons5";

// refs reactive
const appConfig = useAppConfig();
const userConfig = useUserConfig();
const { isMobile, collapsed } = storeToRefs(appConfig);
const { user } = storeToRefs(userConfig);

// chat list
const chatList = ref<chat[]>([]);

// now chat
const nowChat = ref<chat>();

onMounted(async () => {
  // history.pushState(null, "", '/?chat=1');
});

// title
useHead(
  {
    titleTemplate: 'Playground - %s',
  }
)
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
</style>