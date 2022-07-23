import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //用户个人信息可见性
    userInfoVisible: false,
  },
  mutations: {
    //设置用户信息抽屉可见性
    SetUserInfoVisible(state, value) {
      state.userInfoVisible = value;
    },
  },
});
