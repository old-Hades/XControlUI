<template>
  <div>
    <a-range-picker
      :default-value="[moment('2020/10/01', dateFormat), moment('2020/11/01', dateFormat)]"
      :value="timeQueryRange"
      :ranges="{ Today: [moment('2020/10/01', dateFormat), moment()], 'This Month': [moment(), moment().endOf('month')] }"
      show-time
      @change="onChange"
      format="YYYY/MM/DD HH:mm:ss"
    />
    <span class="behavior">告警行为</span>
    <a-select default-value="CPU_ERR" style="width: 120px" @change="handleChange" v-model="action">
      <!--节点类型告警行为-->
      <a-select-option value="NODE_DEAD" v-if="query === 'node' || query === 'all' || query === 'unconfirmed'">
        节点宕机
      </a-select-option>
      <a-select-option value="CPU_ERR" v-if="query === 'node' || query === 'all' || query === 'unconfirmed'">
        CPU
      </a-select-option>
      <a-select-option value="MEMORY" v-if="query === 'node' || query === 'all' || query === 'unconfirmed'">
        内存
      </a-select-option>
      <a-select-option value="DESK" v-if="query === 'node' || query === 'all' || query === 'unconfirmed'">
        磁盘
      </a-select-option>

      <!--通道类型告警行为-->
      <a-select-option value="CHANNEL_CLOSE" v-if="query === 'aisle' || query === 'all' || query === 'unconfirmed'">
        通道断开
      </a-select-option>

      <!--设备类型告警行为-->
      <a-select-option value="DEVICE_NO_RESP" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        设备无响应
      </a-select-option>
      <a-select-option value="BRAKE" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        BRAKE
      </a-select-option>
      <a-select-option value="UELOW" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        UELOW
      </a-select-option>
      <a-select-option value="UZLOW" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        UZLOW
      </a-select-option>
      <a-select-option value="UZHIGH" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        UZHIGH
      </a-select-option>
      <a-select-option value="DRV" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        DRV
      </a-select-option>
      <a-select-option value="TFEI" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        TFEI
      </a-select-option>
      <a-select-option value="LZHIGH" v-if="query === 'facility' || query === 'all' || query === 'unconfirmed'">
        LZHIGH
      </a-select-option>

      <!--操作类型告警行为-->
      <a-select-option value="SET_TARGET_VALUE" v-if="query === 'operation' || query === 'all' || query === 'unconfirmed'">
        调速
      </a-select-option>
      <a-select-option value="RESET" v-if="query === 'operation' || query === 'all' || query === 'unconfirmed'">
        重置
      </a-select-option>
      <a-select-option value="SET_MAXIMUM_RPM" v-if="query === 'operation' || query === 'all' || query === 'unconfirmed'">
        设置最大转速
      </a-select-option>
      <a-select-option value="SET_RATING_FACTOR" v-if="query === 'operation' || query === 'all' || query === 'unconfirmed'">
        设置转动系数
      </a-select-option>
    </a-select>
    <span class="behavior">已确认</span>
    <a-select default-value="false" style="width: 120px" @change="handleChange" v-model="ack">
      <a-select-option value="false">
        否
      </a-select-option>
      <a-select-option value="true">
        是
      </a-select-option>
    </a-select>
    <a-button @click="queryAlarmData" class="behavior">查询</a-button>
    <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="key">
      <span slot="alarmType" slot-scope="alarmType">
        {{ alarmType === 1 ? '节点告警' : ' ' }}
        {{ alarmType === 2 ? '通道告警' : ' ' }}
        {{ alarmType === 3 ? '设备告警' : ' ' }}
        {{ alarmType === 4 ? '操作告警' : ' ' }}
      </span>
      <span slot="ack" slot-scope="ack">
        <a-icon type="check" v-if="ack === true" />
        <a-icon type="close" v-else />
      </span>
    </a-table>
    <a-pagination v-model="current" show-size-changer :page-size.sync="pageSize" :total="showTotal" />
  </div>
</template>
<script>
import moment from 'moment'
import { getAlarmData } from '../services/alarm'
const columns = [
  {
    title: '发生时间',
    dataIndex: 'actingTime',
    key: 'actingTime',
  },
  {
    title: '告警类型',
    dataIndex: 'alarmType',
    key: 'alarmType',
    scopedSlots: { customRender: 'alarmType' },
  },
  {
    title: '告警对象',
    dataIndex: 'alarmObject',
    key: 'alarmObject',
  },
  {
    title: '告警行为',
    dataIndex: 'action',
    key: 'action',
  },

  {
    title: '已确认',
    dataIndex: 'ack',
    key: 'ack',
    scopedSlots: { customRender: 'ack' },
  },
  {
    title: '告警数值',
    dataIndex: 'alarmValue',
    key: 'alarmValue',
  },
  {
    title: '确认人',
    dataIndex: 'confirmMan',
    key: 'confirmMan',
  },
  {
    title: '确认时间',
    dataIndex: 'confirmTime',
    key: 'confirmTime',
  },
]

export default {
  props: {
    query: {
      type: String,
    },
    alarmObject: {
      type: String,
    },
  },
  created() {
    const moment = require('moment')
    moment.suppressDeprecationWarnings = true
    this.geOldDate()
  },
  name: 'Query',

  data() {
    return {
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM',
      content: null,
      action: null,
      columns,
      data: [],
      showTotal: 0,
      timeQueryRange: [null, moment(new Date())],
      pageSize: 10,
      current: 1,
      ack: 'false',
    }
  },
  watch: {
    pageSize(val) {
      this.queryAlarmData()
    },
    current(val) {
      this.queryAlarmData()
    },
  },
  methods: {
    moment,
    onChange(dates, dateStrings) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    handleChange(r) {
      console.log(r)
    },
    geOldDate() {
      const date = moment(new Date()._d).format('YYYY-MM-DD HH:mm:ss')
      let arr = date.split('-')
      let year = arr[0] //获取当前日期的年份
      let month = arr[1] //获取当前日期的月份
      let day = arr[2] //获取当前日期的日
      let days = new Date(year, month, 0)
      days = days.getDate() //获取当前日期中月的天数
      let year2 = year
      let month2 = parseInt(month) - 1
      if (month2 == 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      let t2 = year2 + '/' + month2 + '/' + day2
      console.log(moment(t2))
      moment.suppressDeprecationWarnings = true
      this.timeQueryRange[0] = moment(t2)
      this.queryAlarmData()
    },
    queryAlarmData() {
      if (this.timeQueryRange[0] === undefined) {
        return this.$message.error('请输入查询的时间')
      }
      // console.log(this.timeQueryRange[0]._d)
      // console.log(new Date())

      const param = {
        alarmType: null,
        startDate: moment(this.timeQueryRange[0]._d).format('YYYY-MM-DD HH:mm:ss.SSS'),
        endDate: moment(this.timeQueryRange[1]._d).format('YYYY-MM-DD HH:mm:ss.SSS'),
        start: this.current,
        limit: this.pageSize,
        ack: this.ack,
        action: this.action,
        alarmObject: this.alarmObject || null,
      }
      if (this.query === 'node') {
        param.alarmType = 1
      } else if (this.query === 'aisle') {
        param.alarmType = 2
      } else if (this.query === 'facility') {
        param.alarmType = 3
      } else if (this.query === 'operation') {
        param.alarmType = 4
      }
      console.log(param)
      getAlarmData(param)
        .then((res) => {
          console.log(res)
          if (res.msgCode === 0) {
            this.data = res.data
            this.showTotal = res.total
            if (this.query === 'all' || this.query === 'unconfirmed') {
              console.log('查到了也不告诉你')
            } else {
              this.$message.success(`查到了${res.total}条告警`)
            }
          } else if (res.msgCode === 101) {
            // this.$message.success('查询成功！不过未查询到数据！！！')
            console.log('查询成功！不过未查询到数据！！！')
          }
        })
        .catch((err) => {
          console.log(err)
          if (err) {
            return this.$message.error('发生了未知错误，请稍后重试')
          }
        })
    },
    //全部确认
    confirmAll() {
      //TODO
      this.$message.info('确认成功')
    },
  },
}
</script>
<style lang="less" scoped>
.behavior {
  margin: 10px 20px 0 20px;
}
.ant-pagination {
  margin-top: 20px;
}
</style>
