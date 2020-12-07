<template>
  <div id="box">
    <div id="myChart" :style="{width:'100%', height: '300px'}"></div>
    <div class="bottom">
      <div class="left">
        <table>
          <tr>
            <td>利用率</td>
            <td>速度</td>
          </tr>
          <tr>
            <td>{{this.data.cpuloadRate}}%</td>
            <td>{{this.data.cpucurrentFrequency}}GHz</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>进程</td>
            <td>线程</td>
            <td>名称</td>
          </tr>
          <tr>
            <td>{{this.data.osprocessCount}}</td>
            <td>{{this.data.osthreadCount}}</td>
            <td>{{this.static.name}}</td>
          </tr>
        </table>
        <!-- <ul>
          <li>正常运行时间</li>
          <li>0：08：00：09</li>
        </ul>-->
        <table>
          <tr>
            <td>正常运行时间</td>
          </tr>
          <tr>
            <td>{{this.data.ossystemUptime}}</td>
          </tr>
        </table>
      </div>
      <div class="right">
        <ul>
          <li>基准速度：</li>
          <li>最大速度：</li>
          <li>CPU个数：</li>
          <li>内核个数：</li>
          <li>逻辑处理器：</li>
        </ul>
        <ul>
          <li>{{this.static.vendorFrequency}}GHz</li>
          <li>{{this.static.maxFrequency}}</li>
          <li>{{this.static.physicalPackageCount}}</li>
          <li>{{this.static.physicalProcessorCount}}</li>
          <li>{{this.static.logicalProcessorCount}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import { getCpu, getSCpu } from "../../services/working";

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
      cpuloadRate: [],
    };
  },
  methods: {
    getData() {
      getCpu("test-2").then((res) => {
        this.data = res;
        this.cpuloadRate.length = 60;
        this.cpuloadRate.shift();
        this.cpuloadRate.push(res.cpuloadRate);
         this.$nextTick(function () {
          this.drawLine("myChart");
        });
      });
    },
    getStatic() {
      getSCpu("test-2").then((res) => {
        this.static = res;
      });
    },
    drawLine(id) {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById(id));

      // var that = this;

      this.myChart.setOption({
        xAxis: {
          type: "category",
          // boundaryGap: false,   //留白
          // show: false,
        },
        yAxis: {
          // boundaryGap: [0, "50%"],
          type: "value",
          name: "%利用率",
          // min: [0],
          // max: [100],
        },
        //提示框
        tooltip: {
          //鼠标浮动时的工具条，显示鼠标所在区域的数据，trigger这个地方每种图有不同的设置
          trigger: "item", //当trigger为’item’时只会显示该点的数据,为’axis’时显示该列下所有坐标轴所对应的数据
        },
        title: {
          text: "CPU",
          // subtext:"uuuu"
        },
        series: [
          {
            // name: "CPU",
            type: "line",
            smooth: true, //弧度 是否平滑曲线
            symbol: "none", //原点
            stack: "a", //切换为堆叠模式
            areaStyle: {
              normal: {},
            }, //设置 areaStyle 后可以绘制面积图。
            data: this.cpuloadRate,
            color: "#87b9d7",
          },
        ],
      });

      // console.log(this.cpuloadRate);
      // 如果只需要加入单个数据，可以先 data.push(value) 后 setOption

      this.myChart.setOption({
        series: [
          {
            // name: "CPU",
            data: this.cpuloadRate,
          },
        ],
      });
    },
  },
};
</script>




<style scoped>
#myChart {
  border: solid 1px rgb(104, 178, 202);
}
.bottom {
  display: flex;
  margin-top: 20px;
}
.right {
  display: flex;
  margin-left: 50px;
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
  color: #010305;
}
table {
  border-collapse: separate;
  border-spacing: 20px 0px;
}
</style>>
