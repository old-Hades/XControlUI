<template>
  <div>
      <a-button type="primary" @click="go()">返回</a-button>
    <a-form
      :form="form"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-item label="用户名">
        <a-input
          v-decorator="['用户名', { rules: [{ required: true, message: 'Please input your name!' }] }]" v-model="name"
        />
      </a-form-item>
      <a-form-item label="角色">
        <a-select
          v-decorator="[
          '角色',
          { rules: [{ required: true, message: 'Please select your role!' }] },
        ]"
          placeholder="Select a option and change input text above"
          @change="handleSelectChange"
          v-model="role"
        >
          <a-select-option value="Manager">Manager</a-select-option>
          <a-select-option value="Operator">Operator</a-select-option>
          <a-select-option value="Customer">Customer</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit" @click="clickHandler">保存</a-button>
        <a-button type="danger" class="reset" @click="resetForm('ruleForm')">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      role: '',
      name: '',
      form:''
    };
  },
  mounted() {
    console.log(this)
  },
  methods: {
    handleSelectChange(){},
    clickHandler() {
      console.log(this.name, this.role)
      axios
        .post("http://localhost:8000/user/add", {
          user_name: this.name,
          role:this.role,
          age: 22,
          phone: 1232414424,
          password: 'd23wf34rs'
        })
        .then((res) => {
          console.log(res,"打印");
          this.$router.push({
            name: "Users"
          });
        })
    },
    go() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.reset {
  margin-left: 50px;
}
</style>