import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/routes";
import ElementPlus from "element-plus";
import "~/styles/index.scss";
import "uno.css";
import "element-plus/theme-chalk/src/message.scss";
import { createPinia } from "pinia";
import 'leaflet/dist/leaflet.css';


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount("#app");
