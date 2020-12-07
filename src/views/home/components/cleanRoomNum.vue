<template>
  <div>
    <div id="cEcharts" :style="{ width: '340px', height: '170px' }"></div>
  </div>
</template>
<script>
import { getCleanRoom } from '../../../services/home'

export default {
  data() {
    return {
      faultTotal: [],
      runTotal: [],
      offlineTotal: [],
      stopTotal: []
    }
  },
  mounted() {
    this.cleanRoom()
  },
  methods: {
    async cleanRoom() {
      const res = await getCleanRoom()
      if (res.msgCode !== 0) {
        return this.$message.error('获取洁净室功率失败')
      }
      let _ = this
      res.data.forEach(e => {
        _.faultTotal.push(e.ffuOperatingStatus.faultTotal)
        _.runTotal.push(e.ffuOperatingStatus.runTotal)
        _.offlineTotal.push(e.ffuOperatingStatus.offlineTotal)
        _.stopTotal.push(e.ffuOperatingStatus.stopTotal)
      })
      this.powerInfo()
    },
    powerInfo() {
      let cEcharts = this.$echarts.init(document.getElementById('cEcharts'))
      let scale = 1
      let singleData = this.faultTotal // 故障
      let multipleData = this.runTotal // 运行
      let judgeData = this.offlineTotal // 离线
      let haltData = this.stopTotal // 停机
      let color = '#ccc'
      const option = {
        backgroundColor: '#0B1535',
        tooltip: {
          triggerOn: 'mousemove',
          alwaysShowContent: false,
          confine: true,
          trigger: 'item',
          transitionDuration: 0,
        },
        legend: {
          width: '90%',
          data: ['故障', '运行', '离线', '停机'],
          align: 'left',
          itemGap: 45,
          // x: 'right',
          right: '5%',
          y: '1%',
          icon: 'rect',
          itemWidth: 10 * scale, // 图例图形宽度
          itemHeight: 10 * scale, // 图例图形高度
          textStyle: {
            color: '#25D0ED',
            fontSize: 10 * scale
          },
          padding: [0, 0, 0, 0],
          inactiveColor: '#19356A'
        },
        grid: {
          left: '1%',
          right: '1%',
          bottom: '0%',
          top: '8%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['洁净室1', '洁净室2', '洁净室3'],
            axisLabel: {
              // inside: true,
              padding: [0, 0, 0, 0],
              textStyle: {
                color: '#26F2FF',
                fontSize: 12 * scale
              },
              margin: 10
            },
            axisTick: {
              inside: true,
              length: 1 * scale,
              lineStyle: {
                color: color
              }
            },
            axisLine: {
              lineStyle: {
                color: color
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(80,224,255,0.3)',
                type: 'dashed'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              // inside: true,
              padding: [0, 0, 0, 0],
              textStyle: {
                color: '#A8AAB0',
                fontSize: 12 * scale
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#A8AAB0'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A8AAB0'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#ccc',
                type: 'solid'
              },
              show: true
            },
            nameTextStyle: {
              color: '#fff',
              fontSize: 16 * scale,
              padding: [0, 0, 10, 0]
            }
          }
        ],
        series: [
          {
            name: '故障',
            type: 'bar',
            stack: '故障',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: 'rgba(94,218,255,0.4)'
              }
            },
            data: singleData
          },
          {
            name: '故障',
            type: 'bar',
            stack: '故障',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: '#83e0fc'
              }
            },
            data: [2 * scale, 2 * scale, 2 * scale]
          },
          {
            name: '运行',
            type: 'bar',
            stack: '运行',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: 'rgba(20,124,146,0.4)'
              }
            },
            data: multipleData
          },
          {
            name: '运行',
            type: 'bar',
            stack: '运行',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: '#23aecb'
              }
            },
            data: [2 * scale, 2 * scale, 2 * scale]
          },
          {
            name: '离线',
            type: 'bar',
            stack: '离线',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: 'rgba(9,149,124,0.4)'
              }
            },
            data: judgeData
          },
          {
            name: '离线',
            type: 'bar',
            stack: '离线',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: '#10c8a7'
              }
            },
            data: [2 * scale, 2 * scale, 2 * scale]
          },

          {
            name: '停机',
            type: 'bar',
            stack: '停机',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: '#ccc'
              }
            },
            data: haltData
          },
          {
            name: '停机',
            type: 'bar',
            stack: '停机',
            barWidth: '15%',
            barGap: '40%',
            itemStyle: {
              normal: {
                color: '#ccc'
              }
            },
            data: [2 * scale, 2 * scale, 2 * scale]
          }
        ]
      }
      cEcharts.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
#cEcharts {
  width: 380px;
}
</style>
