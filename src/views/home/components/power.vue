<template>
  <div class="father">
    <div id="myEcharts" :style="{ width: '340px', height: '170px' }"></div>
  </div>
</template>
<script>
import { getCleanRoom } from '../../../services/home'
export default {
  data() {
    return {
      realTimePower: [],
      totalPower: []
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
        _.realTimePower.push(e.realTimePower)
        _.totalPower.push(e.totalPower)
      })
      this.powerInfo()
    },
    powerInfo() {
      let myEcharts = this.$echarts.init(document.getElementById('myEcharts'))
      const CubeLeft = this.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x, shape.y]
          const c1 = [shape.x - 9, shape.y - 9]
          const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 9]
          const c3 = [xAxisPoint[0], xAxisPoint[1]]
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath()
        }
      })
      const CubeRight = this.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x, shape.y]
          const c2 = [xAxisPoint[0], xAxisPoint[1]]
          const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9]
          const c4 = [shape.x + 18, shape.y - 9]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath()
        }
      })
      const CubeTop = this.$echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0
        },
        buildPath: function(ctx, shape) {
          const c1 = [shape.x, shape.y]
          const c2 = [shape.x + 18, shape.y - 9]
          const c3 = [shape.x + 9, shape.y - 18]
          const c4 = [shape.x - 9, shape.y - 9]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath()
        }
      })
      this.$echarts.graphic.registerShape('CubeLeft', CubeLeft)
      this.$echarts.graphic.registerShape('CubeRight', CubeRight)
      this.$echarts.graphic.registerShape('CubeTop', CubeTop)
      const MAX = this.totalPower
      const VALUE = this.realTimePower
      const option = {
        color: ['#19356A', '#3F90E3'],
        backgroundColor: '#0B1535',
        grid: {
          left: 0,
          right: 0,
          bottom: '1%',
          top: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          triggerOn: 'mousemove',
          alwaysShowContent: false,
          confine: true,
          axisPointer: {
            animation: false,
            textStyle: {
              color: 'rgba(118, 182, 204, 1)'
            }
          },
          borderWidth: 1,
          borderColor: '#2291C9',
          textStyle: {
            color: 'rgba(118, 182, 204, 1)'
          }
        },
        xAxis: {
          type: 'category',
          data: ['洁净室1', '洁净室2', '洁净室3'],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#A8AAB0'
            }
          },
          offset: 1,
          axisTick: {
            show: false,
            length: 9,
            alignWithLabel: true,
            lineStyle: {
              color: '#7DFFFD'
            }
          },
          axisLabel: {
            fontSize: 12,
            color: '#22BFDD'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#A8AAB0'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ccc'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 12
          }
        },

        series: [
          {
            name: '总功率',
            type: 'custom',
            renderItem: function(params, api) {
              const location = api.coord([api.value(0), api.value(1)])
              return {
                type: 'group',
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: 'rgba(47,102,192,.27)'
                    }
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: 'rgba(59,128,226,.27)'
                    }
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: 'rgba(72,156,221,.27)'
                    }
                  }
                ]
              }
            },
            data: MAX
          },
          {
            name: '当前功率',
            type: 'custom',
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)])
              return {
                type: 'group',
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: '#3B80E2'
                          },
                          {
                            offset: 1,
                            color: '#49BEE5'
                          }
                        ]
                      )
                    }
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: '#3B80E2'
                          },
                          {
                            offset: 1,
                            color: '#49BEE5'
                          }
                        ]
                      )
                    }
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new this.$echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                          {
                            offset: 0,
                            color: '#3B80E2'
                          },
                          {
                            offset: 1,
                            color: '#49BEE5'
                          }
                        ]
                      )
                    }
                  }
                ]
              }
            },
            data: VALUE
          }
        ]
      }
      myEcharts.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
.father {
  overflow: hidden;
}
#myEcharts {
  width: 380px;
}
</style>
