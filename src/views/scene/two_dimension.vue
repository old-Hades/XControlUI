<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="FFU参数">
        <p class="details">详情</p>
        <div id="maxBox" v-if="FFUDetail">
          <ul>
            <li>
              <div>区域名称</div>
              <div>{{ FFUDetail.zoneName || '~' }}</div>
            </li>
            <li>
              <div>风机组名称</div>
              <div>{{ FFUDetail.groupName || '~' }}</div>
            </li>
            <li>
              <div>FFU名称</div>
              <div>{{ FFUDetail.ffuName || '~' }}</div>
            </li>
            <li class="maxRpm">
              <div>出厂日期</div>
              <div>{{ FFUDetail.shipmentDate  || '~' }}</div>
            </li>
            <li>
              <div>序列号</div>
              <div>{{ FFUDetail.serialNumberCode  || '~' }}</div>
            </li>
            <li>
              <div>运行小时/h</div>
              <div>{{ FFUDetail.runHours || '~' }}</div>
            </li>
            <li>
              <div>风机速度/rpm</div>
              <div>{{ FFUDetail.speed || '~' }}</div>
            </li>
            <li>
              <div>转动系数</div>
              <div>{{ FFUDetail.ratingFactor || '~' }}</div>
            </li>
            <li class="maxRpm">
              <div>最大转速/rpm</div>
              <div>{{ FFUDetail.maxRpm || '~' }}</div>
            </li>
            <li>
              <div>马达温度/℃</div>
              <div>{{ FFUDetail.motorTemp || '~' }}</div>
            </li>
            <li>
              <div>电子温度/℃</div>
              <div>{{ FFUDetail.eleTemp || '~' }}</div>
            </li>
            <li>
              <div>盒子温度/℃</div>
              <div>{{ FFUDetail.boxTemp || '~' }}</div>
            </li>
            <li>
              <div>电流/mA</div>
              <div>{{ FFUDetail.current || '~' }}</div>
            </li>
            <li>
              <div>电压/mV</div>
              <div>{{ FFUDetail.voltage || '~' }}</div>
            </li>
            <li>
              <div>功率/w</div>
              <div>{{ FFUDetail.power || '~' }}</div>
            </li>
            <li>
              <div>协议</div>
              <div>{{ FFUDetail.protocol || '~' }}</div>
            </li>
            <li>
              <div>设备状态</div>
              <div>
                <a-tag color="#87d068" v-if="!FFUDetail.error">
                  设备正常
                </a-tag>
                <a-tag color="#f50" v-else>
                  设备异常
                </a-tag>
              </div>
            </li>
            <li>
              <div>在线状态</div>
              <div>
                <a-tag color="#87d068" v-if="!FFUDetail.offLine">
                  在线
                </a-tag>
                <a-tag color="#f50" v-else>
                  离线
                </a-tag>
              </div>
            </li>
            <li>
              <div>是否停止</div>
              <div>
                <a-tag color="#87d068" v-if="!FFUDetail.stop">
                  否
                </a-tag>
                <a-tag color="#f50" v-else>
                  是
                </a-tag>
              </div>
            </li>
          </ul>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="控制" force-render>
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
      <a-tab-pane key="3" tab="风速曲线">
        风速曲线
      </a-tab-pane>
      <a-tab-pane key="4" tab="设备告警">
        <query query="facility" :alarmObject="alarmObject" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="操作告警">
        <query query="operation" :alarmObject="alarmObject" />
      </a-tab-pane>
    </a-tabs>
    <dash class="dash" @getNewDash="getFFUOld" :rotateSpeed="rotateSpeed" :rotateSpeedMax="rotateSpeedMax" :coefficient="coefficient"></dash>
  </div>
</template>
<script>
import query from '@/components/Query.vue'
import { getFFU, putFFUSpeed } from '@/services/dimension.js'
import dash from './dash.vue'
export default {
  props: {
    nodeId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      rotateSpeed: 0,
      rotateSpeedMax: 0,
      coefficient: 0,
      alarmObject: null,
      FFUDetail: {},
      coe: 0,
    }
  },
  created() {
    this.getFFUOld() // 获取FFU参数
  },
  methods: {
    async getFFUOld() {
      try {
        const data = await getFFU(this.nodeId)
        if (data.msgCode === 0) {
          // this.$message.success('获取FFU最新数据成功')
          this.FFUDetail = data.data
          this.alarmObject = this.FFUDetail.zoneName + '/' + this.FFUDetail.groupName + '/' + this.FFUDetail.ffuName
          this.rotateSpeedMax = this.FFUDetail.maxRpm
          this.rotateSpeed = this.FFUDetail.speed
          this.coefficient = this.FFUDetail.ratingFactor
        } else if (data.msgCode === 101) {
          this.$message.error('获取FFU数据失败，未查询到数据')
        }
      } catch (error) {
        console.log(error)
        this.$message.error('发生了未知错误，请稍后重试')
      }
    },
    async execute(r) {
      // 执行
      // console.log(this.FFUDetail)
      const params = [
        {
          action: 'SET_TARGET_VALUE',
          ffuGroupId: this.FFUDetail.ffuGroupId,
          ffuId: this.nodeId,
          protocol: this.FFUDetail.protocol,
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
          this.$message.success('修改成功')
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  components: {
    query,
    dash,
  },
}
</script>
<style lang="less" scoped>
.details {
  font-size: 20px;
  font-weight: 700;
}

.code-box-demo .ant-slider {
  margin-bottom: 16px;
}

#maxBox {
  ul {
    width: 800px;
    li {
      float: left;
      height: 50px;
      // background-color: pink;
      width: 33%;
      list-style: none;
      border: 0.1px solid #ccc;
      div {
        display: inline-block;
        &:nth-child(1) {
          width: 100px;
          height: 100%;
          text-align: center;
          line-height: 50px;
          background-color: #eee;
          border-right: 0.1px solid #ccc;
        }
        &:nth-child(2) {
          height: 100%;
          min-width: 100px;
          max-width: 200px;
          width: 100px;
          text-align: center;
          line-height: 50px;
          background-color: #fff;
        }
      }
    }
    .maxRpm {
      width: 66% !important;
    }
  }
}
.ant-tabs {
  width: 800px;
}
.dash {
  position: absolute;
  right: -30px;
  top: 170px;
}
.ant-tabs-tabpane {
  height: 400px;
}
</style>
