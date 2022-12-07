import { EzFormDevtool } from "@/devtool";
import "@/styles/index.scss";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(EzFormDevtool).mount("#app");
