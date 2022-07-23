import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./assets/css/global.css";
import axios from "axios";
import moment from "moment";

//导入nprogress
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

//导入cookies
import VueCookies from "vue-cookies";
Vue.use(VueCookies); // 挂在在全局

Vue.config.productionTip = false;

// 在request拦截器中展示进度条,NProgress.start()
axios.interceptors.request.use((config) => {
  Nprogress.start();
  return config;
});

// 在response拦截器中隐藏进度条,NProgress.done()
axios.interceptors.response.use((config) => {
  Nprogress.done();
  return config;
});

Vue.filter("dataFormat", function (time) {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
});

Vue.prototype.$http = axios;
axios.defaults.baseURL = "/api";
Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
