<template>
  <el-card>
    <div class="record">
      <div class="recordDrawerBtn">
        <span class="title">我浏览的菜谱历史记录:</span>
        <el-popconfirm
          title="确定清除所有记录?"
          style="margin-left: 5px"
          @confirm="clearAllRecord"
        >
          <el-button
            slot="reference"
            type="danger"
            round
            size="mini"
            :disabled="userMenuRecord.length === 0"
          >
            全部清除
          </el-button>
        </el-popconfirm>
      </div>
      <el-table
        :data="
          userMenu.filter(
            (data) =>
              !menuRecordSearch ||
              data.menuName
                .toLowerCase()
                .includes(menuRecordSearch.toLowerCase())
          )
        "
        :highlight-current-row="true"
        style="width: 100%"
        :stripe="true"
        :border="true"
        size="small"
        empty-text="暂无记录,快去挑选你喜欢的菜谱吧💕"
        fit
        lazy
      >
        <el-table-column label="菜谱图片" width="130" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100%"
              :src="scope.row.menuPut"
              :preview-src-list="menuRecordPreImgs"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column label="菜谱名称" align="center">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              content="查看菜谱信息"
              placement="top"
              :open-delay="1000"
              :enterable="false"
            >
              <span @click="setMenuInfo(scope.row)" style="cursor: pointer">
                <el-tag type="primary">{{ scope.row.menuName }}</el-tag>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="菜谱菜系" align="center">
          <template slot-scope="scope">
            <span>
              <el-tag type="warning">
                {{ scope.row.menuCuis }}
              </el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="菜谱价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.menuPrice }} 元</span>
          </template>
        </el-table-column>

        <el-table-column label="记录时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.modifyTime | dataFormat }}</span>
          </template>
        </el-table-column>

        <el-table-column label="浏览次数" align="center">
          <template slot-scope="scope">
            <span>
              <el-tag type="success"> {{ scope.row.count }} 次 </el-tag>
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="menuRecordSearch"
              size="mini"
              placeholder="输入菜谱名称搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              content="查看菜谱信息"
              placement="top"
              :open-delay="1000"
              :enterable="false"
            >
              <el-button
                type="primary"
                size="mini"
                circle
                icon="el-icon-thumb"
                @click="setMenuInfo(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-popconfirm
              title="确定删除该记录?此操作不可逆"
              style="margin-left: 5px"
              @confirm="deleteUserRecord(scope.row.recordId)"
            >
              <el-button
                type="danger"
                size="small"
                circle
                icon="el-icon-delete"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

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
              :preview-src-list="menuRecordPreImgs"
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
export default {
  name: "MenuRecord",
  data() {
    return {
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
      //菜谱组成食材大图数组
      ingredientPreImgs: [],
      //我的菜谱历史记录数组
      userMenuRecord: [],
      //我的菜谱记录，只有菜谱信息
      userMenu: [],
      //我的菜谱历史记录图片预览数组
      menuRecordPreImgs: [],
      //菜谱历史记录搜索条件
      menuRecordSearch: "",
    };
  },
  computed: {
    userId() {
      return JSON.parse(window.sessionStorage.getItem("user")).userId;
    },
  },
  methods: {
    //获取当前用户菜谱历史记录
    async getUserMenuRecord() {
      var userId = this.userId;
      const { data: userMenuRecordRes } = await this.$http.get(
        "record/" + userId
      );
      this.userMenuRecord = userMenuRecordRes.data;
      this.getUserMenu();
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
        userMenu.data.forEach((menu) => {
          this.menuRecordPreImgs.push(menu.menuPut);
        });
        userMenu.data.sort(function (a, b) {
          return b.count - a.count;
        });
        this.userMenu = userMenu.data;
      }
    },

    //查看历史记录菜谱详细方法
    async setMenuInfo(menu) {
      const { data: menuComposeRes } = await this.$http.get(
        "ingredient/searchlike/" + menu.menuEle
      );
      menu.menuEle = menuComposeRes.data;
      this.menuObj = menu;
      menuComposeRes.data.forEach((item) => {
        this.ingredientPreImgs.push(item.ingrePut);
      });
      this.menuInfoDialogVisible = true;
    },

    //删除历史记录的方法
    async deleteUserRecord(recordId) {
      const { data: deleteRecordRes } = await this.$http.delete(
        "record/" + recordId
      );
      if (deleteRecordRes.code !== 200) {
        this.$message.error("服务器错误,删除失败!");
        return;
      }
      this.getUserMenuRecord();
      this.$message.success("已删除该记录");
    },

    //删除该用户所有历史记录的方法
    async clearAllRecord() {
      const { data: clearAllRecordRes } = await this.$http.delete(
        "record/user/" + this.userId
      );
      if (clearAllRecordRes.code !== 200) {
        this.$message.error("服务器错误,清除失败!");
        return;
      }
      //刷新现有列表
      //因为该方法使用的是select in, in后面为空会返回sql异常致使程序无法正常刷新列表，所以手动置空
      this.getUserMenuRecord();
      //手动置空
      this.userMenuRecord = [];
      this.userMenu = [];
      this.$message.success("历史记录已清空");
    },
  },
  mounted() {
    this.getUserMenuRecord();
  },
};
</script>
