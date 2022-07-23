<template>
  <el-card>
    <div class="eat">
      <!-- 轮播图 -->
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="(item, index) in carouselData" :key="index">
          <el-tooltip
            class="item"
            effect="light"
            placement="bottom"
            :enterable="false"
            :content="'查看' + item.menuName"
          >
            <div class="carousel" @click="getMenuCompose(item.menuEle, item)">
              <span>{{ item.menuCuis }} : {{ item.menuName }}✨</span>
              <el-image
                :src="item.menuPut"
                fit="contain"
                style="border-radius: 7px; overflow: hidden"
              ></el-image>
            </div>
          </el-tooltip>
        </el-carousel-item>
      </el-carousel>

      <!-- 主体区域内容 -->
      <div class="main-content">
        <!-- 搜索以及标签区域 -->
        <div class="search">
          <div class="category">
            <div class="cuis">
              <span>菜系: </span>
              <el-tag
                type="parmary"
                style="margin: 7px; cursor: pointer"
                v-for="(item, index) in menuCuis"
                :key="index"
                @click="changeSearchCondition(item, 'menuCuis')"
                >{{ item }}</el-tag
              >
            </div>
            <!-- 菜谱口味 -->
            <div class="taste">
              <span>口味: </span>
              <el-tag
                type="warning"
                style="margin: 7px; cursor: pointer"
                v-for="(item, index) in menuTaste"
                :key="index"
                @click="changeSearchCondition(item, 'menuTaste')"
              >
                {{ item }}</el-tag
              >
            </div>
          </div>
          <div class="btn">
            <el-autocomplete
              v-model="search"
              :debounce="2000"
              placement="bottom-end"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @keyup.enter.native="searchMenu"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchMenu"
              ></el-button>
            </el-autocomplete>

            <div
              class="choosed-category"
              v-if="
                choosedCategory[0].value !== '' ||
                choosedCategory[1].value !== ''
              "
            >
              <span>已选标签: </span>
              <el-tag
                style="margin: 7px; cursor: pointer"
                type="success"
                v-for="(item, index) in choosedCategory"
                :key="index"
                >{{ item.value || "暂无" }}</el-tag
              >
            </div>
          </div>
        </div>

        <!-- 主体菜谱展示区域 -->

        <!-- 菜谱展示区域 -->
        <div class="show">
          <!-- 每一个菜谱的展示盒子 -->
          <el-tooltip
            class="item"
            effect="light"
            placement="top"
            :enterable="false"
            v-for="(item, index) in menuPart"
            :key="index"
            :content="'查看' + item.menuName"
          >
            <div class="menu-box" @click="getMenuCompose(item.menuEle, item)">
              <!-- 盒子图片 -->
              <div class="img-box">
                <el-image
                  style="width: 100%"
                  :src="item.menuPut"
                  fit="contain"
                  lazy
                ></el-image>
              </div>
              <!-- 盒子文字介绍 -->
              <div class="title">
                <span>{{ item.menuName }}</span>
              </div>
            </div>
          </el-tooltip>
        </div>

        <!-- 喜好推荐区域 -->
        <span class="userLikeMenu">根据您的喜好为您推荐: </span>
        <div class="show" style="height: auto !important">
          <span v-if="userLikeMenu.length === 0">暂无数据🥶</span>
          <!-- 每一个菜谱的展示盒子 -->
          <el-tooltip
            class="item"
            effect="light"
            placement="top"
            :enterable="false"
            v-for="(item, index) in userLikeMenu"
            :key="index"
            :content="'查看' + item.menuName"
          >
            <div class="menu-box" @click="getMenuCompose(item.menuEle, item)">
              <!-- 盒子图片 -->
              <div class="img-box">
                <el-image
                  style="width: 100%"
                  :src="item.menuPut"
                  fit="contain"
                  lazy
                ></el-image>
              </div>
              <!-- 盒子文字介绍 -->
              <div class="title">
                <span>{{ item.menuName }}</span>
              </div>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 用户信息抽屉 -->
    <el-drawer
      title="我的信息"
      :visible.sync="userInfoVisible"
      direction="btt"
      size="40%"
      ref="drawer"
    >
      <div class="drawer-content">
        <div class="userInfo">
          <el-form
            :model="user"
            label-width="80px"
            size="small"
            ref="userFormRef"
            :rules="userFormRules"
          >
            <div class="left" style="width: 40%">
              <el-form-item label="昵称" prop="userName">
                <el-input
                  prefix-icon="el-icon-user-solid"
                  v-model="user.userName"
                  autocomplete="off"
                  maxlength="8"
                  :clearable="true"
                ></el-input>
              </el-form-item>

              <el-form-item label="电话" prop="userNumb">
                <el-input
                  v-model.number="user.userNumb"
                  autocomplete="off"
                  prefix-icon="el-icon-phone"
                  :clearable="true"
                  maxlength="11"
                  :disabled="true"
                ></el-input>
              </el-form-item>

              <el-form-item label="住址" prop="userAdd">
                <el-cascader
                  style="width: 100%"
                  v-model="user.userAdd"
                  :options="citys"
                  filterable
                  clearable
                  :props="{ expandTrigger: 'hover' }"
                ></el-cascader>
              </el-form-item>
            </div>

            <div class="right" style="width: 40%">
              <el-form-item label="性别" prop="userGend">
                <el-radio-group v-model="user.userGend">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="喜好">
                <el-tag
                  :key="tag"
                  style="margin: 5px"
                  v-for="tag in dynamicUserLikeTags"
                  closable
                  :disable-transitions="false"
                  @close="handleUserLikeClose(tag)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputUserLikeVisible"
                  v-model="inputUserLikeValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ 喜好</el-button
                >
              </el-form-item>
            </div>
            <div class="progress" style="width: 20%">
              <el-progress
                type="circle"
                :percentage="percentage"
                :width="160"
                :color="colors"
                :status="percentageState"
              ></el-progress>
            </div>
          </el-form>
        </div>
        <div class="demo-drawer__footer">
          <el-button type="info" size="small" @click="getUser">重 置</el-button>
          <el-button type="primary" size="small" @click="editUserPassword"
            >修改密码</el-button
          >
          <el-button type="success" size="small" @click="updateUserInfo"
            >确 定</el-button
          >
        </div>
      </div>
    </el-drawer>

    <!-- 展示菜谱详细信息的dialog -->
    <el-dialog
      :title="menuObj.menuName"
      :visible.sync="menuInfoDialogVisible"
      width="65%"
    >
      <div class="menuInfo">
        <div class="menuMain">
          <div class="menuImg">
            <el-image
              style="width: 100%"
              :src="menuObj.menuPut"
              :preview-src-list="menuPreImgs"
              fit="contain"
              lazy
            ></el-image>
          </div>
          <div class="menuPrime">
            <span>菜谱名称: {{ menuObj.menuName }}</span>
            <span>菜系: {{ menuObj.menuCuis }}</span>
            <span>口味: {{ menuObj.menuTaste }}</span>
          </div>
        </div>
        <div class="menuOther">
          <div class="menuLevel">
            <span style="margin-right: 12px">上手难度: </span>
            <el-rate v-model="menuObj.menuLevel" disabled text-color="#ff9900">
            </el-rate>
          </div>
          <div class="menuPrice">
            <span>价格: {{ menuObj.menuPrice }} 元</span>
          </div>
        </div>
        <div class="menuComposeTable">
          <span>菜谱组成: </span>
          <el-table
            :data="menuObj.menuEle"
            :highlight-current-row="true"
            style="width: 100%"
            height="300"
            :stripe="true"
            :border="true"
            size="small"
            fit
          >
            <el-table-column label="食材图片" width="120" align="center">
              <template slot-scope="scope">
                <el-image
                  style="width: 100%"
                  :src="scope.row.ingrePut"
                  fit="contain"
                  :preview-src-list="ingredientPreImgs"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="食材名称" prop="ingreName" align="center">
            </el-table-column>
            <el-table-column label="食材产地" width="280" align="center">
              <template slot-scope="scope">
                <el-tag
                  style="margin-right: 7px"
                  v-for="(item, index) in scope.row.ingreAdd.split('/')"
                  :key="index"
                  size="mini"
                  type="primary"
                  effect="dark"
                  >{{ item }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="食材属性" prop="ingreAttr" align="center">
            </el-table-column>
            <el-table-column label="食材价格" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.ingrePrice }} 元</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="menuBrief">
          <span>菜谱简介及制作步骤: </span>
          <el-input
            type="textarea"
            :rows="7"
            placeholder="菜谱简介"
            v-model="menuObj.menuBrief"
          >
          </el-input>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import citys from "../js/citys";
export default {
  name: "Eat",
  data() {
    return {
      //轮播图数据
      carouselData: [],
      //菜谱数组
      menu: [],
      //菜谱实际展示数组
      menuPart: [],
      //搜索条件
      search: "",
      //搜索关键词推荐数组
      searchRecommend: [],
      //当前用户
      user: {
        userId: "",
        userPwd: "123456",
        userName: "神秘人",
        userNumb: "",
        userLike: "",
        userAdd: "",
        userGend: "男",
      },
      //用户数据修改校验规则
      userFormRules: {
        userName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            min: 1,
            max: 8,
            message: "长度在 1 到 8 个字符",
            trigger: "blur",
          },
        ],
        userNumb: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern:
              /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/,
            message: "手机号码格式不符合",
            trigger: "blur",
          },
        ],
        userAdd: [{ required: true, message: "住址不可为空", trigger: "blur" }],
        userGend: [
          { required: true, message: "性别不可为空", trigger: "blur" },
        ],
      },
      //已选择的标签数组
      choosedCategory: [
        {
          category: "menuCuis",
          value: "全部",
        },
        {
          category: "menuTaste",
          value: "全部",
        },
      ],
      //菜系数组
      menuCuis: [
        "川湘菜",
        "鲁菜",
        "东北菜",
        "西北菜",
        "粤菜",
        "徽菜",
        "西餐",
        "主食",
        "全部",
      ],
      //菜谱口味
      menuTaste: [
        "甜",
        "酸",
        "辣",
        "咸",
        "酸辣",
        "酸甜",
        "清淡",
        "苦涩",
        "鲜香",
        "全部",
      ],
      //城市数据
      citys,
      //用户信息填写进度显示
      percentage: 0,
      //用户填写信息进度条状态
      percentageState: "warning",
      //用户信息填写进度颜色
      colors: [
        { color: "#e6a23c", percentage: 25 },
        { color: "#1989fa", percentage: 50 },
        { color: "#1989fa", percentage: 75 },
        { color: "#5cb87a", percentage: 100 },
      ],
      //菜谱信息展示所用dialog可见性
      menuInfoDialogVisible: false,
      //此时展示的菜谱信息对象
      menuObj: {
        menuName: "",
        menuEle: [],
        menuTaste: "",
        menuCuis: "",
        menuBrief: "",
        menuLevel: "",
        menuPut: "",
        menuPrice: "",
      },
      //菜谱大图数组
      menuPreImgs: [],
      //菜谱组成食材大图数组
      ingredientPreImgs: [],
      //用户喜好数组
      dynamicUserLikeTags: [],
      //用户喜好tag输入框可见性
      inputUserLikeVisible: false,
      //用户再喜好输入框内输入的值
      inputUserLikeValue: "",
      //用户喜好推荐菜谱数组
      userLikeMenu: [],
    };
  },
  computed: {
    //用户信息抽屉可见性
    userInfoVisible: {
      get() {
        return this.$store.state.userInfoVisible;
      },
      set(val) {
        this.$store.commit("SetUserInfoVisible", val);
      },
    },
  },
  methods: {
    //获取所有菜谱
    async getMenu() {
      const { data: menuRes } = await this.$http.get("menu");
      this.menu = menuRes.data;
      this.menuPart = this.menu;
      for (let i = 0; i < 6; i++) {
        this.carouselData.push(
          menuRes.data[parseInt(this.getRandom(menuRes.data.length))]
        );
      }
      menuRes.data.forEach((item) => {
        this.searchRecommend.push({
          value: item.menuName,
        });
        this.menuPreImgs.push(item.menuPut);
      });
    },

    //获得随机数的方法--存在重复问题
    getRandom(length) {
      return Math.floor(Math.random() * length);
    },

    //搜索条件下拉框回调
    querySearch(queryString, cb) {
      var searchRecommend = this.searchRecommend;
      var results = queryString
        ? searchRecommend.filter(this.createFilter(queryString))
        : searchRecommend;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    //搜索所有过滤器
    createFilter(queryString) {
      return (recommendMenu) => {
        return (
          recommendMenu.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    //点击标签方法
    changeSearchCondition(item, category) {
      this.choosedCategory.forEach((e) => {
        if (e.category === category) {
          e.value = item;
        }
      });
      this.menuPart = this.menu;
      this.menuPart = this.myMenuFilter(
        this.choosedCategory[0].value,
        this.choosedCategory[1].value
      );
    },

    //通过标签过滤现有菜谱的方法(过滤器)
    myMenuFilter(menuCuis, menuTaste) {
      return this.menu.filter(function (menu) {
        if (menuCuis === "全部" && menuTaste !== "全部") {
          return menu.menuTaste === menuTaste;
        } else if (menuTaste === "全部" && menuCuis !== "全部") {
          return menu.menuCuis === menuCuis;
        } else if (menuCuis === "全部" && menuTaste === "全部") {
          return menu;
        } else {
          return menu.menuCuis === menuCuis && menu.menuTaste === menuTaste;
        }
      });
    },

    //获取当前用户
    async getUser() {
      var userId = JSON.parse(window.sessionStorage.getItem("user")).userId;
      const { data: userRes } = await this.$http.get("user/" + userId);
      this.user = userRes.data[0];
      this.user.userAdd = userRes.data[0].userAdd.split("/");
      this.dynamicUserLikeTags = this.user.userLike.split("|");
      //用户信息填写进度
      this.percentage = 0;
      if (this.user.userName !== "") this.percentage += 25;
      if (this.user.userLike !== "") this.percentage += 25;
      if (this.user.userAdd.length >= 0) this.percentage += 25;
      if (this.user.userGend !== "") this.percentage += 25;
      if (this.percentage === 100) this.percentageState = "success";
    },

    //点击菜谱方法,模糊查询菜谱食材组成,记录用户历史记录
    async getMenuCompose(compose, menu) {
      if (typeof compose !== "string") {
        var menuElement = "";
        this.menuObj.menuEle.forEach((item) => {
          menuElement = menuElement + item.ingreName + "|";
        });
        menuElement = menuElement.slice(0, menuElement.lastIndexOf("|"));
        compose = menuElement;
      }
      const { data: menuComposeRes } = await this.$http.get(
        "ingredient/searchlike/" + compose
      );
      menu.menuEle = menuComposeRes.data;
      this.menuObj = menu;
      menuComposeRes.data.forEach((item) => {
        this.ingredientPreImgs.push(item.ingrePut);
      });
      this.menuInfoDialogVisible = true;

      //开始记录
      //首先查询该菜谱是否已经存在
      //获取当前用户所有菜谱历史记录
      var userMenuRecord = this.userMenuRecord;
      //循环搜索该菜谱是否已经被记录
      //是否被记录标志
      var menuFlag = false;
      for (let i = 0; i < userMenuRecord.length; i++) {
        //如果该菜谱在该用户的历史记录中存在
        if (userMenuRecord[i].menuId === menu.menuId) {
          this.updateMenuRecord(userMenuRecord[i].recordId);
          menuFlag = true;
          return;
        }
      }
      //如果该菜谱没有被该用户记录过，则新创建一条记录
      if (!menuFlag) {
        var menuObj = {
          recordId: this.guid(),
          userId: this.user.userId,
          menuId: menu.menuId,
          createTime: this.getNowTime(),
        };
        this.addRecord(menuObj);
      }
      //更新用户菜谱历史记录
      this.getUserMenuRecord();
      //更新当前用户个人喜好推荐菜谱
      this.getRecommendUserLikeMenu();
    },

    //添加用户历史记录方法
    async addRecord(menu) {
      const { data: addRecordRes } = await this.$http.post("record", menu);
      if (addRecordRes.code !== 200) {
        this.$message.error("添加菜谱历史记录失败");
        return;
      }
      //刷新用户当前菜谱历史记录
      this.getUserMenuRecord();
      //刷新用户菜谱推荐
      this.getRecommendUserLikeMenu();
    },

    //更新已有菜谱历史记录
    async updateMenuRecord(recordId) {
      const { data: updateMenuRecord } = await this.$http.put(
        "record/" + recordId
      );
      if (updateMenuRecord.code !== 200) {
        this.$message.error("更新菜谱历史记录失败");
        return;
      }
      //刷新用户当前菜谱历史记录
      this.getUserMenuRecord();
      //刷新用户菜谱推荐
      this.getRecommendUserLikeMenu();
    },

    //获取当前用户菜谱历史记录
    async getUserMenuRecord() {
      var userId = JSON.parse(window.sessionStorage.getItem("user")).userId;
      const { data: userMenuRecordRes } = await this.$http.get(
        "record/" + userId
      );
      this.userMenuRecord = userMenuRecordRes.data;
    },

    //搜索功能
    searchMenu() {
      this.menuPart = this.menu;
      this.menuPart = this.searchFilter(this.search);
    },

    //搜索功能过滤器
    searchFilter(search) {
      return this.menu.filter(function (menu) {
        return (
          menu.menuCuis.includes(search) ||
          menu.menuName.includes(search) ||
          menu.menuTaste.includes(search)
        );
      });
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

    //获取当前时间方法
    getNowTime() {
      return this.$moment().format("YYYY-MM-DD HH:mm:ss");
    },

    //更新用户信息
    updateUserInfo() {
      //表单验证开始
      this.$refs.userFormRef.validate(async (valid) => {
        //表单验证失败
        if (!valid) {
          this.$message.error("更新用户信息验证失败");
          return;
        }
        //表单验证通过
        this.user.userAdd = this.getLocationTransform(this.user.userAdd);
        this.user.userLike = this.dynamicUserLikeTags.join("|");
        //发起请求
        const {data: userRes} = await this.$http.put("user", this.user);
        if (userRes.code !== 200) {
          this.$message.error("更新用户信息失败!")
          this.getUser();
          return;
        }
        this.getUser();
        this.$message.success("更新用户信息成功");
      });
    },

    //将用户的城市编号转化为中文显示
    getLocationTransform(cityArr) {
      //将所需要的城市编码信息列出来
      const location = cityArr;
      const locationProvince = location[0];
      const locationCity = location[1];
      const locationArea = location[2];
      //创建数组保存查询到的数组，减少查询次数
      var provinceArr = [];
      var cityArr = [];
      //最后用于存放城市中文字符的字符串
      var tansformLocation = "";
      //第一次得到省和市级数组
      this.citys.forEach((item) => {
        if (item.value === locationProvince) {
          tansformLocation = tansformLocation + item.label;
          provinceArr = item.children;
        }
      });
      //第二次得到市和区域级数组
      provinceArr.forEach((item) => {
        if (item.value === locationCity) {
          tansformLocation = tansformLocation + "/" + item.label;
          cityArr = item.children;
        }
      });
      //第三次得到完整省市区字符串
      cityArr.forEach((item) => {
        if (item.value === locationArea) {
          tansformLocation = tansformLocation + "/" + item.label;
        }
      });
      //返回该字符串
      return tansformLocation;
    },

    //处理原料tag关闭事件
    handleUserLikeClose(tag) {
      this.dynamicUserLikeTags.splice(this.dynamicUserLikeTags.indexOf(tag), 1);
    },

    //处理对于tag回车事件或失去焦点的方法，添加新的用户喜好
    handleInputConfirm() {
      let inputValue = this.inputUserLikeValue;
      if (inputValue) {
        this.dynamicUserLikeTags.push(inputValue);
      }
      this.inputUserLikeVisible = false;
      this.inputUserLikeValue = "";
    },

    //点击新+喜好事件触发方法
    showInput() {
      this.inputUserLikeVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //修改用户密码方法
    async editUserPassword() {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        center: true,
        roundButton: true,
        inputPattern: /^[a-zA-Z0-9]{6,13}$/,
        inputErrorMessage: "密码格式不符",
      })
        .then(async ({ value }) => {
          const { data: editUserPasswordRes } = await this.$http.post(
            "user/password/" + this.user.userId,
            {
              password: value,
            }
          );
          if (editUserPasswordRes.code !== 200) {
            this.$message.error("修改密码失败");
            return;
          } else {
            this.$message({
              type: "success",
              message: `你的新密码是: ${value}| 2秒后重新登录`,
              duration: 3000,
              center: true,
            });
            setTimeout(() => {
              this.$router.push("login");
            }, 2000);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改",
          });
        });
    },

    //获取当前用户菜谱历史记录中菜谱的详细信息
    async getUserMenu() {
      var userMenuRecord = this.userMenuRecord;
      var menuIdsArr = [];
      userMenuRecord.forEach((item) => {
        menuIdsArr.push(`${item.menuId}`);
      });
      const { data: userMenu } = await this.$http.post("menu/user/menuinfo", {
        menuIdsArr: menuIdsArr,
      });
      if (userMenu.data.length > 0) {
        userMenu.data.sort(function (a, b) {
          return b.count - a.count;
        });
      }
      return userMenu.data;
    },

    //根据用户喜好从已有菜谱生成推荐菜谱
    async getRecommendUserLikeMenu() {
      //当前用户
      var user = JSON.parse(window.sessionStorage.getItem("user"));
      this.userLikeMenu = [];
      //根据用户信息内的喜好信息进行推荐
      const { data: userLikeMenuRes } = await this.$http.get(
        "menu/searchlike/" + user.userLike
      );
      for (let i = 0; i < parseInt(userLikeMenuRes.data.length * 0.2); i++) {
        this.userLikeMenu.push(
          userLikeMenuRes.data[parseInt(this.getRandom(userLikeMenuRes.data.length))]
        );
      }

      //随机塞入2个固定新菜谱
      for (let i = 0; i < 1; i++) {
        this.userLikeMenu.push(
          this.menu[parseInt(this.getRandom(this.menu.length))]
        );
      }

      //获取当前用户菜谱历史记录
      this.getUserMenu().then((data) => {
        for (let i = 0; i < parseInt(data.length * 0.2); i++) {
          this.userLikeMenu.push(data[parseInt(this.getRandom(data.length))]);
        }
        //去除重复菜谱,推荐算法结束
        for (let i = 0; i < this.userLikeMenu.length - 1; i++) {
          for (let j = i + 1; j < this.userLikeMenu.length; j++) {
            if (this.userLikeMenu[i].menuId === this.userLikeMenu[j].menuId) {
              this.userLikeMenu.splice(j, 1);
              j--;
            }
          }
        }
      });
    },
  },
  mounted() {
    this.getUser();
    this.getMenu();
    this.getUserMenuRecord();
    this.getRecommendUserLikeMenu();
  },
};
</script>
