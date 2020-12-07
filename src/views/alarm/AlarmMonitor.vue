<template>
  <div>
    <a-tabs v-model="keyOne">
      <a-tab-pane :key="key[0]" tab="全部">
        <query ref="child" :query="report.all" />
      </a-tab-pane>
      <a-tab-pane :key="key[1]" tab="未确认">
        <query ref="child" :query="report.unconfirmed" />
      </a-tab-pane>
      <a-tab-pane :key="key[2]" tab="节点告警">
        <query ref="child" :query="report.node" />
      </a-tab-pane>
      <a-tab-pane :key="key[3]" tab="通道告警">
        <query ref="child" :query="report.aisle" />
      </a-tab-pane>
      <a-tab-pane :key="key[4]" tab="设备告警">
        <query ref="child" :query="report.facility" />
      </a-tab-pane>
      <a-tab-pane :key="key[5]" tab="操作告警">
        <query ref="child" :query="report.operation" />
      </a-tab-pane>
      <a-button slot="tabBarExtraContent" @click="confirmAll">
        全部确认
      </a-button>
    </a-tabs>
  </div>
</template>

<script>
import query from '../../components/Query'
import { confirmAll } from '../../services/alarm'
export default {
  name: 'AlarmMonitor',
  data() {
    return {
      key: [1, 2, 3, 4, 5, 6],
      keyOne: 1,
      report: {
        all: 'all', // 全部
        unconfirmed: 'unconfirmed', // 未确认的
        node: 'node', // 节点告警
        aisle: 'aisle', // 通道告警
        facility: 'facility', // 设备告警
        operation: 'operation' // 操作告警
      }
    }
  },
  mounted() {
    if (this.$route.params.Two === 2) {
      this.keyOne = 2
    }
  },
  methods: {
    async confirmAll() {
      //TODO
      const res = await confirmAll()
      if (res.msgCode === 0) {
        this.$refs.child.geOldDate()
        this.$emit('getLD')
        this.$message.success('确认成功！')
      } else if (res.msgCode === 500) {
        this.$message.info('暂时没有查询到未确认消息！')
      }
    },
    getNewList() {
      this.$refs.child.geOldDate()
    }
  },
  components: {
    query
  }
}
</script>

<style scoped>
#box1 {
  display: flex;
}
.breadcrumb {
  padding: 20px;
  border-bottom: 1px solid #ccc;
}
</style>
