<script setup lang="ts">
import {
  useLoadingBar,
  useDialog,
  useMessage,
  useNotification,
} from "naive-ui";
onMounted(() => {
  window.$loadingbar = useLoadingBar();
  window.$dialog = useDialog();
  window.$message = useMessage();
  window.$notify = useNotification();
});
</script>

<template>
  <div></div>
</template>
