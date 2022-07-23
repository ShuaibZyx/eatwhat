<template>
  <div class="login-container" ref="loginBoxRef">
    <Vcode
      :show="isShowValid"
      @success="success"
      @close="close"
      :successText="validSuccessText"
    />
    <div class="login-img">
      <img src="../assets/imgs/shaomai.png" width="100%" />
    </div>
    <div class="login-box">
      <div class="title">
        <i class="el-icon-present">今天吃啥❓</i>
      </div>
      <div class="form">
        <el-tabs v-model="loginType">
          <el-tab-pane label="账号密码" name="loginPassword">
            <el-form
              status-icon
              label-width="40px"
              :model="loginForm"
              :rules="loginFormRules"
              ref="loginFormRef"
              :hide-required-asterisk="true"
            >
              <el-form-item label="电话" prop="userNumb">
                <el-input
                  v-model="loginForm.userNumb"
                  autocomplete="off"
                  prefix-icon="el-icon-user"
                  size="medium"
                  clearable
                  @keyup.enter.native="loginByPassword"
                  @focus.once="showClearBox"
                  placeholder="电话"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="userPwd">
                <el-input
                  v-model="loginForm.userPwd"
                  type="password"
                  prefix-icon="el-icon-lock"
                  autocomplete="off"
                  clearable
                  validate-event
                  size="medium"
                  placeholder="请输入您的密码"
                  :show-password="true"
                  @keyup.enter.native="loginByPassword"
                  @focus.once="showClearBox"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <div class="login-btn">
                  <div>
                    <el-button
                      type="warning"
                      size="small"
                      round
                      icon="el-icon-question"
                      @click="forgetPassword"
                      >忘记密码</el-button
                    >
                    <el-button
                      type="info"
                      size="small"
                      round
                      icon="el-icon-delete"
                      @click="resetLoginForm"
                      >重置</el-button
                    >
                    <el-button
                      type="primary"
                      size="small"
                      round
                      icon="el-icon-check"
                      @click="loginByPassword"
                      >登录</el-button
                    >
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="regist">
            <el-form
              status-icon
              label-width="40px"
              :model="registerForm"
              :rules="registerFormRules"
              ref="registerFormRef"
              :hide-required-asterisk="true"
            >
              <el-form-item label="电话" prop="userNumb">
                <el-input
                  v-model="registerForm.userNumb"
                  autocomplete="off"
                  prefix-icon="el-icon-user"
                  size="medium"
                  clearable
                  @focus.once="showClearBox"
                  placeholder="请输入您的电话号码"
                ></el-input>
              </el-form-item>

              <el-form-item label="密码" prop="userPwd">
                <el-input
                  v-model="registerForm.userPwd"
                  type="password"
                  prefix-icon="el-icon-lock"
                  autocomplete="off"
                  clearable
                  validate-event
                  size="medium"
                  placeholder="请输入您的密码"
                  :show-password="true"
                  @focus.once="showClearBox"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <div class="login-btn">
                  <div>
                    <el-button
                      type="info"
                      size="small"
                      round
                      icon="el-icon-delete"
                      @click="registerFormReset"
                      >重置</el-button
                    >
                    <el-button
                      type="primary"
                      size="small"
                      round
                      icon="el-icon-check"
                      @click="isShowValid = true"
                      >注册</el-button
                    >
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="btns">
        <el-checkbox v-model="autoLogin">7天免登录</el-checkbox>
      </div>
      <div class="logo">
        <div class="logo-img">
          <img src="../assets/imgs/cabbage.jpg" width="100%" />
        </div>
        <div class="right">
          <span>本网站除图片素材外纯原创</span>
          <span>仅供学习交流请勿用作其他用途</span>
          <span>联系方式: 2631667689(QQ)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../js/lineconnect.js";
import Vcode from "vue-puzzle-vcode";
export default {
  name: "Login",
  components: {
    Vcode,
  },
  data() {
    return {
      loginType: "loginPassword",
      // 验证码模态框是否出现
      isShowValid: false,
      loginForm: {
        userNumb: "",
        userPwd: "",
      },
      //注册所用form表单
      registerForm: {
        userNumb: "",
        userPwd: "",
        userId: "",
      },
      //注册时所用的验证规则
      registerFormRules: {
        userNumb: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
        userPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "长度在 6 到 13 个字符",
            trigger: "blur",
          },
        ],
        uid: [
          {
            required: true,
            message: "请输入您的网易云9-10位id",
            trigger: "blur",
          },
          {
            min: 9,
            max: 10,
            message: "长度为9-10个字符",
            trigger: "blur",
          },
        ],
      },
      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        userNumb: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        userPwd: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 13,
            message: "长度在 6 到 13 个字符",
            trigger: "blur",
          },
        ],
      },
      //7天免登录
      autoLogin: true,
      //滑块验证成功时显示的文字
      validSuccessText: "你太棒了",
    };
  },
  methods: {
    // 用户验证码通过了验证
    success(time) {
      this.validSuccessText = `只用了${parseInt(time)}秒 你太快了`;
      // 通过验证后，需要手动隐藏模态框
      this.isShowValid = false;
      this.register();
    },

    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShowValid = false;
    },

    //重置登录表单内容以及验证规则
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
      this.loginForm.userNumb = "";
      this.loginForm.userPwd = "";
    },

    //登录所用方法
    loginByPassword() {
      if (this.loginForm.userNumb === "" || this.loginForm.userPwd === "") {
        this.$message.info("电话号码或密码不得为空哦");
        return;
      }
      //首先进行数据验证
      this.$refs.loginFormRef.validate(async (valid) => {
        //验证不通过直接返回
        if (!valid) return;
        //首先获取已经注册了的所有用户判断该用户是否注册
        const { data: usersRes } = await this.$http.get("user");
        //用户是否注册的标志
        var userRegisterFlag = false;
        usersRes.data.forEach((user) => {
          if (user.userNumb === this.loginForm.userNumb) {
            userRegisterFlag = true;
          }
        });
        if (!userRegisterFlag) {
          this.$message.warning("该账号尚未注册 请先注册后再进行登录");
          return;
        }
        //否则该用户已经注册，调用登录接口
        var { data: user } = await this.$http.get(
          "user/login/" + this.loginForm.userNumb
        );
        user = user.data[0];
        //判断密码是否正确
        if (user.userPwd !== this.loginForm.userPwd) {
          this.$message.warning("密码错误 请重试");
          return;
        }
        //如果密码正确则继续
        //判断用户是否勾选了“7天免登录”
        //如果勾选则将用户信息存入cookie中，期限为7天
        if (this.autoLogin) this.$cookies.set("token", user, "7d");
        //将用户信息存入session
        window.sessionStorage.setItem("user", JSON.stringify(user));
        //登录操作完成后跳转路由
        this.$router.push("/home");
        //显示登陆成功提示消息
        this.$message.success(`✨欢迎你 ${user.userName || "神秘人"}`);
      });
    },

    //注册所用方法
    register() {
      //首先注册时应先验证用户输入的注册信息是否符合输入规范
      this.$refs.registerFormRef.validate(async (valid) => {
        //如果不规范则直接返回
        if (!valid) return;
        //首先获取已经注册了的所有用户判断该用户是否注册
        const { data: usersRes } = await this.$http.get("user");
        //用户是否注册的标志
        var userRegisterFlag = false;
        usersRes.data.forEach((user) => {
          if (user.userNumb === this.registerForm.userNumb) {
            userRegisterFlag = true;
          }
        });
        //已经注册则提示并返回
        if (userRegisterFlag) {
          this.$message.warning("该账号已注册");
          return;
        }
        //未注册则继续注册
        this.registerForm.userId = this.guid();
        const { data: registerRes } = await this.$http.post(
          "user/register",
          this.registerForm
        );
        if (registerRes.code !== 200) {
          this.$message.error("注册失败 请重试");
          return;
        }
        //提示注册成功
        this.$message.success("注册成功");
        this.$notify({
          title: "欢迎来到吃啥-智能菜谱推荐系统",
          message: `请牢记您的密码: ${this.registerForm.userPwd}`,
          position: "top-left",
          type: "success",
          duration: 5000,
        });
        //将用户在注册时输入的基本注册信息赋值给登录表单中，方便用户注册完成后直接进行登录
        this.loginForm.userNumb = this.registerForm.userNumb;
        this.loginForm.userPwd = this.registerForm.userPwd;
        //第一次注册默认7天免登录
        this.autoLogin = true;
        //调用登陆方法
        this.loginByPassword();
      });
    },

    //点击登陆页面的box时将透明度复原
    showClearBox() {
      this.$refs.loginBoxRef.style.opacity = 1;
    },

    //点击注册重置按钮时触发的方法
    registerFormReset() {
      //清空输入的数据
      this.registerForm.userNumb = "";
      this.registerForm.userPwd = "";
      //清空验证规则提示
      this.$refs.registerFormRef.resetFields();
    },

    //获取唯一id的方法
    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    //点击忘记密码按钮触发方法
    forgetPassword() {
      this.$prompt("请输入电话号码", "忘记密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern:
          /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
        inputErrorMessage: "电话格式不正确",
      }).then(async ({ value }) => {
        //首先获取已经注册了的所有用户判断该用户是否注册
        const { data: usersRes } = await this.$http.get("user");
        //用户是否注册的标志
        var userRegisterFlag = false;
        usersRes.data.forEach((user) => {
          if (user.userNumb === value) {
            userRegisterFlag = true;
          }
        });
        //本系统只为学习交流,密码无任何价值,所以直接提示
        if (userRegisterFlag) {
          const { data: userPwdRes } = await this.$http.get(
            "user/login/forgetpass/" + value
          );
          this.$message({
            message: `你的密码是: ${userPwdRes.data[0].userPwd}`,
            center: true,
            showClose: true,
            duration: 0,
          });
          //如果标志为false说明该忘记密码的用户不存在，提示并退出
        } else {
          this.$message.warning("账号不存在");
        }
      });
    },
  },
  mounted() {
    //在login组件挂载时将透明度变为0.7
    this.$refs.loginBoxRef.style.opacity = 0.7;
  },
};
</script>
