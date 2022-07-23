<template>
  <el-card>
    <div class="header">
      <div class="logo">
        <div class="logo-box">
          <img src="../assets/imgs/cabbage.jpg" alt="" width="100%" />
        </div>
        <div class="logo-btns">
          <el-tooltip
            effect="light"
            content="联系我"
            placement="bottom"
            :enterable="false"
          >
            <el-button
              type="primary"
              size="small"
              circle
              icon="el-icon-message"
              @click="showMyQQ"
            />
          </el-tooltip>
          <el-tooltip
            effect="light"
            content="分享"
            placement="bottom"
            :enterable="false"
          >
            <el-button
              type="success"
              size="small"
              circle
              icon="el-icon-share"
              @click="share"
            />
          </el-tooltip>
        </div>
      </div>
      <div class="desc">
        <span>欢迎访问吃啥-智能菜谱推荐系统</span>
      </div>
      <div class="user">
        <el-tooltip
          effect="light"
          content="返回主页"
          placement="bottom"
          :enterable="false"
        >
          <el-button
            type="primary"
            size="small"
            circle
            icon="el-icon-s-home"
            @click="$router.push('/eat')"
          />
        </el-tooltip>
        <div>
          <el-button
            class="button-group-item"
            type="primary"
            icon="el-icon-arrow-left"
            size="mini"
            @click="switchRoute('back')"
            circle
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            size="mini"
            @click="switchRoute('forward')"
            circle
          ></el-button>
        </div>
        <el-dropdown trigger="click">
          <span>
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-house" v-if="$route.path !== '/eat'"
              ><span @click="$router.push('eat')">返回主页</span>
            </el-dropdown-item>

            <el-dropdown-item icon="el-icon-user" v-if="$route.path === '/eat'"
              ><span @click="$store.commit('SetUserInfoVisible', true)"
                >我的信息</span
              ></el-dropdown-item
            >
            <el-dropdown-item
              icon="el-icon-tickets"
              v-if="$route.path !== '/menurecord'"
              ><span @click="$router.push('menurecord')"
                >历史记录</span
              ></el-dropdown-item
            >

            <el-dropdown-item icon="el-icon-error"
              ><span @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {};
  },
  computed: {
    //用户的名称
    userName() {
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      return user.userName;
    },
  },
  methods: {
    //展示我的QQ
    showMyQQ() {
      this.$message({
        showClose: true,
        duration: 5000,
        type: "success",
        message: "QQ:2631667689",
        center: true,
      });
    },

    //分享复制网页链接
    share() {
      var input = document.createElement("input"); // js创建一个input输入框
      input.value = "121.37.102.50:8087"; // 将需要复制的文本赋值到创建的input输入框中
      document.body.appendChild(input); // 将输入框暂时创建到实例里面
      input.select(); // 选中输入框中的内容
      document.execCommand("Copy"); // 执行复制操作
      document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
      this.$message.success({
        showClose: true,
        duration: 5000,
        type: "success",
        message: "IP地址复制成功",
        center: true,
      });
    },

    //退出登录的方法
    logout() {
      window.sessionStorage.setItem("user", JSON.stringify(null));
      this.$cookies.remove("token");
      this.$message.success("注销成功");
      this.$router.push("/login");
    },

    //路由切换。后退，前进
    switchRoute(state) {
      if (state === "back") {
        this.$router.back();
      } else if (state === "forward") {
        this.$router.forward();
      }
    },
  },
};
</script>
