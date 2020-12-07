<template>
  <div id="box">
    <div class="find">
      <div id="condition">
        <h5>查询条件：</h5>
        <a-cascader
          :options="options"
          placeholder="Please select"
          @change="onChange"
          style="width: 150px"
        />
      </div>
      <div id="content">
        <h5>查询内容：</h5>
        <a-auto-complete
          v-model="value"
          :data-source="dataSource"
          style="width: 150px"
          placeholder="input here"
          @select="onSelect"
          @search="onSearch"
          @change="onTurn"
        />
      </div>
      <div id="search">
        <a-button icon="search" style="width: 120px">Search</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "jiangsu",
          label: "Jiangsu",
          children: [
            {
              value: "nanjing",
              label: "Nanjing",
              children: [
                {
                  value: "yuhuatai",
                  label: "yuhuatai",
                },
              ],
            },
          ],
        },
      ],
      value: "",
      dataSource: [],
    };
  },
  watch: {
    value(val) {
      console.log("value", val);
    },
  },
  methods: {
    onChange(value) {
      console.log(value);
    },
    onSearch(searchText) {
      this.dataSource = !searchText
        ? []
        : [searchText, searchText.repeat(2), searchText.repeat(3)];
    },
    onSelect(value) {
      console.log("onSelect", value);
    },
    onTurn(value) {
      console.log("onTurn", value);
    },
  },
};
</script>

<style scoped>
h5 {
  font-size: 16px;
}
#condition,
#content,
#search {
  display: flex;
  margin-left: 120px;
}
.find {
  display: flex;
  margin: 40px 0;
}
</style>