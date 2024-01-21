import { EzFormDevtool } from "@niku/ez-form-vue-devtools-old";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).use(EzFormDevtool).mount("#app");
