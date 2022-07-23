<template>
  <div>
    <!-- 总框架 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <Header></Header>
      </el-header>
      <!-- 主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部部分 -->
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
export default {
  name: "Home",
  components: {
    Header,
    Footer,
  },
};
</script>
