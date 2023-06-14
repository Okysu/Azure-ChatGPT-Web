/// <reference types="vite/client" />
declare interface Window {
  $message: MessageApiInjection;
  $dialog: DialogApiInjection;
  $loadingbar: LoadingBarInst;
  $notify: NotificationApiInjection;
}

declare module 'markdown-it-katex';