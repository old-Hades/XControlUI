<template>
  <div id="container">
    <div class="top">
      <div class="left">
        <a-tree
          v-if="treeData.length"
          :tree-data="treeData"
          :replaceFields="replaceFields"
          @select="onSelect"
          :defaultSelectedKeys="[treeData[0].children[0].children[0].id]"
        />
      </div>

      <div class="right">
        <a-row :gutter="16">
          <a-col :span="5">
            <a-statistic
              title="当前活跃通道数目"
              :value="3000"
              :value-style="{ color: '#3f8600' }"
            >
              <template #suffix>
                <span> 个</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="5">
            <a-statistic
              title="异常通道数目"
              :value="3"
              :value-style="{ color: '#FD102D' }"
            >
              <template #suffix>
                <span> 个</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="5">
            <a-statistic
              title="连接风机数目"
              :value="112893"
              :value-style="{ color: '#3f8600' }"
            >
              <template #suffix>
                <span> 个</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="5">
            <a-statistic
              title="故障风机数目"
              :value="13"
              :value-style="{ color: '#FD102D' }"
            >
              <template #suffix>
                <span> 个</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>

        <a-tabs default-active-key="1">
          <a-tab-pane key="1">
            <span slot="tab"> <a-icon type="profile" />详情 </span>
            <ffu-group-detail :msg-id="selectKey" @msgId="changeMsgId" />
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab"> <a-icon type="message" />实时数据 </span>
            <real-time-msg :msg-id="selectKey" />
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab"> <a-icon type="history" />历史数据 </span>
            <history-msg :msgId="selectKey" />
          </a-tab-pane>
          <a-tab-pane key="4">
            <span slot="tab"> <a-icon type="history" />风机曲线 </span>
            <a-select
              v-if="selectData"
              :default-value="selectData[0].name"
              style="width: 120px"
              @change="handleChangeSelect"
            >
              <a-select-option
                :value="item.id"
                v-for="(item, index) in selectData"
                :key="index"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
            <curve-msg :fanId="fanId" v-if="fanId" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
<script>
import historyMsg from '../collect/HistoryMsg'
import ffuGroupDetail from '../collect/FfuGroupDetail'
import realTimeMsg from '../collect/RealtimeMsg'
import curveMsg from '../History/components/curveHistory'
import { getDeviceTree, simpleFFUDevice } from '../../services/device'
import { formatTree } from '../../utils/baseutil'

export default {
  data() {
    return {
      treeData: [],
      selectKey: null,
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      groupData: '',
      fanId: null,
      protocol: null,
      groupId: null,
      selectData: null
    }
  },
  components: {
    historyMsg,
    realTimeMsg,
    ffuGroupDetail,
    curveMsg
  },
  created() {
    getDeviceTree().then(res => {
      this.treeData = formatTree(res.data)
      console.log(this.treeData)
      this.selectKey = this.treeData[0].children[0].children[0].id
    })
  },
  watch: {
    protocol(n) {
      console.log(n)
      this.getSimpleFFUDevice()
    },
    selectKey(n) {
      this.groupId = n.substr(6)
      console.log(this.groupId)
      if (this.protocol !== null) {
        this.getSimpleFFUDevice()
        console.log('重新执行了获取下拉框的数据')
      }
      // this.getSimpleFFUDevice()
    }
  },
  methods: {
    onSelect(selectedKeys, info) {
      // console.log('selected', selectedKeys, info);
      this.selectKey = selectedKeys[0]
    },
    handleChangeSelect(e) {
      this.fanId = e
    },
    changeMsgId(e) {
      this.protocol = e
    },
    async getSimpleFFUDevice() {
      const res = await simpleFFUDevice({
        protocol: this.protocol || 0,
        groupId: this.groupId
      })
      console.log(res)
      if (res.msgCode !== 0) {
        return this.$message.error('请求数据失败！请稍后重试')
      } else if (res.data.length <= 0) {
        return this.$message.info('请求成功，但未获取到风机信息')
      }
      if (res.data.length >= 1) {
        this.selectData = res.data
        this.fanId = this.selectData[0].id
      }
    }
  }
}
</script>
<style scoped>
.top {
  display: flex;
  margin-bottom: 30px;
}

.left {
  width: 20%;
}

.right {
  width: 80%;
  /* border: solid 1px; */
  margin-left: 20px;
}
</style>
