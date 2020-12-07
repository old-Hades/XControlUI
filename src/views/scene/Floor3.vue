<template>
  <div>
    <div class="icon">
      <a-affix :offset-top="top">
        <a-icon type="minus" class="minus" @click="reduce" />
        <a-icon type="plus" class="plus" @click="enlarge" />
      </a-affix>
    </div>

    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      ref="pic"
      width="100%"
      height="100%"
    >
      <use xlink:href="#icon-test" onclick="console.log('1111！')" />
    </svg>
  </div>
</template>

<script>
import "../icons/svg/test.svg";
export default {
  data() {
    return {
      top: 10,
    };
  },
  mounted() {
    this.$refs.pic.style.width = 1000;
    this.$refs.pic.style.height = 600;
  },
  methods: {
    enlarge() {
      this.$refs.pic.style.width =
        parseInt(this.$refs.pic.style.width) + 200 + "px";
      this.$refs.pic.style.height =
        parseInt(this.$refs.pic.style.height) + 200 + "px";
    },
    reduce() {
      this.$refs.pic.style.width =
        parseInt(this.$refs.pic.style.width) - 200 + "px";
      this.$refs.pic.style.height =
        parseInt(this.$refs.pic.style.height) - 200 + "px";
    },
  },
};
</script>

<style scoped>
.icon {
  font-size: 22px;
}
.minus {
  margin-right: 20px;
}</style
>>
