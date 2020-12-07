<template>
  <div>
    <div class="border_r_l">
      <div class="border_L">
        <div class="border_i">
          <img class="conter_image" src="@/assets/home/BV02.jpg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.border_r_l {
  width: 700px;
  height: 660px;
  background-image: linear-gradient(
    rgba(255, 255, 255, 0),
    #228ec6,
    rgba(255, 255, 255, 0)
  );
  border-radius: 50%;
  text-align: center;
  box-sizing: border-box;
  .border_L {
    background-image: linear-gradient(#162744, #162744);
    border-radius: 50%;
    text-align: center;
    box-sizing: border-box;
    width: 98%;
    height: 100%;
    border-radius: 50%;
    box-sizing: border-box;
    margin: 0 auto;
    padding-top: 23px;
  }
}
.border_i {
  margin: 0 auto;
  width: 620px;
  background-image: linear-gradient(#25537f, #25537f);
  border-radius: 50%;
  text-align: center;
  padding: 10px;
  font-size: 28px;
  box-sizing: border-box;

  .conter_image {
    width: 100%;
    height: 100%;
    background: #25537f;
    border-radius: 50%;
  }
}
</style>
