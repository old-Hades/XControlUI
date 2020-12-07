<template>
  <div class="right_overview">
    <div class="info">
      <div class="normal">
        <div class="n_top"></div>
        <span>通道正常</span>
      </div>
      <div class="abnormal">
        <div class="n_left"></div>
        <span>通道异常</span>
      </div>
    </div>
    <div class="info num">
      <div class="_num">
        <div class="num_all">{{total}}条</div>
      </div>
      <div>通道总条数</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="less" scoped>
.right_overview {
  width: 170px;
  height: 170px;
  position: absolute;
  right: 16px;
  top: 72px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  .info {
    padding: 10px;
    width: 100%;
    height: 85px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .normal {
      height: 100%;
      flex: 1;
      // background-color: #eee;
      color: #fff;
      span {
        margin-top: 10px;
        margin-left: 10px;
        display: inline-block;
        font-size: 12px;
      }
    }
    .abnormal {
      margin-left: 16px;
      height: 100%;
      flex: 1;
      color: #fff;
      span {
        font-size: 12px;
        margin-top: 10px;
        margin-left: 10px;
        display: inline-block;
      }
    }
    .n_top {
      width: 100%;
      height: 50%;
      background-image: linear-gradient(#2dc259, #23c6df);
    }
    .n_left {
      width: 100%;
      height: 50%;
      background-color: #022546;
    }
  }
  .num {
    padding: 10px;
    width: 100%;
    height: 85px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    color: #26daf8;
    font-size: 15px;
    ._num {
      width: 100%;
      margin: 0 auto;
      .num_all {
        margin-left: 22px;
        width: 70%;
        height: 50%;
        margin-bottom: 10px;
        // border: 1px solid #26daf8 #2E8BF4;
        border: 2px solid #ddd;
        border-image: -webkit-linear-gradient(#26daf8, #2e8bf4) 2 20;
        border-image: -moz-linear-gradient(#26daf8, #2e8bf4) 2 20;
        border-image: -o-linear-gradient(#26daf8, #2e8bf4) 2 20;
        border-image: linear-gradient(#26daf8, #2e8bf4) 2 20;
        text-align: center;
        line-height: 36px;
      }
    }
  }
}
</style>
