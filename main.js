import App from './App'
import * as Pinia from 'pinia';
import {showToast} from "@/utils/common.js"

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import "./permission.js"
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.showToast = showToast
  app.use(Pinia.createPinia());
  return {
    app,
	Pinia
  }
}
// #endif