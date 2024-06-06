<template>
  <div>
    <div class="operation">
      日期：
      <el-date-picker
        v-model="query.time"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      活动名称：<el-input placeholder="请输入内容" v-model="query.activityName" clearable></el-input>
      部门：<el-input placeholder="请输入内容" v-model="query.depName" clearable></el-input>
      姓名<el-input placeholder="请输入内容" v-model="query.trueName" clearable></el-input>
      <el-button type="success" icon="el-icon-search" circle @click="getList"></el-button>
      <el-button type="primary" @click="exportAsExcel">导出</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      :border="true"
      stripe
      class="ATable"
    >
      <el-table-column
        prop="activityName"
        label="活动名称"
      >
      </el-table-column>
      <el-table-column
        prop="depName"
        label="部门"
      >
      </el-table-column>
      <el-table-column
        prop="trueName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="isSignOut"
        label="签退状态"
      >
      </el-table-column>
      <el-table-column
        prop="signInTime"
        label="签到时间"
      >
      </el-table-column>
      <el-table-column
        prop="signOutTime"
        label="签退时间"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getSignList, exportExcel } from '@/api/sign'
import moment from 'moment';
// import moment from 'moment'

export default {
  name: 'SignView',
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      query: {
        activityName: '',
        trueName: '',
        depName: '',
        time: ''
      },
      loading: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pagination: {
        current: 1,
        pageSizes: [10, 20, 50],
        pageSize: 10,
        total: 0
      }
    }
  },
  created () {
    this.query.activityName = this.$store.state.activityName
    this.getList()
  },
  methods: {
    async getList () {
      const query = {
        activityName: this.query.activityName,
        trueName: this.query.trueName,
        depName: this.query.depName,
        signStartTime: this.query.time ? moment(this.query.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        signEndTime: this.query.time ? moment(this.query.time[1]).format('YYYY-MM-DD HH:mm:ss') : '',
      }
      this.loading = true
      const { data: { data } } = await getSignList(this.pagination.current, this.pagination.pageSize, query)
      // this.startDatetime = moment(new Date()).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
      // console.log(this.startDatetime)
      data.records.forEach(r => {
        r.isSignOut = r.isSignOut ? '已签退' : '未签退'
        r.signInTime = r.signInTime ? moment(r.signInTime).format('YYYY-MM-DD HH:mm:ss') : '未签到'
        r.signOutTime = r.signOutTime ? moment(r.signOutTime).format('YYYY-MM-DD HH:mm:ss') : '未签退'
      })
      this.pagination.current = data.current
      this.pagination.total = data.total
      this.tableData = data.records
      this.loading = false
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getList()
    },
    async exportAsExcel () {
      const { data } = await exportExcel(this.query)
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.download = '签到信息表.xlsx'
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
      this.$message.success('导出成功', 1)
    }
  }
}
</script>

<style lang="less" scoped>
.ATable {
  width: 80%;
  margin: 20px auto
}
.operation {
  width: 80%;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  .el-input {
    width: 15%;
  }
  .addBtn {
    width: 40px;
    text-align: center;
    padding: 12px 0;
  }
}
.pagination {
  width: 80%;
  margin: 40px auto;
}
.dialog {
  .el-input {
    width: 94%;
  }
}
</style>