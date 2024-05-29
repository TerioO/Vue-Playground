import { createApp } from 'vue'
// Pinia & Router:
import { createPinia } from 'pinia';
import { router } from './router/router'
// PrimeVue:
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from 'primevue/tooltip';
// App:
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.directive("tooltip", Tooltip);
app.mount("#app");
