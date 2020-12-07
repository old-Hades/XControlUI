<template>
  <div class="father">
    <div id="LaEcharts" :style="{ width: '340px', height: '170px' }"></div>
  </div>
</template>
<script>
import { getCleanRoom } from '../../../services/home'

export default {
  data() {
    return {
      j1: [],
      j2: [],
      j3: [],
      all: []
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
      res.data.forEach((e, i) => {
        // e.consumption.forEach(r => {
        //   console.log(r.value)
        //   // _.j1.push(r.value)
        // })
        _.all.push(e.consumption)
      })
      // console.log(_.all[0])
      _.all[0].forEach(e => {
        _.j1.push(e.value)
      })
      _.all[1].forEach(e => {
        _.j2.push(e.value)
      })
      _.all[2].forEach(e => {
        _.j3.push(e.value)
      })
      this.powerInfo()
    },
    powerInfo() {
      let _this = this
      let LaEcharts = this.$echarts.init(document.getElementById('LaEcharts'))

      const option = {
        tooltip: {
          trigger: 'axis',
          confine: true
        },
        legend: {
          data: ['洁净室1', '洁净室2', '洁净室3'],
          inactiveColor: '#aaa',
          textStyle: {
            color: '#26CBF9'
          },
          itemWidth: 30,
          itemHeight: 3,
          icon: 'rect'
        },
        grid: {
          left: '11%',
          right: '2%',
          bottom: '10%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false, //坐标轴两边留白
          data: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29],
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            //	margin:15,
            textStyle: {
              color: '#A6B4CF',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 10
            }
            //rotate:50,
          },
          axisTick: {
            //坐标轴刻度相关设置。
            show: true,
            alignWithLabel: true,
            inside: true,
            lineStyle: {
              color: '#9BA9C7'
            }
          },
          axisLine: {
            //坐标轴轴线相关设置
            lineStyle: {
              color: '#A6B4CF'
            }
          },
          axisPointer: {
            label: {
              formatter: '当月{value}号'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: '#a8aab0',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#A6B4CF'
              }
            },
            axisTick: {
              show: true,
              alignWithLabel: true,
              inside: true,
              lineStyle: {
                color: '#9BA9C7'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#A6B4CF'
                // 	opacity:0.1
              }
            }
          }
        ],
        series: [
          {
            name: '洁净室1',
            type: 'line',
            itemStyle: {
              emphasis: {
                label: {
                  show: true
                }
              },
              normal: {
                color: '#71E3E3',
                lineStyle: {
                  color: '#71E3E3',
                  width: 1
                }
              }
            },
            data: _this.j1
          },
          {
            name: '洁净室2',
            type: 'line',
            itemStyle: {
              emphasis: {
                label: {
                  show: true
                }
              },
              normal: {
                color: '#78279E',
                lineStyle: {
                  color: '#78279E',
                  width: 1
                }
              }
            },
            data: _this.j2
          },
          {
            name: '洁净室3',
            type: 'line',
            itemStyle: {
              borderWidth: 0,
              emphasis: {
                label: {
                  show: true
                }
              },
              normal: {
                color: '#D26284',
                lineStyle: {
                  color: '#D26284',
                  width: 1
                }
              }
              // borderColor: "rgba(46, 249, 10, 1)"
            },
            data: _this.j3
          }
        ]
      }

      LaEcharts.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
.father {
  overflow: hidden;
}
#LaEcharts {
  width: 380px;
}
</style>
