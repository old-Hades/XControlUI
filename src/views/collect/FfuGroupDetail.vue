<template>
  <div>
    <a-descriptions bordered title="通道信息" v-model="groupData">
      <a-descriptions-item label="风机组名称">{{
        groupData.name
      }}</a-descriptions-item>
      <a-descriptions-item label="简称">{{
        groupData.aliasName
      }}</a-descriptions-item>
      <a-descriptions-item label="区域名称">{{
        groupData.zoneName
      }}</a-descriptions-item>
      <a-descriptions-item label="端口序号">{{
        groupData.serialDeviceServerPortIndex
      }}</a-descriptions-item>
      <a-descriptions-item label="协议">{{
        groupData.protocol === 1 ? 'OTHER' : 'EBM'
      }}</a-descriptions-item>
      <a-descriptions-item label="风机数目">{{
        groupData.fanNum
      }}</a-descriptions-item>
      <a-descriptions-item label="串口IP">{{
        groupData.serialDeviceServerIp
      }}</a-descriptions-item>
      <a-descriptions-item label="串口端口号">{{
        groupData.serialDeviceServerPort
      }}</a-descriptions-item>
      <a-descriptions-item label="串口名称">{{
        groupData.serialDeviceServerName
      }}</a-descriptions-item>
      <a-descriptions-item :span="2" label="当前状态">
        <a-badge status="processing" text="正常" v-if="groupData.status" />
        <a-badge status="error" text="异常" v-else />
      </a-descriptions-item>
      <a-descriptions-item label="所属节点">{{
        groupData.nodeName
      }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { getFFUGroupDetail } from '../../services/device'
export default {
  props: {
    msgId: {
      type: String
    }
  },
  data() {
    return {
      groupData: ''
    }
  },
  watch: {
    msgId(val) {
      if (!this.msgId.startsWith('group')) {
        // this.$message.error("请选择风机组节点!");
        return
      }
      let groupId = this.msgId.substring(
        this.msgId.lastIndexOf('-') + 1,
        this.msgId.length
      )
      getFFUGroupDetail(groupId).then(res => {
        if (res.msgCode === 0) {
          this.$emit('msgId', res.data.protocol)
          this.groupData = res.data
        } else {
          this.groupData = ''
        }
      })
    }
  }
}
</script>

<style></style>
