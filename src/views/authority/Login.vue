<template>
  <div class="login_container">
    <div class="bg">
      <div class="left"></div>
      <div class="right">
        <a-form
          :form="form"
          class="demo-ruleForm login-page"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          @submit="handleSubmit"
        >
          <span>京东方智慧车间</span>
          <a-form-item>
            <a-input
              placeholder="账号"
              v-decorator="[
                'username',
                { rules: [{ required: true, message: '请输入用户名!' }] }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="密码"
              type="password"
              v-decorator="[
                'password',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入3~18位的密码!',
                      max: 18,
                      min: 3
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item
            style="width:100%;"
            :wrapper-col="{ span: 12, offset: 5 }"
          >
            <a-button
              style="width:100%; margin-left:10%"
              type="primary"
              html-type="submit"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { serverUrl } from '../../utils/config'
import { setToken } from '../../utils/auth'
import crypto from 'crypto'
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      checked: true,
      // loading : false
      loginUrl: serverUrl.loginUrl
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      let that = this

      try {
        this.form.validateFields(async (err, values) => {
          if (!err) {
            const md5 = crypto.createHash('md5')

            const params = {
              username: values.username,
              password: values.password
            }
            md5.update(params.password)
            const md5pwd = md5.digest('hex')
            console.log(md5pwd)
            params.password = md5pwd
            const res = await axios.post(that.loginUrl, params)
            console.log(res)
            if (res.status === 200 && res.data.code === 200) {
              setToken(res.data.obj)
              this.$message.success('登录成功！')
              this.$router.push('/')
            } else {
              this.$message.error('账号或者密码错误，请重新输入')
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  position: relative;
  width: 100%;
  height: 723px;
  background: url('~@/assets/login/底图.png') no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
.bg {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 1100px;
  height: 600px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url('~@/assets/login/白色底框.png');
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  .left {
    // position: absolute;
    // top: 25px;
    // left: 25px;
    width: 57%;
    margin-top: 60px;
    margin-left: -25px;
    height: 100%;
    background: url('~@/assets/login/左侧图.png');
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }
  .right {
    width: 300px;
    height: 87%;
    position: relative;
    .ant-form {
      width: 100%;
      position: absolute;
      top: 36%;
      .ant-form-item {
        text-align: center;
      }
      .ant-input {
        background-color: #f0f4fc;
        border-radius: 30px;
        margin-left: 40px;
        border: none;
      }
      span {
        position: absolute;
        left: 160px;
        top: -15%;
        color: #7b7c80;
      }
      .ant-btn {
        border-radius: 30px;
        color: #fff;
        background-image: linear-gradient(to right, #2e87f4, #23c6e4);
        border: none;
        width: 150% !important;
        margin-left: -13% !important;
        margin-top: 10px;
      }
    }
  }
}
</style>
