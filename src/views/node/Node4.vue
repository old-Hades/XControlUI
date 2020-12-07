<template>
  <div id="box">
    <div class="cipan">
      <div id="myChart3" :style="{width:'70%', height: '300px'}"></div>
      <div id="chart" :style="{width:'30%', height: '300px'}"></div>
    </div>
    <div class="bottom3">
      <div class="left3">
        <table>
          <tr>
            <td>读速度</td>
          </tr>
          <tr>
            <td>{{this.data.diskReadBytesSpeed}}KB/秒</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>写速度</td>
          </tr>
          <tr>
            <td>{{this.data.diskWriteBytesSpeed}}KB/秒</td>
          </tr>
        </table>
      </div>
      <div class="right3">
        <ul>
          <li>是否可用：</li>
          <li>名称：</li>
          <li>模式：</li>
          <li>驱动器可用容量：</li>
          <li>磁盘容量：</li>
          <li>驱动器容量：</li>
        </ul>
        <ul>
          <li>{{this.static.diskMonitorAvailable}}</li>
          <li>{{this.static.diskName}}</li>
          <li>{{this.static.diskModel}}</li>
          <li>{{this.data.driveUsableSpace}}</li>
          <li>{{this.static.diskSize}}</li>
          <li>{{this.static.driveTotalSpace}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getDesks, getSDesks } from "../../services/working";

export default {
  mounted() {
    this.getData();
    this.timer = setInterval(() => {
      this.getData();
    }, 1000);
    this.getPie();
    this.getStatic();
    this.getPie();
    this.timer2 = setInterval(() => {
      this.getPie();
    }, 1000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
      clearInterval(this.timer2);
    });
  },
  data() {
    return {
      myChart: "",
      myChart2: "",
      data: [],
      obj: {},
      obj2: {},
      arr: [],
      static: [],
      diskWriteBytesSpeed: [],
    };
  },
  methods: {
    getData() {
      getDesks("test-2").then((res) => {
        this.data = res;
        this.diskWriteBytesSpeed.length = 60;
        this.diskWriteBytesSpeed.shift();
        this.diskWriteBytesSpeed.push(res.diskWriteBytesSpeed);
        this.$nextTick(function () {
          this.drawLine("myChart3");
        });
      });
    },
    getPie() {
      getDesks("test-2").then((res) => {
        this.$nextTick(function () {
          this.drawPie("chart");
        });
        var value4 = res.driveUsableSpace;
        var name1 = "驱动器可用容量";
        this.obj.value = value4;
        this.obj.name = name1;
      });
    },
    getStatic() {
      getSDesks("test-2").then((res) => {
        this.static = res;
        var value5 = this.static.driveTotalSpace;
        var name2 = "驱动器容量";
        this.obj2.value = value5;
        this.obj2.name = name2;
      });
    },
    drawLine(id) {
      this.myChart = this.$echarts.init(document.getElementById(id));

      var option = {
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
          name: "%速率",
          min: [0],

        },
        title: {
          text: "磁盘",
        },
        series: [
          {
            name: "",
            type: "line",
            data: this.diskWriteBytesSpeed,
            color: "#87b9d7",
          },
        ],
      };
      this.myChart.setOption(option);
      var that = this;


      this.myChart.setOption({
        series: [
          {
            type: "line",
            name: "磁盘",
            data: this.diskWriteBytesSpeed,
          },
        ],
      });
    },
    drawPie(id, arr2) {
      this.myChart2 = this.$echarts.init(document.getElementById(id));
      this.arr.push(this.obj, this.obj2);
      this.arr.splice(2);
      var option2 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        series: [
          {
            type: "pie",
            name: "容量",
            id: "pie",
            radius: "50%",
            data: [this.arr[0], this.arr[1]],
          },
        ],
      };
      this.myChart2.setOption(option2);
      this.myChart2.setOption({
        series: [
          {
            type: "pie",
            data: [this.arr[0], this.arr[1]],
          },
        ],
      });
    },
  },
};
</script>




<style scoped>
#myChart3,
#chart {
  display: inline-block;
}
.cipan {
  border: solid 1px rgb(104, 178, 202);
}
.bottom3 {
  display: flex;
  margin-top: 20px;
}
.right3 {
  display: flex;
  margin-left: 90px;
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
  border-spacing: 20px 0px;
}
table:nth-child(1) {
  border-left: solid 2px #4db96e;
  margin-bottom: 10px;
}
table:nth-child(2) {
  border-left: dashed 2px #4db96e;
}
</style>>
