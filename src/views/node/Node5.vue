<template>
  <div class="box">
    <div id="myChart5" :style="{width:'100%', height: '300px'}"></div>
    <div class="bottom">
      <div class="left">
        <table>
          <tr>
            <td>可用容量</td>
          </tr>
          <tr>
            <td>{{this.data.memAvailableSize}}</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>Swap已用容量</td>
          </tr>
          <tr>
            <td>{{this.data.memSwapUsedSize}}</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>虚拟内存已用容量</td>
          </tr>
          <tr>
            <td>{{this.data.memVirtualInUseSize}}</td>
          </tr>
        </table>
      </div>
      <div class="right">
        <ul>
          <li>PageSize</li>
          <li>物理内存容量</li>
          <li>Swap容量</li>
          <li>虚拟内存最大容量</li>
        </ul>
        <ul>
          <li>{{this.static.memPageSize}}</li>
          <li>{{this.static.memTotalSize}}</li>
          <li>{{this.static.memSwapTotalSize}}</li>
          <li>{{this.static.memVirtualMaxSize}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import { getMemory, getSMemory } from "../../services/working";

export default {
  mounted() {
    this.getData();
    this.timer = setInterval(() => {
      this.getData();
    }, 1000);
    this.getStatic();
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
  },
  data() {
    return {
      myChart: "",
      data: [],
      static: [],
      memVirtualInUseSize: [],
    };
  },
  methods: {
    getData() {
      getMemory("test-2").then((res) => {
        this.data = res;
        this.memVirtualInUseSize.length = 60;
        this.memVirtualInUseSize.push(res.memVirtualInUseSize);
        this.memVirtualInUseSize.shift();
        this.$nextTick(function () {
          this.drawLine("myChart5");
        });
      });
    },
    getStatic() {
      getSMemory("test-2").then((res) => {
        this.static = res;
      });
    },
    drawLine(id) {
      this.myChart = this.$echarts.init(document.getElementById(id));
      var option = {
        xAxis: {
          type: "category",
        },
        yAxis: {
          name: "内存使用量",
          min: [2000000000],
          max: [6000000000],
          splitLine: {
            show: false, //是否显示分隔线。默认数值轴显示，类目轴不显示。
          },
          nameGap: 15, // 坐标轴名称与轴线之间的距离。
          //   axisTick: {
          //     inside: true,
          //   },
        },
        title: {
          text: "内存",
        },
        series: [
          {
            areaStyle: {
              normal: {},
            },
            type: "line", //线条
            name: "内存", //系列名称，用于tooltip的显示
            data: this.data.memVirtualInUseSize,
            // symbol: "circle", //标记的类型：圆圈
            // itemStyle: {
            //   normal: {
            //     shadowBlur: 50, //文字块的背景阴影长度。
            //     shadowColor: "red", //文字块的背景阴影颜色。
            //     color: "red", //图形的颜色
            //     lineStyle: {
            //       color: "#4d6dfd", //线的颜色
            //       width: 1, //线的宽度
            //     },
            //   },
            // },
          },
        ],
      };
      this.myChart.setOption(option);

      this.myChart.setOption({
        series: [
          {
            name: "内存使用",
            data: this.memVirtualInUseSize,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
#myChart5 {
  border: solid 1px rgb(104, 178, 202);
}
.bottom {
  display: flex;
  margin-top: 20px;
}
.left {
  width: 130px;
}
.right {
  display: flex;
  margin-left: 90px;
}
.right2 {
  display: flex;
  margin-left: 70px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
ul:nth-child(1) {
  color: rgb(153, 151, 151);
}
ul:nth-child(2) {
  color: #010305;
  margin-left: 10px;
}
table tr:nth-child(1) {
  color: rgb(153, 151, 151);
  font-size: 14px;
}
table tr:nth-child(2) {
  color: #000;
  font-size: 20px;
  font-weight: 600;
}
table {
  border-collapse: separate;
  border-spacing: 5px 0px;
}
</style>
