<template>
  <div id="app">
    <header>
      <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <h1 class="title">活动管理系统</h1>
        <el-menu-item index="/activities">活动中心</el-menu-item>
        <el-menu-item index="/sign">签到信息</el-menu-item>
      </el-menu>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  methods: {
    handleSelect(key) {
      this.$router.push(key)
    }
  }
}
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  .title {
    position: absolute;
    left: 190px;
    font-size: 24px;
    color: #409eff;
    line-height: 2.4;
  }
  .el-menu-demo {
    padding-left: 360px;
    .el-menu-item {
      font-size: 16px;
    }
  }
  table {
    th,
    td {
      height: 60px;
    }
  }
}
</style>
