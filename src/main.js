import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import VueClipboard from "vue-clipboard2"

Vue.use(VueClipboard)
Vue.use(require('vue-wechat-title'))
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app")
