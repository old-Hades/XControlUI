<template>
  <div class="all">
    <!-- 上 -->
    <div class="top">
      <div class="left">
        <tabbar />
      </div>
      <div class="right"></div>
    </div>
    <!-- 中 -->
    <div
      id="container"
      align="center"
      style="overflow-x:auto;overflow-y:auto"
    ></div>

    <!-- 下 -->
    <div class="bottom">
      <report />
      <!-- 中右 -->
      <div class="right_content">
        <tree :id_order="id"/>
      </div>
    </div>

    <div id="contextMenuFFU">
      <div>
        <button id="btnFFUSetting" @click="showModal">FFU 设置信息</button>
        <button id="btnSelectGroup">FFU整组选定</button>
        <button id="btnSelectZone">FFU整区选定</button>
        <hr />
        <button id="btnSelectedFFUSetting" @click="showModalAll">
          控制被选FFU
        </button>
      </div>
    </div>
    <a-modal
      style="width:1080px"
      v-model="visible"
      title="设备信息"
      @ok="handleOk"
      :destroyOnClose="true"
    >
      <twoDimension :nodeId="nodeId" />
    </a-modal>
    <a-modal
      v-model="visibleAll"
      title="控制被选FFU"
      @ok="handleAll"
      :destroyOnClose="true"
    >
      <allDimension v-if="allId" :allId="allId" />
    </a-modal>
  </div>
</template>

<script>
//import chunk from "lodash-es/chunk";
import Konva from '../../js/konva/konva'
import { XControl2D } from '../../js/2d/XControl2D.js'
import twoDimension from './two_dimension'
import allDimension from './AllDimension'
import { cleanRoomDetail, getFFU, getDataMysql } from '../../services/Floor'
import Tabbar from './components/Tabbar'
import Tree from './components/tree'
import report from './components/report'
//定义全局变量
var stage // Konva.Stage

var xControl2D

export default {
  name: 'Floor',
  //1.必须要有，否则找不到div，且<template>标签中要有id="container"的div
  render: function(createElement) {
    return createElement('div', 'container')
  },
  props: {
    id_order: {
      type: [Number, String]
    }
  },
  data() {
    return {
      data: [],
      points: [],
      arr: [],
      endpoints: [],
      id: null,
      visible: false,
      nodeId: null,
      visibleAll: false,
      allId: null,
      flag: false,
      u: null
    }
  },
  watch: {
    id_order(soul) {
      this.id = soul
    }
  },
  components: {
    twoDimension,
    allDimension,
    Tabbar,
    Tree,
    report
  },
  created() {
    this.id = this.$route.params.id - 0
    console.log(this.id)
  },
  mounted() {
    // 2.从后台获取画面尺寸及背景信息
    // 2.1 画面尺寸信息由用户导画面时输入(picWidth,picHeight),如果用户没有输入则用(window.innerWidth,window.innerHeight),前端以此作为画面的背景尺寸
    // 2.2 背景信息包括:背景颜色、背景图片、填充方式（平铺、居中，拉绅）、透明度（0，1）

    var picWidth = 1585
    var picHeight = 564
    var bgColor = 'black'
    var bgFillPattern = 3
    var bgOpacity = 0.5
    var dxfFileName

    stage = new Konva.Stage({
      container: 'container',
      width: picWidth,
      height: picHeight,
      scaleX: 1,
      scaleY: -1, //将坐标调整为，原点在正中间的正交坐标系
      offsetX: -picWidth / 2,
      offsetY: picHeight / 2
    })

    //3.实例化XControl2D对象，由XControl2D初始化各参数
    xControl2D = new XControl2D(stage)

    //设置背景
    //xControl2D.setBackground("white", '..\..\assets\image\default_img', 3, 0.5);
    //xControl2D.setBackground('gred', null, 1, 0.5)
    //xControl2D.setBackground(bgColor, '', 1, 0.5)

    //画path

    xControl2D.createHeatMapPalette()

    this.getPicAttr()

    //xControl2D.heatMapVisible(true);

    //xControl2D.showForegroundLayer();

    document.getElementById('btnFFUSetting').addEventListener('click', () => {
      this.nodeId = xControl2D.getCurrentFFUId()
      console.log('btnFFUSetting id=' + this.nodeId)
    })

    document.getElementById('btnSelectGroup').addEventListener('click', () => {
      xControl2D.selectGroupFFU()
    })
    document.getElementById('btnSelectZone').addEventListener('click', () => {
      xControl2D.selectZoneFFU()
    })
    document
      .getElementById('btnSelectedFFUSetting')
      .addEventListener('click', () => {
        console.log(xControl2D.getSelectedFFUIds())
        // xControl2D.getSelectedFFUIds().forEach((e, i) => {
        //   this.allId.push(e[i])
        // })
        this.allId = xControl2D.getSelectedFFUIds()
        console.log(this.allId)

        console.log(
          'getSelectedFFUGroupId:' + xControl2D.getSelectedFFUGroupId()
        )
        console.log(
          'getSelectedFFUZoneName:' + xControl2D.getSelectedFFUZoneName()
        )
      })
  },

  methods: {
    getPicAttr() {
      cleanRoomDetail(this.id).then(res => {
        if (res.msgCode === 0) {
          //console.log(res)
          console.log('getPicAttr')
          this.data = res.data
          this.picWidth = this.data.bgWidth
          this.picHeight = this.data.bgHeight
          this.dxfFileName = this.data.name
          //stage.setWidth(this.picWidth)
          //stage.setHeight(this.picHeight)
          if (this.picWidth == null || this.picHeight == null) {
            alert('获取画面尺寸失败')
            xControl2D.setStageSize(1585, 564)
          } else {
            xControl2D.setStageSize(this.picWidth, this.picHeight)
          }
          this.bgColor = this.data.bgColor
          this.bgFillPattern = this.data.bgPictureMode
          this.bgOpacity = 0.5 //this.data.opacity;

          xControl2D.setBackground(
            this.bgColor,
            this.bgFillPattern,
            this.bgOpacity
          ) // 颜色，填充模式，透明度

          if (
            this.data.bgPicture != null &&
            this.data.bgPicture != 'undefined' &&
            this.data.bgPicture != ''
          ) {
            var imageObj = new Image()
            imageObj.onload = function() {
              xControl2D.setBackgroundImage(imageObj)
            }
            imageObj.src = 'data:image/png;base64,' + this.data.bgPicture
          }

          //画FFU
          this.getFFUs()
        } else {
          alert('获取画面信息失败')
        }
      })
    },

    getFFUs() {
      getFFU(this.dxfFileName).then(res => {
        if (res.msgCode === 0) {
          this.data = res.data //.data
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              //xControl2D.drawFFU(this.data[i].centerX, this.data[i].centerY, this.data[i].width, this.data[i].height) //, this.data[i].insertW, this.data[i].insertH);
              //console.log(this.data[i])
              xControl2D.drawFFU(this.data[i])
            }
          }
          this.getAllEntities()
        } else {
          this.$message.error('获取FFU信息失败')
        }
      })
    },

    getAllEntities() {
      getDataMysql({
        roomName: this.dxfFileName,
        isWorkSpace: 0
      }).then(res => {
        this.flag = true
        console.log(res)
        if (res.line) {
          //1.画线
          this.data = res.line
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              var pointsData = new Array()
              pointsData[0] = this.data[i].xfrom
              pointsData[1] = this.data[i].yfrom
              pointsData[2] = this.data[i].xto
              pointsData[3] = this.data[i].yto
              xControl2D.drawSimpleLine(
                pointsData,
                this.data[i].colorNum,
                this.data[i].lineWidth
              )
            }
          }

          //2.画Path
          this.data = res.lwpolyline
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              xControl2D.drawPolyLine(
                this.data[i].path,
                this.data[i].colorNum,
                this.data[i].lineWidth
              )
            }
          }

          //3.画text
          this.data = res.text
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              xControl2D.drawSimpleText(
                this.data[i].context,
                this.data[i].xfirst,
                this.data[i].yfirst,
                this.data[i].height,
                this.data[i].colorNum
              )
            }
          }

          //4.画arc
          this.data = res.arc
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              xControl2D.drawPath(
                this.data[i].path,
                this.data[i].colorNum,
                this.data[i].lineWidth
              )
            }
          }

          //5.画circle
          this.data = res.circle
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              xControl2D.drawCircle(
                this.data[i].centerX,
                this.data[i].centerY,
                this.data[i].radius,
                this.data[i].colorNum,
                this.data[i].lineWidth
              )
            }
          }

          //6.画ellipse
          this.data = res.ellipse
          if (this.data != null) {
            for (var i = 0; i < this.data.length; i++) {
              xControl2D.drawPath(
                this.data[i].path,
                this.data[i].colorNum,
                this.data[i].lineWidth
              )
            }
          }
        }
      })
    },
    showModal() {
      this.visible = true
    },
    showModalAll() {
      this.visibleAll = true
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    handleAll(e) {
      console.log(e)
      this.visibleAll = false
    }
  },
  destroyed() {
    console.log('销毁页面了')
  }
}
</script>

<style lang="less" scoped>
.all {
  background-color: #f7f7fa;
  height: 804px;
  width: 1536px;
}
#container {
  height: 450px;
  width: 1267.2px;
  padding-left: 10px;
  margin-top: 5px;
}
#contextMenuFFU {
  display: none;
  position: absolute;
  width: 160px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}

#contextMenuFFU button {
  width: 100%;
  background-color: white;
  border: none;
  margin: 0;
  padding: 10px;
}

#contextMenuFFU button:hover {
  background-color: lightgray;
}

/deep/.ant-modal {
  width: 1270px !important;
  .ant-modal-content {
    width: 1270px;
  }
}
.top {
  height: 135px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 15px;
  .left {
    padding-left: 10px;
    width: 1140px;
    height: 100%;
  }
  .right {
    width: 372.8px;
    height: 100%;
    background-color: #aaa;
    padding-right: 10px;
  }
}
.right_content {
  width: 224px;
  height: 450px;
  position: absolute;
  right: 45px;
  top: -465px;
}
.bottom {
  position: relative;
  width: 100%;
  height: 206px;
  margin-top: 5px;
}
</style>
