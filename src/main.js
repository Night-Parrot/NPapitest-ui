import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import router from 'vue-router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import G2 from '@antv/g2';
// import { Chart } from '@antv/g2';
import axios from 'axios';
// import VueAxios from 'vue-axios'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import VueCookies from 'vue-cookies'
import VueClipboard from 'vue-clipboard2'



Vue.use(VueCookies)
Vue.use(router)
Vue.use(VueClipboard)

axios.interceptors.response.use(function(response) {
  return response
}, function (error) {
  if (error && error.response) {
    switch (error.response.status) {
      case 401: router.replace({path: '/login', query: { redirect: router.currentRoute.fullPath}}); break;
      case 403: router.replace({path: '/page_403'}); break;
    }
  }
  return Promise.reject(error)
});




axios.defaults.withCredentials = true;
// Vue.use(Chart)
Vue.use(Antd)
// Vue.use(VueResource)
// Vue.use(axios)
Vue.use(preview)
Vue.config.productionTip = false
// axios.defaults.baseURL = 'http://127.0.0.1:8585/'; 
axios.defaults.baseURL = 'http://172.18.48.41:8585/apitest';
// axios.defaults.baseURL = 'http://172.18.17.116/apitest'; //生产配置


new Vue({
  router,
  // VueResource,
  axios,
  render: h => h(App)
}).$mount('#app')
