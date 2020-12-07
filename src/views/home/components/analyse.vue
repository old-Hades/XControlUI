<template>
  <div>
    <div class="right_ffu">
      <div id="right_ffu" :style="{ width: '150px', height: '150px' }"></div>
      <span>FFU在线率</span>
    </div>
  </div>
</template>
<script>
import 'echarts-liquidfill'

export default {
  props: {
    onlineRate: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.rightFFU()
  },
  methods: {
    rightFFU() {
      let right_ffu = this.$echarts.init(document.getElementById('right_ffu'))
      var value = this.onlineRate
      var data = [value, value, value]
      const option = {
        title: {
          text: (value * 100).toFixed(2) + '{a|%}',
          textStyle: {
            fontSize: 35,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: '#fff',
            rich: {
              a: {
                fontSize: 28
              }
            }
          },
          x: 'center',
          y: '40%'
        },
        itemStyle: {},
        series: [
          {
            type: 'liquidFill',
            radius: '85%',
            center: ['50%', '50%'],
            data: data,
            backgroundStyle: {
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#0B1534'
                  },
                  {
                    offset: 0.5,
                    color: '#0B1534'
                  },
                  {
                    offset: 0,
                    color: '#0B1534'
                  }
                ],
                globalCoord: false
              }
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 5,
                borderColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#77F3E8'
                    },
                    {
                      offset: 1,
                      color: '#5796CB'
                    }
                  ],
                  globalCoord: false
                },
                shadowBlur: 10,
                shadowColor: '#000'
              }
            },
            itemStyle: {
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
              }
            },

            label: {
              normal: {
                formatter: ''
              }
            }
          }
        ]
      }
      right_ffu.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.right_ffu {
  position: relative;
  width: 170px;
  height: 170px;
  left: 22px;
  span {
    display: inline-block;
    margin-left: 38px;
    margin-top: 9px;
    color: #26daf8;
    font-size: 15px;
  }
}
</style>
