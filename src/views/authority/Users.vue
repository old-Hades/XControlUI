<template>
  <div id="box">
    <h1>用户管理</h1>

    <!-- <Jur /> -->

    <div id="con">
      <div class="die">
        <div>
          <a-button type="primary" @click="addUserShow">
            添加
          </a-button>
          <a-popconfirm
            placement="top"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteAll"
          >
            <template slot="title">
              <p>确认删除所选用户？</p>
            </template>
            <a-button type="danger">
              批量删除
            </a-button>
          </a-popconfirm>
        </div>
        <div>
          <a-input-search
            placeholder="请输入用户名"
            enter-button="Search"
            size="large"
            @search="onSearch"
          />
        </div>
      </div>
      <a-table
        :columns="columns"
        :data-source="userData"
        :pagination="false"
        :row-selection="rowSelection"
      >
        <div slot="enabled" slot-scope="enabled">
          <!-- {{ enabled }} -->
          <a-switch
            :checked="enabled.enabled === 1 ? true : false"
            :dsiabled="admin ? true : false"
            @change="changeSwitch"
            @click="checkout(enabled)"
          />
        </div>
        <div slot="insertTime" slot-scope="insertTime">
          {{ insertTime | dateFormat }}
        </div>
        <div slot="action" slot-scope="action">
          <a-tag color="#9615EE" @click="editUser_Roles(action.id)">
            分配角色
          </a-tag>
          <a-tag color="#108ee9" @click="editUserShow(action)">
            编辑
          </a-tag>
          <a-popconfirm
            placement="top"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteUser(action.id)"
          >
            <template slot="title">
              <p>{{ text }}</p>
            </template>
            <a-tag color="#f50">
              删除
            </a-tag>
          </a-popconfirm>
        </div>
      </a-table>
      <a-pagination
        v-model="start"
        show-size-changer
        :page-size.sync="limit"
        :total="total"
      />
      <!-- 添加用户 -->
      <a-modal v-model="visibleAdd" title="添加用户" @ok="handleOkAdd">
        <a-form
          :form="form"
          class="form_w"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="用户名">
            <a-input
              placeholder="Please input your UserName!"
              v-decorator="[
                'name',
                {
                  rules: [
                    { required: true, message: 'Please input your UserName!' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="用户密码">
            <a-input
              placeholder="Please input your Password!"
              type="password"
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: 'Please input your Password!' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="用户邮箱">
            <a-input
              placeholder="Please input your Email!"
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户邮箱',
                      whitespace: true
                    },
                    {
                      pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                      message: '邮箱格式不正确'
                    },
                    { max: 50, message: '邮箱不得超过50字符' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input
              placeholder="Please input your Telephone!"
              v-decorator="[
                'telephone',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号码',
                      whitespace: true
                    },
                    { validator: phoneCheck.bind(this) }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 添加用户---over -->

      <!-- 修改用户 -->
      <a-modal
        v-model="visibleEdit"
        title="修改用户"
        @ok="handleOkEdit"
        @cancel="handleCancel"
      >
        <a-form
          :form="formEdit"
          class="form_w"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="用户名">
            <a-input
              placeholder="Please input your UserName!"
              v-decorator="[
                'UserName',
                {
                  rules: [
                    { required: true, message: 'Please input your UserName!' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="用户密码">
            <a-input
              placeholder="Please input your Password!"
              type="password"
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: false, message: 'Please input your Password!' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="用户邮箱">
            <a-input
              placeholder="Please input your Email!"
              v-decorator="[
                'email',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户邮箱',
                      whitespace: true
                    },
                    {
                      pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                      message: '邮箱格式不正确'
                    },
                    { max: 50, message: '邮箱不得超过50字符' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input
              placeholder="Please input your Telephone!"
              v-decorator="[
                'telephone',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号码',
                      whitespace: true
                    },
                    { validator: phoneCheck.bind(this) }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 修改用户---over -->
      <!-- 分配角色 -->
      <a-modal v-model="visibleRoles" title="分配角色" @ok="handleOkRoles">
        <a-form
          :form="formRole"
          class="form_w"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <div style="color:hotpink;margin-bottom:20px;">
            <a-icon
              type="highlight"
              style="margin-right:20px;"
            />请选择给该用户所分配的角色，可多选！！！
          </div>
          <a-form-item label="可分配的角色">
            <a-select
              v-decorator="[
                'jurisdiction',
                {
                  rules: [
                    {
                      required: false,
                      message: 'Please select your Jurisdiction!'
                    }
                  ]
                }
              ]"
              placeholder="Please select your Jurisdiction！"
              @change="handleSelectChange"
              mode="multiple"
            >
              <a-select-option
                :value="item.id"
                v-for="item in roles"
                :key="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="用户当前角色">
            <a-tag color="#bbb" v-for="item in u_r" :key="item.id">
              {{ item.name }}
            </a-tag>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 分配角色---over -->
    </div>
  </div>
</template>

<script>
import {
  getUser,
  getSearchUser,
  addUser,
  deleteUser,
  editUser,
  UserRoles,
  uploadUserRoles
} from '../../services/user'
import { getRoles } from '../../services/role'
import crypto from 'crypto'
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '用户名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
    key: 'telephone'
  },
  {
    title: '状态',
    key: 'enabled',
    scopedSlots: { customRender: 'enabled' }
  },
  {
    title: '插入时间',
    dataIndex: 'insertTime',
    key: 'insertTime',
    scopedSlots: { customRender: 'insertTime' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    // Jur,
  },
  data() {
    return {
      userData: null,
      columns,
      visibleAdd: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      formEdit: this.$form.createForm(this),
      formRole: this.$form.createForm(this),
      total: 10,
      start: 1,
      limit: 10,
      visibleEdit: false,
      text: 'Are you sure to delete this task?',
      phoneCheck(rule, value, callbackFn) {
        const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (!reg.test(value)) {
          callbackFn('请输入手机号码')
          return
        }
        callbackFn()
      },
      deleteAllInfo: null,
      editId: null,
      editCheckout: null,
      roles: null,
      visibleRoles: false,
      u_r: null,
      r: null,
      id: null,
      admin: null
    }
  },
  created() {
    this.Users()
  },
  watch: {
    start(val) {
      console.log(val)
      this.Users()
    },
    limit(val) {
      console.log(val)
      this.Users()
    }
  },
  methods: {
    // 用户数据
    async Users() {
      const res = await getUser(`${this.start}/${this.limit}`)
      console.log(res)
      if (res.messageCode !== 0) {
        this.$message.error('请求失败，未获取到用户数据！！！')
      } else {
        this.userData = res.data.datas
        console.log(this.userData)
      }
    },
    changeSwitch(e) {
      let admin = null
      setTimeout(async () => {
        await UserRoles(this.editCheckout.id).then(data => {
          data.data.datas.forEach((e, i) => {
            if (e.name === 'ROLE_ADMIN') {
              admin = e.name
            }
          })
        })
        console.log(admin)
        if (!admin) {
          setTimeout(async () => {
            console.log(this.editCheckout)
            if (e === true) {
              e = 1
            } else if (e === false) {
              e = 0
            }
            const res = await editUser([
              {
                id: this.editCheckout.id,
                email: this.editCheckout.email,
                telephone: this.editCheckout.telephone,
                enabled: e,
                name: this.editCheckout.name
              }
            ])
            if (res.messageCode === 0) {
              this.$message.success('修改用户状态成功')
              this.Users()
            } else {
              this.$message.error('修改用户状态失败！！')
            }
          }, 30)
        } else {
          return
        }
      }, 20)
      console.log(admin)
      this.editCheckout = null
    },
    checkout(e) {
      this.editCheckout = e
    },
    // 搜索表格
    async onSearch(e) {
      console.log(e)
      if (!e) {
        return this.Users()
      }
      const res = await getSearchUser(e)
      console.log(res)
      if (res.messageCode === 0 && !res.data) {
        this.$message.success('搜索成功，但未查找到用户信息！')
      } else if (res.messageCode === 0 && res.data) {
        console.log(res.data)
        let n = []
        n.push(res.data)
        this.userData = n
        this.$message.success('搜索成功！')
      }
    },
    // 显示添加用户框
    addUserShow() {
      this.visibleAdd = true
    },
    // 添加成功后隐藏添加用户框
    handleOkAdd(e) {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const res = await addUser([
            {
              name: values.name,
              password: values.password,
              email: values.email,
              telephone: values.telephone
            }
          ])
          if (res.messageCode === 0) {
            this.$message.success('添加用户成功')
            this.form.resetFields()
            this.Users()
            this.visibleAdd = false
          } else {
            this.$message.error('添加用户失败！！')
          }
        }
      })
    },

    // 修改用户权限框
    editUserShow(e) {
      console.log(e)
      this.editId = e.id
      this.formEdit.getFieldDecorator('UserName', { initialValue: e.name })
      this.formEdit.getFieldDecorator('email', { initialValue: e.email })
      this.formEdit.getFieldDecorator('telephone', {
        initialValue: e.telephone
      })
      this.visibleEdit = true
    },
    // 取消修改
    handleCancel() {
      this.formEdit.resetFields()
    },
    // 确认修改
    handleOkEdit(e) {
      this.formEdit.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          if (values.password !== undefined) {
            const md5 = crypto.createHash('md5')
            md5.update(values.password)
            const md5pwd = md5.digest('hex')
            values.password = md5pwd
          } else if (values.password === undefined) {
            values.password = null
            console.log(values)
          }
          const res = await editUser([
            {
              name: values.UserName,
              email: values.email,
              telephone: values.telephone,
              id: this.editId,
              password: values.password
            }
          ])
          if (res.messageCode === 0) {
            this.$message.success('修改用户信息成功')
            this.formEdit.resetFields()
            this.Users()
            this.visibleEdit = false
          }
        }
      })
    },
    // 删除用户确认
    async deleteUser(e) {
      console.log(e)
      const res = await deleteUser([e])
      console.log(res)
      if (res.messageCode === 0) {
        this.$message.success('删除成功！')
        this.Users()
      } else {
        this.$message.error('删除失败')
      }
    },
    // 删除选中
    async deleteAll() {
      console.log(this.deleteAllInfo)
      if (!this.deleteAllInfo) {
        return this.$message.error('请选择要删除的用户')
      } else {
        let n = []
        this.deleteAllInfo.forEach((e, i) => {
          // console.log(e.id)
          n.push(e.id)
        })
        const res = await deleteUser(n)
        if (res.messageCode === 0) {
          this.$message.success('删除成功！')
          this.Users()
        } else {
          this.$message.error('删除失败，请稍后重试！')
        }
      }
    },
    // 显示角色选择框
    async editUser_Roles(id) {
      this.id = id
      await UserRoles(id)
        .then(data => {
          console.log(data)
          data.data.datas.forEach((e, i) => {
            if (e.name === 'ROLE_ADMIN') {
              this.admin = e.name
            }
          })
          this.u_r = data.data.datas
        })
        .then(async () => {
          const res = await getRoles(`${this.start}/${this.limit}`)
          if (!res.messageCode === 0) {
            return this.$message.error('请求角色列表失败！！')
          } else {
            this.roles = res.data.datas
            this.visibleRoles = true
          }
        })
    },
    // 权限下拉框
    handleSelectChange(value) {
      this.r = value
    },
    // 确认选中
    async handleOkRoles() {
      const res = await uploadUserRoles({ roleIds: this.r, userId: this.id })
      console.log(res)
      if (res.messageCode === 0) {
        this.$message.success('分配用户角色成功')
        this.visibleRoles = false
        this.id = null
        this.r = null
        this.formRole.resetFields()
      } else {
        this.$message.error('分配用户角色失败 ！！！')
      }
    }
  },
  computed: {
    // 复选框
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          )
          this.deleteAllInfo = selectedRows
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
h1 {
  text-align: center;
  font-weight: 700;
  margin: 10px 0;
}

#con {
  width: 80%;
  margin: 0 auto;
}
.ant-input-search {
  width: 100%;
}
.ant-btn {
  margin-right: 20px;
}
.die {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 70px;
}
/deep/ .form_w {
  .ant-col-12 {
    width: 65% !important;
  }
}
.ant-pagination {
  margin-top: 30px;
}
</style>
