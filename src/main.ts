import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router/index'

createApp(App).use(Vant).use(router).mount('#app')
