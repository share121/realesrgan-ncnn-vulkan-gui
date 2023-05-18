import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import router from './router'
import './assets/styles.css'
import App from './App.vue'

createApp(App).use(createPinia().use(piniaPersist)).use(router).mount('#app')
