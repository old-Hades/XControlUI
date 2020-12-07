<template>
  <div>
    <div id="myChart" :style="{ width: '500px', height: '500px' }"></div>
  </div>
</template>
<script>
export default {
  name: 'dash_echarts',
  props: {
    rotateSpeed: {
      type: [String, Number],
    },
    rotateSpeedMax: {
      type: [String, Number],
    },
    coefficient: {
      type: [String, Number],
    },
  },
  data() {
    return {
      timer: null,
      flag: false,
    }
  },

  mounted() {
    this.newShow()
  },
  methods: {
    async newShow() {
      if (this.timer) {
        return
      } else {
        let timeOut = await setTimeout(() => {
          this.flag = true
          this.drawLine()
          clearTimeout(timeOut)
        }, 500)
      }
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      let that = this
      console.log(this.rotateSpeedMax, this.rotateSpeed)
      const option = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}/rpm',
        },
        series: [
          {
            name: '当前速度',
            type: 'gauge',
            detail: { formatter: '{value}/rpm' },
            startAngle: 180,
            endAngle: 0,
            max: that.rotateSpeedMax, // 要父组件传递进来
            data: [{ value: that.rotateSpeed, name: '速度/rpm' }],
          },
        ],
      }
      myChart.setOption(option)
      that.timer = setInterval(function() {
        that.$emit('getNewDash')
        option.series[0].data[0].value = that.rotateSpeed
        myChart.setOption(option)
      }, 10000)
    },
    destroyed() {
      this.timer = null
    },
  },
}
</script>
<style lang="less" scoped></style>
