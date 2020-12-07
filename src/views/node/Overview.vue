<template>
  <div id="box">
    <img src="../../assets/image/top.png" alt="拓扑" class="top" />
    <div class="center">
      <div class="tuopu">
        <div>
          <img src="../../assets/image/server.png" alt="拓扑" />
          <p>Server 1</p>
          <span></span>
          <em>正常</em>
        </div>
        <div>
          <img src="../../assets/image/server.png" alt="拓扑" />
          <p>Server 2</p>
          <span></span>
          <em>正常</em>
        </div>
      </div>
      <div class="tuopu">
        <div>
          <img src="../../assets/image/server.png" alt="拓扑" />
          <p>Server 3</p>
          <span></span>
          <em>正常</em>
        </div>
        <div>
          <img src="../../assets/image/server.png" alt="拓扑" />
          <p>Server 4</p>
          <span></span>
          <em>正常</em>
        </div>
      </div>
    </div>

    <img src="../../assets/image/bottom.png" alt="拓扑" class="bottom" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.top,
.bottom {
  display: block;
  margin: 0 auto;
  padding: 0;
}
.center {
text-align: center;
}
.tuopu {
  min-height: 50px;
  padding: 10px;
  margin: 10px;
  border: dashed 1px;
  display: inline-block;
}
.tuopu div {
  margin: 10px;
  display: inline-block;
}
.tuopu p {
  color: #5c9cd6;
  margin: 0;
  padding: 0;
}
span {
  background: #93d150;
  width: 26px;
  height: 21px;
  display: inline-block;
  margin-right: 7px;
}
em {
  font-style: normal;
  font-size: 16px;
}
</style>
