<template>
  <div id="app">
    <router-view></router-view>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import "./js/lineconnect";
export default {
  name: "app",
  created() {
    //notify提示信息
    this.$notify({
      title: "欢迎来到吃啥-智能菜谱推荐系统",
      message: "学习交流所用,切勿作其他用途",
      position: "top-left",
      type: "success",
      duration: 8000,
    });
  },
  mounted() {
    //判断cookie中是否有该用户的字段，如果有则说明有七天免登录
    var user = this.$cookies.get("token");
    if (user) {
      window.sessionStorage.setItem("user", JSON.stringify(user));
      this.$router.push("/eat");
    }
  },
};
</script>
