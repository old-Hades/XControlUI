//import Konva from '../konva/konva.min'
import Konva from '../konva/konva'
import { HashMap } from '../HashMap.js'

//定义全局变量
//var picWidth = window.innerWidth;   //画面尺寸，从后台获取，默认为屏幕尺寸
//var picHeight = window.innerHeight;
//var picRealWidth = picWidth;        //画面的实际有效区域，根据CAD宽高比例调整得来
//var picRealHeight = picHeight;
//var cadWidth = 302.899809;    //test
//var cadHeight = 194.192308;   //test
//var stage;  // Konva.Stage
//var backgroundLayer; // Konva.Layer背景图层 用于绘制背景
//var foregroundLayer;// Konva.Layer 前景图层，用于画热力图
//var ffuLayer;// Konva.Layer FFU图层，此图层上有事件处理

//1.从后台获取画面尺寸及背景信息
// 1.1 画面尺寸信息由用户导画面时输入(picWidth,picHeight),如果用户没有输入则用(window.innerWidth,window.innerHeight),前端以此作为画面的背景尺寸
// 1.2 背景信息包括:背景颜色、背景图片、填充方式（平铺、居中，拉绅）、透明度（0，1）
//test 各种尺寸的计算关系如下，由后台计算
//picWidth = 800;
//picHeight = 600;
//302.899809 194.192308
//var cadWidth = 302.899809;
//var cadHeight = 194.192308;
//picRealWidth = picHeight * (cadWidth / cadHeight);
//picRealWidth = Math.min(picRealWidth, picWidth);
//picRealHeight = picWidth * (cadHeight / cadWidth);
//picRealHeight = Math.min(picRealHeight, picHeight);

function XControl2D(stage) {
  this.stage = stage
  //创建图层
  this.backgroundLayer = new Konva.Layer({ listening: false }) //背景图层
  this.backgroundLayer.addName('backgroundLayer')
  this.stage.add(this.backgroundLayer)
  this.ffuLayer = new Konva.Layer() //FFU图层
  this.ffuLayer.addName('ffuLayer')
  this.stage.add(this.ffuLayer)
  this.foregroundLayer = new Konva.Layer({ listening: false }) //前景图层，展示风机的热力渲染图
  this.foregroundLayer.addName('foregroundLayer')
  this.foregroundLayer.visible(false)
  this.stage.add(this.foregroundLayer)
  this.tooltipLayer  = new Konva.Layer({ listening: false}); //显示一些提示信息
  this.tooltipLayer.addName('tooltipLayer');
  this.stage.add(this.tooltipLayer );
  //创建背景
  this.backgroundFillColorRect = new Konva.Rect({
    x: -this.stage.width() / 2,
    y: this.stage.height() / 2,
    scaleY: -1,
    width: this.stage.width(),
    height: this.stage.height(),
    //fill: 'red',
    //stroke: 'green',
    //strokeWidth: 1,
    listening: false,
  })
  this.backgroundFillColorRect.addName('backgroundFillColorRect')
  this.backgroundLayer.add(this.backgroundFillColorRect)
  //Optimizing Strokes Performance 优化性能
  this.backgroundFillColorRect.hitStrokeWidth(0)
  this.backgroundFillColorRect.shadowForStrokeEnabled(false)
  this.backgroundFillImageRect = new Konva.Rect({
    x: -this.stage.width() / 2,
    y: this.stage.height() / 2,
    scaleY: -1,
    width: this.stage.width(),
    height: this.stage.height(),
    //fill: 'red',
    stroke: 'green',
    strokeWidth: 1,
    listening: false,
  })
  this.backgroundFillImageRect.addName('backgroundFillImageRect')
  this.backgroundLayer.add(this.backgroundFillImageRect)
  //Optimizing Strokes Performance 优化性能
  this.backgroundFillImageRect.hitStrokeWidth(0)
  this.backgroundFillImageRect.shadowForStrokeEnabled(false)

  this.backgroundLayer.batchDraw()

  //创建风机提示信息框
  this.ffuTooltipLabel = new Konva.Label({
    opacity: 0.75,
    scaleY: -1,
    visible: false,
    listening: false,
  });

  this.ffuTooltipLabel.add(
      new Konva.Tag({
        fill: 'black',
        pointerDirection: 'up',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
      })
  );

  this.ffuTooltipLabel.add(
      new Konva.Text({
        text: '',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      })
  );

  this.tooltipLayer.add(this.ffuTooltipLabel);


  //test
  /*var ffu1 = new Konva.FFURect({
         strokeScaleEnabled: false,
         x: 0,
         y: 0,
         width: 50,
         height: 50,
         stroke: 'red',
         strokeWidth: 0.6,
         fill: '#FFD2FF',
         draggable: true,
         scaleY: -1,
     });
  ffu1.bIsSelected(true);
  console.log(':' + ffu1.bIsSelected())
     this.ffuLayer.add(ffu1);
     ffu1.draw();

     //每个FFU对应一个热力图上的热点
  var mapPoint1 = new Konva.HeatMapPoint({
      x: 0,
      y: 0,
      //width: 50,
      //height: 50,
      //fill: '#000000',
      //stroke: 'black',
      //strokeWidth: 1,
      radius: 50,
      currCount: 1000 * Math.random(),
      minCount: 1,
      maxCount: 1000
  });
  this.foregroundLayer.add(mapPoint1);

  //ffu1.setAttr('heatMapPoint', mapPoint1);
  ffu1.heatMapPoint(mapPoint1);

  ffu1.heatMapPoint().radius(100);*/

  // 设置背景,参数 fillColor(填充颜色，字符串，形如：'green'/'#00ff00'/'rgb(0,255,0)'/'rgba(0,255,0,0.5)',空为fill(null)),
  // fillImagePath(填充图片'../assets/image/default_img.jpg'),
  // fillPattern(1:平铺；2：拉绅；3：居中，默认为3), opacity(透明度为0到1之间的值)
  /*this.backgroundImageObj = new Image()
  this.onLoadBackgroundImageObj = function(backgroundRect) {
    if (this.backgroundImageObj.fileSize > 0 || (this.backgroundImageObj.width > 0 && this.backgroundImageObj.height > 0)) {
      backgroundRect.fillPatternImage(this.backgroundImageObj)
    }
    backgroundRect.draw()
  }

  this.setBackgroundImage = function (imageObj) {
    this.backgroundFillImageRect.fillPatternImage(imageObj);
    this.backgroundFillImageRect.draw();
  }
  this.backgroundImageObj.onload = this.onLoadBackgroundImageObj(this.backgroundFillImageRect)*/
  var bgFillColor = ''
  var bgFillPattern = 3
  var bgOpacity = 1
  var bgImageObj = null
  this.setBackgroundImage = function (imageObj) {
    this.bgImageObj = imageObj;
    this.updateBackground();
  }
  this.updateBackground = function () {
    this.backgroundFillImageRect.opacity(this.bgOpacity)
    if (typeof this.bgFillColor == null || this.bgFillColor == '' || this.bgFillColor == 'undefined') {
      this.backgroundFillColorRect.fill(null)
    } else {
      this.backgroundFillColorRect.fill(this.bgFillColor)
    }

    if (this.bgFillPattern == 1) {
      this.backgroundFillImageRect.fillPatternRepeat('repeat')
    } else {
      this.backgroundFillImageRect.fillPatternRepeat('no-repeat')
    }

    if (typeof this.bgImageObj == null || this.bgImageObj == null || this.bgImageObj == '' || this.bgImageObj == 'undefined') {
      this.backgroundFillImageRect.fillPatternImage(null)
    } else {
      this.backgroundFillImageRect.fillPatternImage(this.bgImageObj);

      //if (this.onLoadBackgroundImageObj.complete) {
      if (this.bgImageObj.width != 0) {
        if (this.bgFillPattern == 3) {
          this.backgroundFillImageRect.fillPatternScale({
            x: 1,
            y: 1,
          })
          this.backgroundFillImageRect.fillPatternX(this.stage.width() / 2 - this.bgImageObj.width / 2)
          this.backgroundFillImageRect.fillPatternY(this.stage.height() / 2 - this.bgImageObj.height / 2)
        }
        if (this.bgFillPattern == 2) {
          this.backgroundFillImageRect.fillPatternScale({
            x: this.stage.width() / this.bgImageObj.width,
            y: this.stage.height() / this.bgImageObj.height,
          })
          this.backgroundFillImageRect.fillPatternX(0)
          this.backgroundFillImageRect.fillPatternY(0)
        }
      }
    }

    this.backgroundLayer.batchDraw()
  }
  this.setBackground = function(fillColor, fillPattern = 3, opacity = 1) {
    this.bgFillColor = fillColor;
    this.bgFillPattern = fillPattern;
    this.bgOpacity = opacity;

    this.updateBackground();
  }

  this.setStageSize = function (w, h) {
    this.stage.setWidth(w)
    this.stage.setHeight(h)

    this.stage.offsetX(-w / 2);
    this.stage.offsetY(h / 2);

    this.stage.batchDraw();
  }

  //画path 支持SVG的path格式，形如 "M 193.53375444774176 160.7019230977872 A 28.34532480871194 9.220734160273993 152.74503357858202 1  1 193.53375444774176 160.7019230977872"
  //参数 strokeColor,strokeWidth,pathData,strokeScaleEnabled
  this.drawPath = function(pathData, strokeColor, strokeWidth = 0.1, strokeScaleEnabled = false) {
    var path = new Konva.Path({
      strokeScaleEnabled: strokeScaleEnabled,
      strokeWidth: strokeWidth,
      data: pathData,
      hitStrokeWidth: 0,
      shadowForStrokeEnabled: false,
      //scaleY: -1,
    })
    if (typeof strokeColor == null || strokeColor == '' || strokeColor == 'undefined') {
      path.stroke('white')
    } else {
      path.stroke(strokeColor)
    }
    //Optimizing Strokes Performance 优化性能
    //this.backgroundFillImageRect.hitStrokeWidth(0);
    //this.backgroundFillImageRect.shadowForStrokeEnabled(false);
    this.backgroundLayer.add(path)
    path.draw()
  }

  this.drawPolyLine = function(pathData, strokeColor, strokeWidth = 0.1, strokeScaleEnabled = false) {
    this.drawPath(pathData, strokeColor, strokeWidth, strokeScaleEnabled)
  }

  this.drawCircle = function(posX, posY, radius, strokeColor, strokeWidth = 0.1, strokeScaleEnabled = false, fillColor = null) {
    var circle = new Konva.Circle({
      strokeScaleEnabled: strokeScaleEnabled,
      strokeWidth: strokeWidth,
      //data: pathData,
      hitStrokeWidth: 0,
      shadowForStrokeEnabled: false,
      x: posX,
      y: posY,
      radius: radius,
    })
    if (typeof strokeColor == null || strokeColor == '' || strokeColor == 'undefined') {
      circle.stroke('white')
    } else {
      circle.stroke(strokeColor)
    }

    if (typeof fillColor == null || fillColor == '' || fillColor == 'undefined') {
      circle.fill(null)
    } else {
      circle.fill(fillColor)
    }
    //Optimizing Strokes Performance 优化性能
    //this.backgroundFillImageRect.hitStrokeWidth(0);
    //this.backgroundFillImageRect.shadowForStrokeEnabled(false);
    this.backgroundLayer.add(circle)
    circle.draw()
  }

  //画SimpleLine ，形如 pointsData: [5, 70, 140, 23, 250, 60, 300, 20]
  //参数 strokeColor,strokeWidth,pathData,strokeScaleEnabled
  this.drawSimpleLine = function(pointsData, strokeColor, strokeWidth = 0.1, strokeScaleEnabled = false) {
    var line = new Konva.Line({
      points: pointsData, //[5, 70, 140, 23, 250, 60, 300, 20]
      strokeScaleEnabled: strokeScaleEnabled,
      strokeWidth: strokeWidth,
      hitStrokeWidth: 0,
      shadowForStrokeEnabled: false,
    })
    if (typeof strokeColor == null || strokeColor == '' || strokeColor == 'undefined') {
      line.stroke('white')
    } else {
      line.stroke(strokeColor)
    }

    this.backgroundLayer.add(line)
    line.draw()
  }

  //画文字
  //参数
  this.drawSimpleText = function(text, posX, posY, fontSize, color, fontFamily = 'LongSong') {
    var simpleText = new Konva.Text({
      strokeScaleEnabled: false,
      x: posX,
      y: posY + fontSize,
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: color,
      scaleY: -1,
      verticalAlign: 'top',
      //align: 'center'
    })
    this.backgroundLayer.add(simpleText)
    simpleText.draw()
  }

  //画FFU
  //参数
  // 创建 临时canvas
  this.heatMapPalatteCanvas = document.createElement('canvas')
  this.heatMapPalatteCanvas.width = 256
  this.heatMapPalatteCanvas.height = 1
  var heatMapPalatteImageData = this.heatMapPalatteCanvas.getContext('2d').getImageData(0, 0, 256, 1).data
  this.createHeatMapPalette = function(color0 = '#0ff', color02 = '#0f0', color04 = '#ff0', color1 = '#f00') {
    let colorStops = {
      0: color0,
      0.2: color02,
      0.4: color04,
      1: color1,
    }
    let ctx = this.heatMapPalatteCanvas.getContext('2d')
    // 创建线性渐变色
    let linearGradient = ctx.createLinearGradient(0, 0, 256, 1)
    for (const key in colorStops) {
      linearGradient.addColorStop(key, colorStops[key])
    }

    // 绘制渐变色条
    ctx.fillStyle = linearGradient
    ctx.fillRect(0, 0, 256, 1)

    // 读取像素值
    heatMapPalatteImageData = ctx.getImageData(0, 0, 256, 1).data
  }

  function heatMapPalattePickColor(position) {
    return heatMapPalatteImageData.slice(position * 4, position * 4 + 3)
  }

  // lets define a custom filter:
  this.heatMapFilter = function(imageData) {
    // make all pixels opaque 100%
    var nPixels = imageData.data.length
    for (var i = 3; i < nPixels; i += 4) {
      let alpha = imageData.data[i]
      let color = heatMapPalattePickColor(alpha)
      imageData.data[i - 3] = color[0]
      imageData.data[i - 2] = color[1]
      imageData.data[i - 1] = color[2]
    }
  }
  //this.drawFFU = function(posX, posY, width = 30, height = 30) {
  this.drawFFU = function(ffuDataObj) {
    var ffu = new Konva.FFURect({
      strokeScaleEnabled: false,
      x: ffuDataObj.centerX,//posX,
      y: ffuDataObj.centerY,//posY,
      width: ffuDataObj.width,//width,
      height: ffuDataObj.height,//height,
      stroke: 'red',
      strokeWidth: 0.6,
      fill: '#00D2FF',
      draggable: true,
      scaleY: -1,
    })

    //ffu.bgColor(this.bgFillColor);
    ffu.ffuId(ffuDataObj.id);
    //ffu.aliasName(ffuDataObj.aliasName);
    ffu.ffuGroupId(ffuDataObj.ffuGroupId);
    var strs = new Array(); //定义一数组
    strs = ffuDataObj.aliasName.split("/"); //字符分割
    if (strs.length > 0) {
      ffu.ffuZoneName(strs[0]);
    }
    if (strs.length > 1) {
      ffu.ffuGroupName(strs[1]);
    }
    if (strs.length > 2) {
      ffu.ffuName(strs[2]);
    }
    ffu.ffuDeviceModel(ffuDataObj.deviceModel);
    ffu.ffuAddress(ffuDataObj.deviceAddress);
    ffu.groupAddress(ffuDataObj.groupAddress);
    //ffu.ffuSpeed(ffuDataObj.);
    //ffu.ffuState(ffuDataObj.);
    ffu.fill(ffuDataObj.textColor)

    this.ffuLayer.add(ffu)
    ffu.draw()

    //test 把ffu的地址画出来
    var simpleText1 = new Konva.Text({
      strokeScaleEnabled: false,
      x: ffuDataObj.centerX - ffuDataObj.width / 10,//posX,
      y: ffuDataObj.centerY - ffuDataObj.height / 10,//posY,
      text: ffu.ffuAddress(),
      fill: ffuDataObj.textColor,
      fontSize: ffuDataObj.height / 5,
      scaleY: -1,
      verticalAlign: 'top',
      //align: 'center'
    })
    this.backgroundLayer.add(simpleText1)
    simpleText1.draw()

    //每个FFU对应一个热力图上的热点
    var mapPoint = new Konva.HeatMapPoint({
      x: ffuDataObj.centerX,//posX,
      y: ffuDataObj.centerY,//posY,
      radius: 10, //width,
      currCount: 1000 * Math.random(),
      minCount: 1,
      maxCount: 1000,
    })
    this.foregroundLayer.add(mapPoint)

    //建立一对一的映射关系
    ffu.heatMapPoint(mapPoint) //ffu.heatMapPoint().radius(100);
    mapPoint.ffuRect(ffu)
  }

  this.heatMapVisible = function(bVisible) {
    if (bVisible) {
      this.foregroundLayer.visible(true)
      if (this.foregroundLayer.hasChildren() > 0) {
        this.foregroundLayer.cache() //必须要cache
      }
      this.foregroundLayer.filters([this.heatMapFilter])

      this.foregroundLayer.batchDraw()
    } else {
      this.foregroundLayer.visible(false)
    }
  }

  this.backgroundFillColorVisible = function(bVisible) {
    if (bVisible) {
      this.backgroundFillColorRect.visible(true)
      this.backgroundFillColorRect.batchDraw()
    } else {
      this.backgroundFillColorRect.visible(false)
    }
  }

  this.backgroundFillImageVisible = function(bVisible) {
    if (bVisible) {
      this.backgroundFillImageRect.visible(true)
      this.backgroundFillImageRect.batchDraw()
    } else {
      this.backgroundFillImageRect.visible(false)
    }
  }

  this.backgroundLayerVisible = function(bVisible) {
    if (bVisible) {
      this.backgroundLayer.visible(true)
      this.backgroundLayer.batchDraw()
    } else {
      this.backgroundLayer.visible(false)
    }
  }

  this.ffuLayerVisible = function(bVisible) {
    if (bVisible) {
      this.ffuLayer.visible(true)
      this.ffuLayer.batchDraw()
    } else {
      this.ffuLayer.visible(false)
    }
  }

  //信息提示气泡
  /*this.tooltipLabel = new Konva.Label({
         opacity: 0.75,
         visible: true,//false,
         listening: false,
         scaleY: -1,
         verticalAlign: 'top'
     });
     this.tooltipLabel.add(
         new Konva.Tag({
             fill: 'black',
             pointerDirection: 'down',
             pointerWidth: 10,
             pointerHeight: 10,
             lineJoin: 'round',
             shadowColor: 'black',
             shadowBlur: 10,
             shadowOffsetX: 10,
             shadowOffsetY: 10,
             shadowOpacity: 0.2,
         })
     );
     this.tooltipLabel.add(
         new Konva.Text({
             text: 'a d adfa',
             fontFamily: 'Calibri',
             fontSize: 18,
             padding: 5,
             fill: 'white',

         })
     );
     this.tooltipLayer.add(this.tooltipLabel);

     this.tooltipLabelTween = new Konva.Tween({
         // list of tween specific properties
         node: this.tooltipLabel,
         duration: 1,
         easing: Konva.Easings.EaseInOut,
         //onUpdate: () => console.log('node attrs updated')
         onFinish: () => {
             console.log(this.tooltipLabel);
             //this.tooltipLabel.visible = true;
             //this.tooltipLabel.opacity = 1;
             console.log('node attrs updated');
             this.tooltipLayer.batchDraw();
         },
         // set new values for any attributes of a passed node
         opacity: 0
     });

     //this.tooltipLabelTween.play();
     this.tooltipLayer.draw();
     //this.tooltipLabelTimer = setTimeout(this.tooltipLabelTween.play(), 1000);

     this.showMessage = function (msg, timeOut = 2000) {
         var mousePos = this.stage.getPointerPosition();
         this.tooltipLabel.position({
             x: mousePos.x,
             y: mousePos.y - 5,
         });
         this.tooltipLabel
             .getText()
             .text(msg);
         this.tooltipLabel.show();
         this.tooltipLayer.batchDraw();
     }*/

  //实现鼠标滚轮缩放
  var scaleBy = 1.1 //1.01;
  var maxScaleBy = 1000
  var minScaleBy = 0.1
  var currScaleX = 1;
  var currScaleY = 1;
  this.stage.on('wheel', (e) => {
    e.evt.preventDefault()
    var oldScaleX = this.stage.scaleX()
    var oldScaleY = this.stage.scaleY()

    var pointer = this.stage.getPointerPosition()

    var mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScaleX, //oldScale,
      y: (pointer.y - this.stage.y()) / oldScaleY, //oldScale,
    }

    var newScaleX
    var newScaleY
    if (e.evt.deltaY > 0) {
      newScaleX = oldScaleX / scaleBy
      newScaleY = oldScaleY / scaleBy
    } else {
      newScaleX = oldScaleX * scaleBy
      newScaleY = oldScaleY * scaleBy
    }

    if ((newScaleX < maxScaleBy && newScaleX > oldScaleX) || (newScaleX > minScaleBy && newScaleX < oldScaleX)) {
      this.stage.scale({ x: newScaleX, y: newScaleY })

      //提示信息不缩放
      this.ffuTooltipLabel.scale({ x: 1 / newScaleX, y: 1 / newScaleY})
      //this.ffuTooltipLabel.scaleX(1 / currScaleX)
      //this.ffuTooltipLabel.scaleY(1 / currScaleY)

      currScaleX = newScaleX;
      currScaleY = newScaleY;

      var newPos = {
        x: pointer.x - mousePointTo.x * newScaleX,
        y: pointer.y - mousePointTo.y * newScaleY,
      }
      this.stage.position(newPos)

      this.stage.batchDraw()
      //如果背景太多，缩放卡的话，改用Cache
      //this.backgroundLayer.clearCache();
      //this.backgroundLayer.batchDraw();
    } else {
      if (oldScaleX >= maxScaleBy) {
        //已经放到最大
        //this.showMessage('已经放到最大');
      } else {
        //已经放到最小
        //this.showMessage('已经放到最小');
      }
    }
  });

  //实现右键菜单
  window.addEventListener('click', () => {
    // hide menu
    ffuContextMeunNode.style.display = 'none';
  });
  var ffuContextMeunNode = document.getElementById('contextMenuFFU');
  var currentFFURect = null;
  var currentFFUId = 0;
  this.getCurrentFFUId = function () {
    return currentFFUId;
  }
  this.getCurrentFFURect = function () {
    return currentFFURect;
  }
  this.stage.on('contextmenu', (e) => {//function (e) {
    // prevent default behavior
    e.evt.preventDefault();
    if (e.target === this.stage) {
      // if we are on empty place of the stage we will do nothing
      return;
    }

    if (e.target instanceof Konva.FFURect) {
      currentFFURect = e.target;
      currentFFUId = currentFFURect.ffuId();
      // show menu
      ffuContextMeunNode.style.display = 'initial';
      //var containerRect = this.stage.container().getBoundingClientRect();
      var containerRect = this.stage.content.getBoundingClientRect();
      ffuContextMeunNode.style.top =
          containerRect.top + this.stage.getPointerPosition().y + 4 + 'px';
      ffuContextMeunNode.style.left =
          containerRect.left + this.stage.getPointerPosition().x + 4 + 'px';
    }
  });

  //选择FFU
  var selectedFFUHashMap = new HashMap();
  var selectedFFUGroupId = 0;
  var selectedFFUZoneName = '';
  this.getSelectedFFUIds = function () {
    return selectedFFUHashMap.keySet();
  }
  this.getSelectedFFUGroupId = function () {
    return selectedFFUGroupId;
  }
  this.getSelectedFFUZoneName = function () {
    return selectedFFUZoneName;
  }
  this.selectGroupFFU = function () {
    selectedFFUGroupId = 0;
    selectedFFUZoneName = '';
    selectedFFUHashMap.values().forEach(function (ele) {
      ele.bIsSelected(false)
      ele.draw()
    })
    selectedFFUHashMap.clear();
    if ((currentFFURect != null) && (currentFFURect.ffuGroupId() > 0)){
      selectedFFUGroupId = currentFFURect.ffuGroupId();
      var selectedFFUNodes = this.ffuLayer.find(node => {
        return (node instanceof Konva.FFURect) && node.ffuGroupId() == currentFFURect.ffuGroupId()
      });

      selectedFFUNodes.each(function (shape) {
        shape.bIsSelected(true)
        selectedFFUHashMap.put(shape.ffuId(), shape)
        shape.draw()
      })
    }

    this.ffuLayer.batchDraw();
  }
  this.selectZoneFFU = function () {
    selectedFFUGroupId = 0;
    selectedFFUZoneName = '';
    selectedFFUHashMap.values().forEach(function (ele) {
      ele.bIsSelected(false)
      ele.draw()
    })
    selectedFFUHashMap.clear();
    if ((currentFFURect != null) && (currentFFURect.ffuZoneName() != '')) {
      selectedFFUZoneName = currentFFURect.ffuZoneName();
      var selectedFFUNodes = this.ffuLayer.find(node => {
        return (node instanceof Konva.FFURect) && node.ffuZoneName() == currentFFURect.ffuZoneName()
      });

      selectedFFUNodes.each(function (shape) {
        shape.bIsSelected(true)
        selectedFFUHashMap.put(shape.ffuId(), shape)
        shape.draw()
      })
    }

    this.ffuLayer.batchDraw();
  }
  this.stage.on('click', (e) => {
    // prevent default behavior
    e.evt.preventDefault();
    if (e.target === this.stage) {
      // if we are on empty place of the stage we will do nothing
      return;
    }

    if (e.target instanceof Konva.FFURect) {
      var currFFURect = e.target
      if ((e.evt.button == 2) && (currFFURect.bIsSelected())) {//0:左键；2：右键；1：中键
        //右键按下，响应右键菜单
      } else {
        selectedFFUGroupId = 0;
        selectedFFUZoneName = '';
        if ((e.evt.shiftKey) || (e.evt.ctrlKey))  {
          if (currFFURect.bIsSelected()) {
            currFFURect.bIsSelected(false)
            selectedFFUHashMap.remove(currFFURect.ffuId())
          } else {
            currFFURect.bIsSelected(true)
            selectedFFUHashMap.put(currFFURect.ffuId(), currFFURect)
          }
        } else {
          selectedFFUHashMap.values().forEach(function (ele) {
            ele.bIsSelected(false)
            ele.draw()
          })
          selectedFFUHashMap.clear();

          currFFURect.bIsSelected(true)
          selectedFFUHashMap.put(currFFURect.ffuId(), currFFURect)
        }
        currFFURect.draw()
        this.ffuLayer.batchDraw();
      }
    }
  });

  this.stage.on('mouseover mousemove dragmove', (e) => {
    // prevent default behavior
    e.evt.preventDefault();
    if (e.target === this.stage) {
      // if we are on empty place of the stage we will do nothing
      //return;
    }

    if (e.target instanceof Konva.FFURect) {
      var currFFURect = e.target

      var mousePos = this.stage.getPointerPosition();

      if (currScaleY == 1) {
        this.ffuTooltipLabel.position({
          x: (mousePos.x - this.stage.x()) / currScaleX - this.stage.width() / 2,
          y: -(mousePos.y - this.stage.y()) / currScaleY + this.stage.height() / 2,
        });
      } else {
        this.ffuTooltipLabel.position({
          x: (mousePos.x - this.stage.x()) / currScaleX - this.stage.width() / 2,
          y: (mousePos.y - this.stage.y()) / currScaleY + this.stage.height() / 2,
        });
      }

      //this.ffuTooltipLabel.scaleX(1 / currScaleX)
      //this.ffuTooltipLabel.scaleY(1 / currScaleY)
      this.ffuTooltipLabel.getText().text(
          'Name:  \t\t' + currFFURect.ffuName() + '\n' +
          'Addr:  \t\t' + currFFURect.ffuAddress() + '\n' +
          'Group: \t\t' + currFFURect.ffuGroupName() + '\n' +
          'Zone:  \t\t' + currFFURect.ffuZoneName() + '\n' +
          'State: \t\t' + currFFURect.ffuState() + '\n' +
          'Speed: \t\t' + currFFURect.ffuSpeed() + 'rpm' )

      this.ffuTooltipLabel.show();
      this.tooltipLayer.batchDraw();

    }
  });

  this.stage.on('mouseout', (e) => {
    // prevent default behavior
    e.evt.preventDefault();
    if (e.target === this.stage) {
      // if we are on empty place of the stage we will do nothing
      //return;
    }
    this.ffuTooltipLabel.hide();
    this.tooltipLayer.draw();//.batchDraw();
  });

  /*this.stage.on('dblclick dbltap', function () {
    // add a new shape
    var newShape = new Konva.Circle({
      x: stage.getPointerPosition().x,
      y: stage.getPointerPosition().y,
      radius: 10 + Math.random() * 30,
      fill: Konva.Util.getRandomColor(),
      shadowBlur: 10,
    });
    ffuLayer.add(newShape);
    ffuLayer.batchDraw();
  });*/

}
export {
  //很关键
  XControl2D,
}
