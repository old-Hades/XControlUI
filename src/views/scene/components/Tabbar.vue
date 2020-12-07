<template>
  <div class="tab">
    <a-tabs type="card" size="large" @change="callback">
      <a-tab-pane key="1" tab="信息">
        <div class="operation">
          <div class="total">
            <div class="t_o">
              <div class="tw">
                <img src="@/assets/floor/总数icon@2x.png" alt="" />
              </div>
              <div class="tw">
                <img src="@/assets/floor/在线率icon@2x.png" alt="" />
              </div>
            </div>
            <div class="t_o">
              <div class="tw">总数</div>
              <div class="tw">在线率</div>
            </div>
            <div class="t_o" v-if="total">
              <div class="tw font">
                {{ totalAll }}
              </div>
              <div class="tw font font_2">
                {{ (total.onlineRate * 100).toFixed(2) + '%' }}
              </div>
            </div>
          </div>
          <div class="state">
            <div class="status">
              <div class="condition">
                <img src="@/assets/floor/运行icon@2x.png" alt="" />
              </div>
              <div class="condition">运行</div>
              <div
                class="condition color"
                :style="'backgroundColor:' + runColor"
              >
                {{ total.runTotal }}
              </div>
            </div>
            <div class="status">
              <div class="condition">
                <img src="@/assets/floor/停机icon@2x.png" alt="" />
              </div>
              <div class="condition">停机</div>
              <div
                class="condition color"
                :style="'backgroundColor:' + stopColor"
              >
                {{ total.stopTotal }}
              </div>
            </div>
            <div class="status">
              <div class="condition">
                <img src="@/assets/floor/离线icon@2x.png" alt="" />
              </div>
              <div class="condition">离线</div>
              <div
                class="condition color"
                :style="'backgroundColor:' + offLinkColor"
              >
                {{ total.offlineTotal }}
              </div>
            </div>
            <div class="status">
              <div class="condition">
                <img src="@/assets/floor/故障icon@2x.png" alt="" />
              </div>
              <div class="condition">故障</div>
              <div
                class="condition color"
                :style="'backgroundColor:' + errColor"
              >
                {{ total.faultTotal }}
              </div>
            </div>
          </div>
        </div>
        <div class="right_color">
          <div class="color" v-for="(item, index) in scope" :key="index">
            <div
              class="color_top"
              :style="'backgroundColor:' + item.color"
            ></div>
            <div class="color_bottom">
              {{ item.configName }}
            </div>
          </div>
          <a-icon
            class="icon_length"
            v-if="scopeLength > 4 && flag === false"
            type="caret-right"
            @click="showLength"
          />
          <a-icon
            class="icon_length"
            v-if="scopeLength > 4 && flag"
            type="caret-left"
            @click="showLength"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="背景">
        <div class="tab2">
          <div class="tab_two">
            <div class="tab2_1_top">
              画面尺寸：
              <a-input-number
                class="aInputNum"
                id="inputNumber"
                :min="1"
                v-model="tabNumValue"
              />
              X
              <a-input-number
                class="aInputNum"
                id="inputNumber"
                v-model="tabNumValue"
                :min="1"
              />
            </div>
            <div class="tab2_1_bottom">
              FFU尺寸：
              <a-input-number
                class="aInputNum"
                id="inputNumber"
                v-model="tabNumValue"
                :min="1"
              />
              X
              <a-input-number
                class="aInputNum"
                id="inputNumber"
                v-model="tabNumValue"
                :min="1"
              />
            </div>
          </div>
          <div class="tab_two">
            <div class="tab2_1_top">
              底色：<a-switch v-model="delivery" />
              <div class="ds" style="backgroundColor:hotpink"></div>
            </div>
            <div class="tab2_1_bottom">
              底图：<a-switch v-model="delivery" />
              <a-select
                class="a_select"
                v-model="region"
                placeholder="please select your zone"
              >
                <a-select-option value="shanghai">
                  平铺
                </a-select-option>
                <a-select-option value="beijing">
                  Zone two
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="tab_two">
            <div class="tab2_1_top">
              <a-slider id="test" :default-value="slider" />
            </div>
            <div class="tab2_1_bottom">
              背景：
              <a-input-number
                class="aInputNum"
                id="inputNumber"
                v-model="tabNumValue"
                :min="1"
              />
            </div>
          </div>
          <div class="tab_two">
            <a-button class="bc" type="primary">
              保存
            </a-button>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="内容">
        <div class="tab3">
          <div class="tab_three_top">
            中间层：FFU <a-switch class="aSwitch" v-model="delivery" />
            弱电柜
            <a-switch class="aSwitch" v-model="delivery" />
            强电柜
            <a-switch class="aSwitch" v-model="delivery" />
            工艺区
            <a-switch class="aSwitch endSwitch" v-model="delivery" />
            前景层：显示<a-switch class="aSwitch" v-model="delivery" />
            min
            <a-input-number class="aInputNum" v-model="slider" :min="1" />
            max
            <a-input-number class="aInputNum" v-model="slider" :min="1" />
            范围
            <a-input-number class="aInputNum" v-model="slider" :min="1" />
          </div>
          <div class="tab_three_bottom">
            <a-button class="button_show" type="primary" @click="showModal">
              选择颜色
            </a-button>
            <a-modal
              :visible="visible"
              :confirm-loading="confirmLoading"
              @ok="handleOk"
              @cancel="handleCancel"
            >
              <sketch-picker
                v-model="colors"
                class="sketch"
                @input="updateValue"
              />
            </a-modal>
            当前颜色：
            <div
              class="colorSketch"
              :style="'backgroundColor:' + colorSketch"
            ></div>
            <a-button class="button_bc" type="primary">
              保存
            </a-button>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="编辑">
        <div class="tab4">
          编辑模式：<a-switch class="aSwitch" v-model="delivery" />
          <img title="添加" src="@/assets/floor/添加icon-勾选@2x.png" alt="" />
          <img title="删除" src="@/assets/floor/删除icon-未选@2x.png" alt="" />
          <img title="编辑" src="@/assets/floor/编辑icon-勾选@2x.png" alt="" />
          <img title="添加" src="@/assets/floor/添加icon-未选@2x.png" alt="" />
          <img title="删除" src="@/assets/floor/删除icon-勾选@2x.png" alt="" />
          <img title="编辑" src="@/assets/floor/编辑icon-未选@2x.png" alt="" />
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="surplus" v-if="flag">
      <div class="color" v-for="(item, index) in surplus" :key="index">
        <div class="color_top" :style="'backgroundColor:' + item.color"></div>
        <div class="color_bottom">
          {{ item.configName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getColor, getFFUTotal } from '@/services/Floor.js'
import { Sketch } from 'vue-color'
export default {
  name: 'TopTab',
  components: {
    'sketch-picker': Sketch
  },
  data() {
    return {
      color: [],
      total: {},
      runColor: null,
      errColor: null,
      stopColor: null,
      offLinkColor: null,
      scope: [],
      surplus: [],
      scopeLength: null,
      flag: false,
      tabNumValue: 4, // 画面尺寸
      delivery: true,
      region: '',
      slider: 40,
      colors: {
        hex: '#000',
        a: 1
      },
      colorSketch: 'hotpink',
      newColor: '',
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false
    }
  },
  mounted() {
    this.getTotal()
  },
  methods: {
    // 切换tab
    callback(key) {
      console.log(key)
      if (key !== 1) {
        this.flag = false
      }
    },
    // 获取数据
    async getTotal() {
      const res = await getColor()
      if (res.msgCode !== 0) {
        return
      } else {
        this.color = res.data
        res.data.forEach(e => {
          if (e.configType === 0) {
            this.runColor = e.color
          }
          if (e.configType === 1) {
            this.errColor = e.color
          }
          if (e.configType === 2) {
            this.stopColor = e.color
          }
          if (e.configType === 3) {
            this.offLinkColor = e.color
          }
          if (e.configType === 4) {
            if (this.scope.length < 4) {
              this.scope.push(e)
            } else if (this.scope.length >= 4) {
              this.surplus.push(e)
            }
          }
          this.scopeLength = this.scope.length + this.surplus.length
        })
      }
      const data = await getFFUTotal()
      if (data.msgCode !== 0) {
        return
      } else {
        this.total = data.data
      }
    },
    // 显示多余颜色范围
    showLength() {
      this.flag = !this.flag
    },
    updateValue(val) {
      console.log('颜色选择', val)
      this.newColor = val.hex
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.colorSketch = this.newColor
        this.visible = false
        this.confirmLoading = false
      }, 1000)
    },
    handleCancel(e) {
      this.visible = false
    }
  },
  computed: {
    totalAll() {
      let o =
        this.total.faultTotal +
        this.total.offlineTotal +
        this.total.runTotal +
        this.total.stopTotal
      return o
    }
  }
}
</script>
<style lang="less" scoped>
.tab {
  position: relative;
  height: 100%;
  /deep/.ant-tabs {
    position: relative;
    .ant-tabs-bar {
      border-bottom: none;
      .ant-tabs-nav {
        background-color: #f8f8fb;
        .ant-tabs-tab {
          color: #2b85fb;
          background-color: #c8d7ec;
          width: 72px;
          height: 32px;
          line-height: 30px;
          border-radius: 0;
          margin-left: 9px;
        }
        .ant-tabs-tab-active {
          background-color: #2b85fb;
          color: #fff;
        }
      }
    }
    .ant-tabs-tabpane {
      background-color: #fff;
      position: absolute;
      top: 32px;
      height: 96px;
    }
    .ant-tabs-card-content {
      height: 96px;
    }
  }
}
.right_color,
.surplus {
  // position: relative;
  width: 360px;
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  float: right;

  .color {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    .color_top {
      width: 72px;
      height: 30px;
      border-radius: 5px;
    }
    .color_bottom {
      width: 72px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      margin-top: 10px;
    }
  }
  .icon_length {
    margin-left: 20px;
    font-size: 30px;
  }
}
.surplus {
  background-color: #fff;
  position: absolute;
  top: 32px;
  right: -360px;
  width: 360px;
  height: 96px;
  justify-content: unset;
  .color {
    margin-left: 10px;
  }
}
.operation {
  position: relative;
  display: inline-block;
  width: 720px;
  height: 100%;
  .total {
    width: 260px;
    height: 96px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .t_o {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      .tw {
        width: 40px;
        height: 40px;
        text-align: center;
        font-size: 12px;
        line-height: 40px;
        font-weight: 700;
        img {
          width: 80%;
          height: 80%;
          margin-left: 15px;
        }
      }
      .font {
        background-color: #e9e9ec;
        color: #284676;
        width: 70px;
        height: 20px;
        border-radius: 10px;
        line-height: 20px;
      }
      .font_2 {
        margin-top: 20px;
      }
    }
  }
  .state {
    position: absolute;
    top: 0;
    right: 0;
    width: 425px;
    height: 96px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .status {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      .condition {
        border-radius: 10px;
        width: 70px;
        height: 30px;
        text-align: center;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        font-weight: 700;
        img {
          width: 30px;
          height: 30px;
        }
      }
      .color {
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
.tab2 {
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tab_two {
    font-size: 12px;
    &:nth-child(1) {
      width: 260px;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .tab2_1_top,
      .tab2_1_bottom {
        width: 100%;
        height: 40%;
      }
      .tab2_1_bottom {
        padding: 5px;
      }
      .aInputNum {
        width: 60px;
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    &:nth-child(2) {
      width: 240px;
      height: 100%;
      width: 260px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .tab2_1_top,
      .tab2_1_bottom {
        width: 100%;
        height: 40%;
        margin-top: 15px;
      }
      .ds {
        width: 70px;
        height: 30px;
        float: right;
        margin-right: 80px;
      }
      .a_select {
        width: 100px;
        margin-left: 30px;
      }
    }
    &:nth-child(3) {
      width: 240px;
      height: 100%;
      width: 260px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .tab2_1_top,
      .tab2_1_bottom {
        width: 100%;
        height: 40%;
        margin-top: 15px;
        background-color: #fff;
      }
    }
    &:nth-child(4) {
      width: 100px;
      height: 100%;
      .bc {
        margin-top: 30px;
      }
    }
  }
}
.tab3 {
  font-size: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 15px;
  .tab_three_top,
  .tab_three_bottom {
    position: relative;
    width: 100%;
    height: 45%;
  }
  .aInputNum {
    margin-left: 10px;
    margin-right: 10px;
  }
  .aSwitch {
    margin-left: 5px;
    margin-right: 5px;
  }
  .endSwitch {
    margin-right: 30px;
  }
  .colorSketch {
    width: 60px;
    height: 30px;
    // display: inline-block;
    position: absolute;
    top: 3px;
    left: 190px;
  }
  .button_show {
    margin-right: 30px;
  }
  .button_bc {
    position: absolute;
    right: 127px;
  }
}
.tab4 {
  padding: 30px;
  width: 100%;
  height: 100%;
  .aSwitch {
    margin-right: 40px;
  }
  img {
    width: 40px;
    height: 40px;
    margin-left: 20px;
  }
}
</style>
