<template>
  <div class="bottom">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :scroll="{ y: 150 }"
    >
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
  </div>
</template>
<script>
import { getAlarmTable } from '@/services/alarm.js'
const columns = [
  {
    title: '发生时间',
    dataIndex: 'actingTime',
    key: 'actingTime'
  },
  {
    title: '告警类型',
    dataIndex: 'alarmType',
    key: 'alarmType',
    scopedSlots: { customRender: 'alarmType' }
  },
  {
    title: '告警对象',
    dataIndex: 'alarmObject',
    key: 'alarmObject'
  },
  {
    title: '告警行为',
    dataIndex: 'action',
    key: 'action'
  },

  {
    title: '已确认',
    dataIndex: 'ack',
    key: 'ack',
    scopedSlots: { customRender: 'ack' }
  },
  {
    title: '告警数值',
    dataIndex: 'alarmValue',
    key: 'alarmValue'
  },
  {
    title: '确认人',
    dataIndex: 'confirmMan',
    key: 'confirmMan'
  },
  {
    title: '确认时间',
    dataIndex: 'confirmTime',
    key: 'confirmTime'
  }
]

export default {
  data() {
    return { columns, data: null }
  },
  created() {
    this.getTable()
  },
  methods: {
    async getTable() {
      const res = await getAlarmTable()
      this.data = res.data
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-table-tbody > tr > td,
.ant-table-thead > tr > th {
  padding: 5px 16px !important;
}
</style>
