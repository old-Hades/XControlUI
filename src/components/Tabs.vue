<template>
  <div class="box" @mousedown="move">
    <!-- <a-affix :offset-top="top"> -->
    <div class="tab">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="信息">
          <span v-for="item in tabColor" :key="item.id" class="tabColor">
            <a-tag :color="item.color">
              {{ item.configName }}
            </a-tag>
          </span>
          <div>
            <i>Total：{{ total }}</i>
            <i>Error：3</i>
            <i>Stop：4</i>
            <i>offline：5</i>
            <a-input-search placeholder="input search text" enter-button style="width:150px" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="背景" force-render>
          <div class="bgs">
            <!-- <p>
              <i>背景颜色</i>
            </p> -->
            <p>
              <i>背景图片：</i>
              <i>
                显示方式：
                <a-radio-group v-model="value" @change="onChange">
                  <a-radio :style="radioStyle" value="stretch">
                    拉伸
                  </a-radio>
                  <a-radio :style="radioStyle" value="center">
                    居中
                  </a-radio>
                  <a-radio :style="radioStyle" value="tile">
                    平铺
                  </a-radio>
                </a-radio-group>
              </i>
              <i>
                <a-checkbox>
                  隐藏
                </a-checkbox>
              </i>
            </p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="图层">
          <div class="ceng">
            <p>
              背景层
              <a-checkbox @change="onCheckoutChange"> </a-checkbox>
            </p>
            <p>
              FFU层
              <a-checkbox @change="onCheckoutChange"> </a-checkbox>
            </p>
            <p>
              前景层
              <a-checkbox @change="onCheckoutChange"> </a-checkbox>
            </p>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- </a-affix> -->
  </div>
</template>
<script>
import { getColorStrategy } from '../services/system.js'
export default {
  data() {
    return {
      value: 'center',
      radioStyle: {
        display: 'block',
      },
      top: 10,
      tabColor: null,
      total: 0,
    }
  },
  created() {
    this.tabsColor()
  },
  methods: {
    async tabsColor() {
      const data = await getColorStrategy()
      console.log(data)
      if (data.msgCode === 0) {
        this.tabColor = data.data
        this.total = data.total
      } else {
        this.$message.error('发生错误，未获取到操作面板数据')
      }
    },
    onCheckoutChange(e) {
      console.log(`checked = ${e.target.checked}`);
    },
    callback(key) {
      console.log(key)
    },
    onChange(e) {
      console.log('radio checked', e.target.value)
    },
    move(e) {
      let odiv = null
      if (e.path === undefined) {
        odiv = e.composedPath()[6]
      } else {
        odiv = e.path[6]
      }
      //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft
      let disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        //控制不能移出边界
        if (left < 0) {
          left = 0
        } else if (left > document.documentElement.clientWidth - odiv.offsetWidth) {
          left = document.documentElement.clientWidth - odiv.offsetWidth
        }

        if (top < 0) {
          top = 0
        } else if (top > document.documentElement.clientHeight - odiv.offsetHeight) {
          top = document.documentElement.clientHeight - odiv.offsetHeight
        }

        //移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
  },
}
</script>

<style scoped>
.box {
  position: absolute;
  top: 10px;
  left: 215px;
  width: 500px;
  height: 160px;
}
.tab {
  position: relative;
  top: 0;
  /* left: 207px; */
  left: 0;
  border: solid 1px;
  width: 500px;
  height: 160px;
  background: rgb(247, 247, 241);
  /* overflow-y: auto; */
  z-index: 1;
}

.co {
  border: solid 1px;
  width: 70px;
  height: 30px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  margin: 15px 6px;
}
.tab i {
  font-style: normal;
  margin: 12px;
  line-height: 10px;
  display: inline-block;
}
.tab p,
.tab p i {
  margin: 0;
  padding: 0 10px;
}

.ceng p {
  margin: 7px;
}

.tabColor {
  display: inline-block;
  /* width: 50px; */
  height: 30px;
  text-align: center;
  line-height: 30px;
  /* margin-right: 10px; */
}
</style>
