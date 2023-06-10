<script setup lang="ts">
import {
  useLoadingBar,
  useDialog,
  useMessage,
  useNotification,
} from "naive-ui";
onMounted(() => {
  if (process.client) {
    window.$loadingbar = useLoadingBar();
    window.$dialog = useDialog();
    window.$message = useMessage();
    window.$notify = useNotification();
  }
});
</script>

<template>
  <div></div>
</template>
