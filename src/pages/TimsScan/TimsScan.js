// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Viewer)
/*this.prototype.Vue = Vue*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h=>h(App)
})
