<template lang="">
  <div>
    <div class="time">
      查看时间：
      <a-button :type="classR === 'LAST_YEAR' ? 'primary' : ''" @click="timerUp('LAST_YEAR')">年</a-button>
      <a-button :type="classR === 'LAST_MONTH' ? 'primary' : ''" @click="timerUp('LAST_MONTH')">月</a-button>
      <a-button :type="classR === 'LAST_WEEK' ? 'primary' : ''" @click="timerUp('LAST_WEEK')">周</a-button>
      <a-button :type="classR === 'LAST_DAY' ? 'primary' : ''" @click="timerUp('LAST_DAY')" ref="day">日</a-button>
      <a-button :type="classR === 'LAST_HOUR' ? 'primary' : ''" @click="timerUp('LAST_HOUR')">小时</a-button>
      自定义时间： <a-range-picker show-time @change="onTime" @ok="okPicker" />
    </div>
    <div id="Echart" :style="{ width: '900px', height: '500px' }"></div>
  </div>
</template>
<script>
import { getEbmFfuPower } from '@/services/history'
export default {
  name: 'powerEcharts',
  props: {
    fanId: {
      required: true,
      type: [Number, String],
    },
  },
  data() {
    return {
      params: {
        hisSearchEnum: 'LAST_DAY',
        startDate: null,
        endDate: null,
        fanId: this.fanId,
      },
      echartsData: null,
      classR: 'LAST_DAY',
    }
  },
  created() {
    this.timerUp()
  },
  mounted() {
    this.$refs.day.$el.click()
  },
  methods: {
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById('Echart'))
      const option = {
        // title: {
        //   text: 'XControl-Histroy-Cruve',
        // },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          name: '时间',
          data: this.echartsData.map(function(item) {
            return item.dateSDF
          }),
          // inverse: true,
        },
        yAxis: {
          name: '功率/w',
          splitLine: {
            show: true,
          },
          axisLine: {
            symbol: 'diamond',
            symbolSize: 5,
          },
        },
        dataZoom: [
          {
            startValue: '2020-10-04',
          },
          {
            type: 'inside',
          },
        ],
        visualMap: {
          top: 10,
          right: 10,
          pieces: [
            {
              gt: 0,
              lte: 300,
              color: '#096',
            },
            {
              gt: 300,
              lte: 600,
              color: '#ff9933',
            },
            {
              gt: 600,
              lte: 750,
              color: '#660099',
            },
            {
              gt: 750,
              color: '#7e0023',
            },
          ],
          // 默认颜色
          outOfRange: {
            color: '#ccc',
          },
        },
        series: {
          name: '历史功率',
          type: 'line',
          data: this.echartsData.map(function(item) {
            return item
          }),
          markPoint: {
            data: [
              {
                type: 'max',
              },
            ],
            itemStyle: {
              // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'hotpink', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'pink', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        },
      }
      myChart.setOption(option)
    },
    onTime(date, dateString) {
      // console.log(date, dateString)
      this.params.startDate = dateString[0]
      this.params.endDate = dateString[1]
    },
    okPicker() {
      console.log(this.params)
      this.params.hisSearchEnum = 'CUSTOMIZE'
      if (this.params.startDate && this.params.endDate) {
        this.echartsData = null
        this.timerUp()
      }
    },
    async timerUp(h) {
      this.echartsData = null
      if (h) {
        this.params.hisSearchEnum = h
      }
      console.log(this.params)
      const res = await getEbmFfuPower(this.params)
      if (res.msgCode === 0) {
        this.classR = h
        this.echartsData = res.data
        console.log(this.echartsData)
        this.params = {
          hisSearchEnum: 'LAST_DAY',
          startDate: null,
          endDate: null,
          fanId: this.fanId,
        }
        this.drawLine()
      } else if (res.msgCode === 101) {
        this.$message.error(`为查询到节点${h}的数据`)
      }
    },
  },
}
</script>
<style lang="less" scoped>
.ant-btn {
  margin: 10px;
}
.time {
  width: 900px;
}
</style>
