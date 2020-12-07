<template>
  <div class="box">
    <a-radio-group v-model="mode" :style="{ marginBottom: '8px' }">
      <a-radio-button value="top">
        Horizontal
      </a-radio-button>
      <a-radio-button value="left">
        Vertical
      </a-radio-button>
    </a-radio-group>
    <a-tabs
      :tab-position="mode"
      :style="{ height: '600px'}"
      @prevClick="callback"
      @nextClick="callback"
    >
      <a-tab-pane :key="1" tab="CPU"><Node3 /></a-tab-pane>
      <a-tab-pane :key="2" tab="网络"><Node2 /></a-tab-pane>
      <a-tab-pane :key="3" tab="磁盘"><Node4 /></a-tab-pane>
      <a-tab-pane :key="4" tab="内存"><Node5 /></a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Node2 from "./Node2"
import Node3 from "./Node3"
import Node4 from "./Node4"
import Node5 from "./Node5"


export default {
  components:{
    Node2,
    Node3,
    Node4,
    Node5,
  },
  data() {
    return {
      mode: 'top',
    };
  },
  methods: {
    callback(val) {
      console.log(val);
    },
  },
};
</script>

<style scoped>
/* .box{
  border: solid 1px;
} */

</style>