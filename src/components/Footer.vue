<template>
  <el-card>
    <div class="foot">
      <span>©版权归Shuaib团队所有 如有需求请联系QQ: 2631667689</span>
      <span>2022-6-19</span>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.foot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 楷体;
  font-size: larger;
  font-weight: 1000;
  line-height: 1.5em;
}

.foot span {
  margin-bottom: 10px;
}
</style>
