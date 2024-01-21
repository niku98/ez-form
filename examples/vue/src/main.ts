import { EzFormDevtool } from "@niku/ez-form-vue-devtools-old";
import EzFormPlugin from "@niku/ez-form-vue/plugin";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).use(EzFormDevtool).use(EzFormPlugin).mount("#app");
