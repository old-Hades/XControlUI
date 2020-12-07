<template lang="">
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="转速历史曲线">
        <historyCurve :fanId="fanId" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="EBM风机功率">
        <power :fanId="fanId" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="历史报文">
        <historyMsg />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import historyCurve from './components/curveHistory'
import power from './components/power'
import historyMsg from '../collect/HistoryMsg'
export default {
  name: 'Curve',
  data() {
    return {
      fanId: 1,
    }
  },
  created() {},
  methods: {},
  components: {
    historyCurve,
    power,
    historyMsg,
  },
}
</script>
<style lang="less" scoped></style>
