import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/css/app.css";
import bjcVue from 'primevue/config'

createApp(App).use(router).use(createPinia()).use(bjcVue).mount('#app')