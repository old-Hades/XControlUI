<template>
  <div>
    <div class="left_kw">
      <div class="kw_num">
        <div class="kw_num_two">
          {{ grossPower }}
        </div>
      </div>
      <div class="kw_kw">kw</div>
      <span>系统总功率</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    grossPower: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.left_kw {
  padding-top: 10px;
  position: relative;
  width: 170px;
  height: 170px;
  left: -22px;
  .kw_num {
    width: 130px;
    height: 130px;
    background-image: linear-gradient(#23c6e4, #228ec6, #23c6e4);
    border-radius: 50%;
    text-align: center;
    box-sizing: border-box;
    padding: 5px;
    margin-left: 20px;
    .kw_num_two {
      background-image: linear-gradient(#162744, #162744);
      border-radius: 50%;
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      box-sizing: border-box;
      margin: 0 auto;
      color: #fff;
      font-size: 30px;
      line-height: 95px;
    }
  }
  .kw_kw {
    position: absolute;
    top: 120px;
    left: 45px;
    width: 75px;
    height: 25px;
    background-color: #23c6e4;
    // background-image: linear-gradient(#23C6E4,#23C6E4, #23c6e4);
    border-radius: 30px;
    text-align: center;
    font-size: 18px;
  }
  span {
    display: inline-block;
    margin-left: 43px;
    margin-top: 22px;
    color: #26daf8;
    font-size: 15px;
  }
}
</style>
