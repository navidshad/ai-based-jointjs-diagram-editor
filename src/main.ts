import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vuetify } from '@/plugins/vuetify'

import App from './App.vue'
import router from './router'
import './events'
import { useConfigStore } from './stores/config'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')

// Send ready signal to parent window.
setTimeout(() => {
  useConfigStore().updateParentWindowWithReadySignal()
}, 500)
