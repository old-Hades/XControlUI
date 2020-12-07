<template>
  <div class="box">
    <div id="myChart2" :style="{width:'100%', height: '300px'}"></div>
    <div class="bottom">
      <div class="left">
        <table>
          <tr>
            <td>发送</td>
          </tr>
          <tr>
            <td>{{this.data.netBytesSentSpeed}}Kbps</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>接收</td>
          </tr>
          <tr>
            <td>{{this.data.netBytesRecvSpeed}}Kbps</td>
          </tr>
        </table>
      </div>
      <div class="right">
        <ul>
          <li>名称</li>
          <li>是否可用</li>
          <li>是否连接</li>
          <li>MAC地址</li>
          <li>IPv4地址</li>
          <li>IPv4掩码</li>
        </ul>
        <ul>
          <li>{{this.static.netIFName}}</li>
          <li>{{this.static.netIFAvailable}}</li>
          <li>{{this.data.netIFIsCableUp}}</li>
          <li>{{this.static.netIFMACAddress}}</li>
          <li>{{this.static.netIFIPv4addr}}</li>
          <li>{{this.static.netIFIPv4Masks}}</li>
        </ul>
      </div>
      <div class="right2">
        <ul>
          <li>接收字节数量</li>
          <li>发送字节数量</li>
          <li>接收包数量</li>
          <li>发送包数量</li>
          <li>接收出错包数量</li>
          <li>发送出错包数量</li>
          <li>丢包数量</li>
          <li>冲突包数量</li>
        </ul>
        <ul>
          <li>{{this.data.netIFBytesRecv}}</li>
          <li>{{this.data.netIFBytesSent}}</li>
          <li>{{this.data.netIFPacketsRecv}}</li>
          <li>{{this.data.netIFPacketsSent}}</li>
          <li>{{this.data.netIFOutErrors}}</li>
          <li>{{this.data.netIFInErrors}}</li>
          <li>{{this.data.netIFInDrops}}</li>
          <li>{{this.data.netBytesSentSpeed}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getBackbone, getSBackbone } from "../../services/working";

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
      netBytesRecvSpeed: [],
    };
  },
  methods: {
    getData() {
      getBackbone("test-2").then((res) => {
        this.data = res;
        this.netBytesRecvSpeed.length = 60;
        this.netBytesRecvSpeed.shift();
        this.netBytesRecvSpeed.push(res.netBytesRecvSpeed);
        this.$nextTick(function () {
        this.drawLine("myChart2");
        });
      });
    },
    getStatic() {
      getSBackbone("test-2").then((res) => {
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
          name: "Kbps",
          min: [0],
          // max: [40],
          //   gridIndex:[0,20,40,60,80,100],
          splitLine: {
            show: false, //是否显示分隔线。默认数值轴显示，类目轴不显示。
          },
          // nameGap: 15, // 坐标轴名称与轴线之间的距离。
          //   axisTick: {
          //     inside: true,
          //   },
        },
        title: {
          text: "吞吐量",
        },
        series: [
          {
            type: "line", //线条
            name: "吞吐量", //系列名称，用于tooltip的显示
            data: this.netBytesRecvSpeed,
            // symbol: "circle", //标记的类型：圆圈
            // itemStyle: {
            //   normal: {
            //     shadowBlur: 50, //文字块的背景阴影长度。
            //   },
            // },
          },
        ],
      };
      this.myChart.setOption(option);
      this.myChart.setOption({
        series: [
          {
            name: "吞吐量",
            data: this.netBytesRecvSpeed,
          },
        ],
      });
    },
  },
  // watch: {
  //   netBytesRecvSpeed: {
  //     handler(newVal, oldVal) {
  //       // console.log(newVal, oldVal,1)
  //       if (this.myChart) {
  //         if (this.newVal) {
  //         } else {
  //           // this.myChart.setOption(oldVal);
  //         }
  //       } else {
  //         this.drawLine("myChart2");
  //       }
  //     },
  //     deep: true,
  //   },
  // },
};
</script>

<style scoped>
#myChart2 {
  border: solid 1px rgb(104, 178, 202);
}
.bottom {
  display: flex;
  margin-top: 20px;
}
.left {
  width: 100px;
}
.right {
  display: flex;
  margin-left: 70px;
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
table:nth-child(1) {
  border-left: dashed 2px #dc6931;
  margin-bottom: 10px;
}
table:nth-child(2) {
  border-left: solid 2px #b4440d;
}
</style>
