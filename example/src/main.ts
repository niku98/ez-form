import EzFormPlugin from "@niku/ez-form";
import "@niku/ez-form/styles/index.css";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).use(EzFormPlugin).mount("#app");
