<template>
  <div>
    <div class="operation">
      日期：
      <el-date-picker
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        v-model="query.time"
      >
      </el-date-picker>
      活动名：<el-input placeholder="请输入内容" v-model="query.activityName" clearable></el-input>
      发起者：<el-input placeholder="请输入内容" v-model="query.creatUser" clearable></el-input>
      <el-button type="success" icon="el-icon-search" circle @click="getList"></el-button>
      <el-button type="primary" class="addBtn" @click="add">+</el-button>
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
        prop="creatUser"
        label="发起人"
      >
      </el-table-column>
      <el-table-column
        prop="creatTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="activityTime"
        label="活动时间"
      >
      </el-table-column>
      <el-table-column
        prop="scanBeginTime"
        label="扫码起始时间"
      >
      </el-table-column>
      <el-table-column
        prop="scanEndTime"
        label="扫码截止时间"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="remove(scope.row)" style="font-size: 14px">删除</el-button>
          <el-button type="text" size="small" @click="showCode(scope.row, 'in')" style="font-size: 14px">签到码</el-button>
          <el-button type="text" size="small" @click="showCode(scope.row, 'out')" style="font-size: 14px">签退码</el-button>
          <el-button type="text" size="small" @click="routeTo(scope.row)" style="font-size: 14px">签到信息</el-button>
        </template>
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
    <el-dialog title="活动信息" :visible.sync="dialogFormVisible" class="dialog">
      <el-form :model="form" :rules="rules">
        <el-form-item label="活动名称：" :label-width="formLabelWidth" prop="activityName">
          <el-input v-model="form.activityName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="签到时间：" :label-width="formLabelWidth" prop="scanTime">
          <el-date-picker
            v-model="form.scanTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="签到时间"
            end-placeholder="签退时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动时间：" :label-width="formLabelWidth" prop="activityTime">
          <el-date-picker
            v-model="form.activityTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人：" :label-width="formLabelWidth" prop="creatUser">
          <el-input v-model="form.creatUser" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="qrCodeInfo.activityName"
      :visible.sync="qrVisible"
      width="600px"
      class="qrCode-wrapper"
    >
      <p class="description">发起人：{{qrCodeInfo.creatUser}}</p>
      <p class="description">活动时间：{{qrCodeInfo.activityTime}}</p>
      <h2>{{qrCodeInfo.type}}</h2>
      <div class="qrcode">
        <div class="download">
          <p style="text-align: center; font-size: 30px;">{{qrCodeInfo.activityName}}</p>
          <vue-qr :text="qrCodeInfo.text" :size="250"></vue-qr>
          <!-- <p style="text-align: center; font-size: 30px;">{{qrCodeInfo.activityName}}</p> -->
        </div>
      </div>
      <div style="display: flex; justify-item: center; margin-top: 10px;">
        <el-button type="primary" style="margin: 0 auto;" @click="downloadQR">下载二维码</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getActivitiesList, createActivity, deleteActivity } from '@/api/activities'
import moment from 'moment'
import '@/plugins/qrcode'
import VueQr from 'vue-qr'
import html2canvas from 'html2canvas'

export default {
  name: 'ActivitiesView',
  components: {
    VueQr
  },
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      qrVisible: false,
      query: {
        activityName: '',
        creatUser: '',
        time: ''
      },
      qrCodeInfo: {
        text: '',
        activityName: '',
        creatUser: '',
        activityTime: '',
        type: ''
      },
      form: {
        activityName: '',
        activityTime: '',
        scanTime: '',
        creatUser: ''
      },
      rules: {
        activityName: [
          { 
            required: true, message: '请输入活动名称', trigger: 'blur' 
          }
        ],
        activityTime: [
          {
            required: true, message: '请选择活动时间', trigger: 'blur'
          }
        ],
        creatUser: [
          {
            required: true, message: '请输入创建人', trigger: 'blur'
          }
        ]
      },
      formLabelWidth: '100px',
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
    this.getList()
  },
  methods: {
    async remove(r) {
      const { data: { msg } } = await deleteActivity(r.id)
      msg === '删除数据成功' ? this.$message.success(msg) : this.$message.error(msg)
      this.getList()
    },
    async submit () {
      console.log(this.form)
      if (this.form.activityName !== '' && this.tableData.find(i => i.activityName === this.form.activityName)) {
        this.$message.error('该活动已创建，请重新命名')
        return
      }
      for (let k in this.form) {
        if ((k !== 'scanTime' && k !== 'activityTime') && this.form[k].trim() === '') {
          this.$message.error(`请输入活动相关的完整内容`)
          break;
        }
        if ((k === 'scanTime' || k === 'activityTime') && this.form[k] === '') {
          this.$message.error(`请输入活动相关的完整内容`)
          break;
        }
      }
      const form = {
        activityName: this.form.activityName,
        activityTime: moment(this.form.activityTime).format('YYYY-MM-DD HH:mm:ss'),
        scanBeginTime: moment(this.form.scanTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        scanEndTime: moment(this.form.scanTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        creatUser: this.form.creatUser
      }
      console.log(form)
      const { data: { msg } } = await createActivity(form)
      msg === '活动创建成功' ? this.$message.success(msg) : this.$message.error(msg)
      this.dialogFormVisible = false
      this.form = {
        activityName: '',
        activityTime: '',
        creatUser: ''
      }
      this.getList()
    },
    add () {
      this.dialogFormVisible = true
    },
    async getList () {
      this.loading = true
      let query = {
        activityName: this.query.activityName,
        creatUser: this.query.creatUser,
        activityBeginTime: this.query.time ? moment(this.query.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
        activityEndTime: this.query.time ? moment(this.query.time[1]).format('YYYY-MM-DD HH:mm:ss') : ''
      }
      try {
        const { data: { data } } = await getActivitiesList(this.pagination.current, this.pagination.pageSize, query)
        // this.startDatetime = moment(new Date()).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
        // console.log(this.startDatetime)
        data.records.forEach(r => {
          r.creatTime = moment(r.creatTime).format('YYYY-MM-DD HH:mm:ss')
        })
        this.pagination.current = data.current
        this.pagination.total = data.total
        this.tableData = data.records
      } catch {
        this.$message.error('服务器繁忙，请稍后再试')
      }
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
    showCode (r, type) {
      if (type === 'in') {
        if (r.signInCode === null) {
          this.$message.warning('该活动暂无签到码')
          return
        }
        this.qrCodeInfo.text = r.signInCode
        this.qrCodeInfo.type = '签到二维码'
      }
      if (type === 'out') {
        if (r.signOutCode === null) {
          this.$message.warning('该活动暂无签退码')
          return
        }
        this.qrCodeInfo.text = r.signOutCode
        this.qrCodeInfo.type = '签退二维码'
      }
      this.qrCodeInfo.activityName = r.activityName
      this.qrCodeInfo.creatUser = r.creatUser
      this.qrCodeInfo.activityTime = r.activityTime
      this.qrVisible = true
    },
    routeTo (r) {
      this.$store.commit('setActivityName', r.activityName)
      this.$router.push('/sign')
    },
    downloadQR() {
      const canvasBox = document.querySelector('.qrcode .download')
      html2canvas(canvasBox).then(canvas => {
        const dataURL = canvas.toDataURL('image/jpg')
        const link = document.createElement('a')
        link.href = dataURL
        link.setAttribute('download', '二维码.png')
        link.click()
      })
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
    width: 26%;
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
.qrCode-wrapper {
  .description {
    font-size: 16px;
    margin-bottom: 20px;
  }
  h2 {
    text-align: center;
  }
  .qrcode {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>