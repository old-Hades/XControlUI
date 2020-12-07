<template>
  <div v-if="allId">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="设备信息">
        <a-table :pagination="false" rowKey="dataIndex" :columns="columns" :data-source="allData">
          <span slot="error" slot-scope="error">
            <a-tag color="#87d068" v-if="!error">
              设备正常
            </a-tag>
            <a-tag color="#f50" v-else>
              设备异常
            </a-tag>
          </span>
          <span slot="offLine" slot-scope="offLine">
            <a-tag color="#87d068" v-if="!offLine">
              在线
            </a-tag>
            <a-tag color="#f50" v-else>
              离线
            </a-tag>
          </span>
          <span slot="stop" slot-scope="stop">
            <a-tag color="#87d068" v-if="!stop">
              否
            </a-tag>
            <a-tag color="#f50" v-else>
              是
            </a-tag>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="设备控制" force-render>
        <a-row>
          <p>转速</p>
          <a-col :span="12">
            <a-slider v-model="rotateSpeed" :min="0" :max="rotateSpeedMax || 1000" />
          </a-col>
          <a-col :span="4">
            <a-input-number v-model="rotateSpeed" :min="0" :max="rotateSpeedMax || 1000" style="marginLeft: 16px" />
          </a-col>
          <a-col :span="2">
            <a-button @click="execute('rotateSpeed')">执行</a-button>
          </a-col>
        </a-row>
        <a-row>
          <p>最大转速</p>
          <a-col :span="12">
            <a-slider v-model="rotateSpeedMax" :min="698" :max="5999" />
          </a-col>
          <a-col :span="4">
            <a-input-number v-model="rotateSpeedMax" :min="698" :max="5999" style="marginLeft: 16px" />
          </a-col>
          <a-col :span="2">
            <a-button @click="execute('rotateSpeedMax')">执行</a-button>
          </a-col>
        </a-row>
        <a-row>
          <p>转动系数</p>
          <a-col :span="12">
            <a-slider v-model="coefficient" :min="0" :max="1" :step="0.01" />
          </a-col>
          <a-col :span="4">
            <a-input-number v-model="coefficient" :min="0" :max="1" :step="0.01" style="marginLeft: 16px" />
          </a-col>
          <a-col :span="2">
            <a-button @click="execute('coefficient')">执行</a-button>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { getFFU, putFFUSpeed } from '@/services/dimension.js'
const columns = [
  {
    title: '风机ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '风机组ID',
    dataIndex: 'ffuGroupId',
    key: 'ffuGroupId',
  },
  {
    title: '区域名称',
    dataIndex: 'zoneName',
    key: 'zoneName',
  },
  {
    title: '风机组名称',
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: 'FFU名称',
    dataIndex: 'ffuName',
    key: 'ffuName',
  },
  {
    title: '运行小时',
    key: 'runHours',
    dataIndex: 'runHours',
  },
  {
    title: '风机速度/rpm',
    key: 'speed',
    dataIndex: 'speed',
  },
  {
    title: '转动系数',
    key: 'ratingFactor',
    dataIndex: 'ratingFactor',
  },
  {
    title: '最大转速/rpm',
    key: 'maxRpm',
    dataIndex: 'maxRpm',
  },
  {
    title: '马达温度/℃',
    key: 'motorTemp',
    dataIndex: 'motorTemp',
  },
  {
    title: '电子温度/℃',
    key: 'eleTemp',
    dataIndex: 'eleTemp',
  },
  {
    title: '盒子温度/℃',
    key: 'boxTemp',
    dataIndex: 'boxTemp',
  },
  {
    title: '电流/mA',
    key: 'current',
    dataIndex: 'current',
  },
  {
    title: '电压/mV',
    key: 'voltage',
    dataIndex: 'voltage',
  },
  {
    title: '功率',
    key: 'power',
    dataIndex: 'power',
  },
  {
    title: '协议',
    key: 'protocol',
    dataIndex: 'protocol',
  },
  {
    title: '设备状态',
    key: 'error',
    dataIndex: 'error',
    scopedSlots: { customRender: 'error' },
  },
  {
    title: '在线状态',
    key: 'offLine',
    dataIndex: 'offLine',
    scopedSlots: { customRender: 'offLine' },
  },
  {
    title: '是否停止',
    key: 'stop',
    dataIndex: 'stop',
    scopedSlots: { customRender: 'stop' },
  },
]

export default {
  props: {
    allId: {
      type: [Array],
    },
  },
  mounted() {
    this.AllFFU()
  },
  data() {
    return {
      allData: [],
      columns,
      rotateSpeed: 500,
      rotateSpeedMax: 0,
      coefficient: 0.5,
    }
  },
  methods: {
    AllFFU() {
      if (this.allId) {
        this.allId.forEach(async (e, i) => {
          try {
            await getFFU(e).then((res) => {
              if (res.msgCode === 0) {
                this.allData.push(res.data)
              }
            })
            console.log(this.allData)
          } catch (error) {
            this.$message.error('发生了未知错误,请稍后重试')
          }
        })
      }
    },
    execute(r) {
      // 执行
      this.allData.forEach(async (e, i) => {
        const params = [
          {
            action: 'SET_TARGET_VALUE',
            ffuGroupId: e.ffuGroupId,
            ffuId: e.id,
            protocol: e.protocol,
            value: this.rotateSpeed,
          },
        ]
        if (r === 'rotateSpeed') {
          params[0].action = 'SET_TARGET_VALUE'
          params[0].value = this.rotateSpeed
        } else if (r === 'rotateSpeedMax') {
          params[0].action = 'SET_MAXIMUM_RPM'
          params[0].value = this.rotateSpeedMax
        } else if (r === 'coefficient') {
          params[0].action = 'SET_RATING_FACTOR'
          params[0].value = this.coefficient
        }
        console.log(params)
        try {
          const res = await putFFUSpeed(params)
          console.log(res)
          if (res.msgCode === 0) {
            console.log('全部都修改完成了')
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.ant-tabs-tabpane {
  height: 400px;
}
</style>
