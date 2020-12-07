<template>
  <div class="left_overview">
    <div id="overview" :style="{ width: '170px', height: '170px' }"></div>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    // overview
    this.overview()
  },
  methods: {
    overview() {
      let overview = this.$echarts.init(document.getElementById('overview'))
      var data = {
        value: [this.percent],
        nAmount: 1566557.14
      }
      const option = {
        backgroundColor: '#0B1535',
        title: {
          text: data.value[0] + '%',
          textStyle: {
            color: '#26C5B8',
            fontSize: 20
          },
          subtextStyle: {
            color: '#aaaaaa',
            fontSize: 20
          },
          itemGap: 20,
          left: 'center',
          top: '45%'
        },
        tooltip: {
          formatter: function(params) {
            return (
              '<span style="color: #fff;">正常：' + params.value + '%</span>'
            )
          }
        },
        angleAxis: {
          max: 100,
          clockwise: false, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        polar: [
          {
            center: ['50%', '50%'], //中心点位置
            radius: '100%' //图形大小
          }
        ],
        series: [
          {
            name: '大环',
            type: 'gauge',
            splitNumber: 12,
            radius: '100%',
            center: ['50%', '50%'],
            startAngle: 0,
            endAngle: 359.9999,
            axisLine: {
              show: false,
              lineStyle: {
                color: [[1, '#1f59a7']]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              length: 15,
              lineStyle: {
                color: 'auto',
                width: 1.5
              }
            },
            axisLabel: {
              show: false
            },
            detail: {
              show: false
            }
          },
          {
            name: '小环',
            type: 'gauge',
            splitNumber: 12,
            radius: '78%',
            center: ['50%', '50%'],
            startAngle: 0,
            endAngle: 359.9999,
            axisLine: {
              show: false
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#1f59a7',
                width: 1
              },
              length: 10,
              splitNumber: 3
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              show: false
            }
          },
          {
            type: 'bar',
            data: data.value,
            showBackground: true,
            polarIndex: 0,
            backgroundStyle: {
              color: '#022546',
              borderWidth: 10
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 5,
            itemStyle: {
              normal: {
                opacity: 1,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 1,
                      color: '#23C6DF'
                    },
                    {
                      offset: 0.5,
                      color: '#28C49D'
                    },
                    {
                      offset: 0,
                      color: '#2DC259'
                    }
                  ],
                  globalCoord: false
                },
                shadowBlur: 5,
                shadowColor: '#2A95F9'
              }
            }
          }
        ]
      }
      overview.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.left_overview {
  width: 170px;
  height: 170px;
}
</style>
