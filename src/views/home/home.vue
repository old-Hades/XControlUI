<template>
  <div class="home">
    <!-- left -->
    <div class="w">
      <div class="left">
        <img src="@/assets/home/FFU运行情况分析框@2x.png" alt="" />
        <div class="echarts_box analyse_l">
          <kw v-if="grossPower" :grossPower="grossPower" />
          <analyse v-if="onlineRate" :onlineRate="onlineRate" />
        </div>
      </div>
      <div class="left">
        <img src="@/assets/home/FFU运行数量分析框@2x.png" alt="" />
        <div class="echarts_box">
          <num v-if="numObj" :numObj="numObj" />
        </div>
      </div>
      <div class="left">
        <img src="@/assets/home/通讯通道总览框@2x.png" alt="" />
        <div class="echarts_box">
          <overview v-if="percent" :percent="percent" />
          <information v-if="total" :total="total" />
        </div>
      </div>
    </div>
    <!-- center -->
    <div class="w">
      <center />
    </div>
    <!-- right -->
    <div class="w">
      <div class="right">
        <img src="@/assets/home/洁净室FF运行数量分析框@2x.png" alt="" />
        <div class="echarts_box">
          <cleanRoomNum />
        </div>
      </div>
      <div class="right">
        <img src="@/assets/home/洁净室功率分析框@2x.png" alt="" />
        <div class="echarts_box">
          <power />
        </div>
      </div>
      <div class="right">
        <img src="@/assets/home/洁净室功耗分析框@2x.png" alt="" />
        <div class="echarts_box">
          <LabourCost />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import analyse from './components/analyse'
import num from './components/num'
import Overview from './components/overview'
import kw from './components/kw'
import center from './components/center'
import information from './components/information'
import power from './components/power'
import cleanRoomNum from './components/cleanRoomNum'
import LabourCost from './components/LabourCost'
import { getChannel, getFFU, getCleanRoom } from '../../services/home'
export default {
  components: {
    analyse, // ffu运行情况分析图2
    num, // ffu运行数量分析图
    Overview, // ffu通道总览
    kw, // ffu运行情况分析图1
    center, // 中间的大图
    information, // 通道总览信息
    power, // 洁净室功率分析
    cleanRoomNum, //洁净室FF运行数量分析框
    LabourCost // 功耗分析
  },
  data() {
    return {
      total: null,
      percent: null,
      grossPower: null,
      onlineRate: null,
      numObj: null
    }
  },
  created() {
    this.FFU()
    this.Channel()
  },
  methods: {
    async FFU() {
      const res = await getFFU()
      if (res.msgCode !== 0) {
        return this.$message.error('获取FFU运行数据失败')
      }
      this.grossPower = res.data.grossPower
      this.onlineRate = res.data.onlineRate
      this.numObj = res.data
    },
    async Channel() {
      const res = await getChannel()
      // console.log(res.data)
      if (res.msgCode !== 0) {
        return this.$message.error('获取通道总览数据失败')
      }
      this.total = res.data.total
      this.percent = (res.data.normalTotal / this.total) * 100
    }
  },
  computed: {},
  mounted() {}
}
</script>
<style lang="less" scoped>
body {
  background-color: #162744;
}
.home {
  width: 100%;
  // height: 664px;
  background-color: #162744;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
  .w {
    width: 100%;
    height: 100%;
    // border: 0.1px solid #ccc;
    // background-color: #fff;
    &:nth-child(2) {
      width: 200%;
    }

    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    .left {
      position: relative;
    }
    .left,
    .right {
      img {
        width: 90%;
        height: 40px;
        margin-top: 10px;
        margin-left: 10px;
      }
      .echarts_box {
        width: 380px;
        z-index: 99;
        // width: 100%;
        height: 218.7px;
        border: 20px solid;
        background-color: #0b1535;
        // border-radius: 5px;
        -moz-border-image: url('~@/assets/home/FFU运行情况分析底图@2x.png') 55
          70;
        -webkit-border-image: url('~@/assets/home/FFU运行情况分析底图@2x.png')
          55 70;
        -o-border-image: url('~@/assets/home/FFU运行情况分析底图@2x.png') 55 70;
        border-image: url('~@/assets/home/FFU运行情况分析底图@2x.png') 55 70;
      }
      width: 100%;
      height: 33.3333333%;
      .right_overview {
        // height: 170px;
        width: 170px;
      }
      .left_overview {
        // height: 170px;
        width: 170px;
      }
      .analyse_l {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
}
</style>
