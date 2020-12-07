<template>
  <div>
    <ul class="stripAll">
      <li class="stripLi green">
        <span>FFU运行</span>
        <div class="strip" :title="'比例：' + runTotal.toFixed(2) + '%'">
          <div class="border">
            <div class="bar green_bar" ref="green">&nbsp;</div>
          </div>
        </div>
        <span>{{ numObj.runTotal }}台</span>
      </li>
      <li class="stripLi yellow">
        <span>FFU停机</span>
        <div class="strip" :title="'比例：' + stopTotal.toFixed(2) + '%'">
          <div class="border">
            <div class="bar yellow_bar" ref="yellow">&nbsp;</div>
          </div>
        </div>
        <span>{{ numObj.stopTotal }}台</span>
      </li>
      <li class="stripLi gray">
        <span>FFU离线</span>
        <div class="strip" :title="'比例：' + offlineTotal.toFixed(2) + '%'">
          <div class="border">
            <div class="bar gray_bar" ref="gray">&nbsp;</div>
          </div>
        </div>
        <span>{{ numObj.offlineTotal }}台</span>
      </li>
      <li class="stripLi red">
        <span>FFU故障</span>
        <div class="strip" :title="'比例：' + faultTotal.toFixed(2) + '%'">
          <div class="border">
            <div class="bar red_bar" ref="red">&nbsp;</div>
          </div>
        </div>
        <span>{{ numObj.faultTotal }}台</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    numObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.num()
  },
  methods: {
    // 图二的进度条
    num() {
      this.$refs.green.style.width = this.runTotal + '%'
      this.$refs.yellow.style.width = this.stopTotal + '%'
      this.$refs.gray.style.width = this.offlineTotal + '%'
      this.$refs.red.style.width = this.faultTotal + '%'
    }
  },
  computed: {
    totalNum() {
      return (
        this.numObj.runTotal +
        this.numObj.stopTotal +
        this.numObj.offlineTotal +
        this.numObj.faultTotal
      )
    },
    runTotal() {
      return (this.numObj.runTotal / this.totalNum) * 100
    },
    stopTotal() {
      return (this.numObj.stopTotal / this.totalNum) * 100
    },
    offlineTotal() {
      return (this.numObj.offlineTotal / this.totalNum) * 100
    },
    faultTotal() {
      return (this.numObj.faultTotal / this.totalNum) * 100
    }
  }
}
</script>
<style lang="less" scoped>
.stripAll {
  position: relative;
  list-style-type: none;
  padding: 0;
  line-height: 45px;
  .stripLi {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 340px;
    span {
      display: inline-block;
      text-align: center;
      width: 130px;
    }
  }
  .green {
    color: #2cc261;
  }
  .yellow {
    color: #a6a6a6;
  }
  .gray {
    color: #c9ccd3;
  }
  .red {
    color: #23c6dd;
  }
  .strip:hover{
    cursor: pointer;
  }
  .strip {
    height: 40px;
    width: 200px;
    // background-color: #fff;
    // border: 1px solid #ccc;
    display: inline-block;
    .border {
      display: inline-block;
      border: 1px solid #777;
      width: 200px;
      height: 21px;
      background: #063853;
      .bar {
        width: 50%;
        height: 20px;
        overflow: hidden;
      }
      .green_bar {
        background: #2cc261;
      }
      .yellow_bar {
        background: #a6a6a6;
      }
      .gray_bar {
        background: #c9ccd3;
      }
      .red_bar {
        background: #23c6dd;
      }
    }
  }
}
</style>
