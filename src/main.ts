import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { key, store } from "./store/appStore";

const app = createApp(App);

app.use(router).use(store, key);

app.mount("#app");
