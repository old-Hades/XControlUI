<template>
  <div id="box">
    <h1>角色管理</h1>

    <!-- <Jur /> -->

    <div id="con">
      <div class="die">
        <div>
          <a-button type="primary" @click="addRoleShow">
            添加
          </a-button>
          <a-popconfirm
            placement="top"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteAll"
          >
            <template slot="title">
              <p>确认删除所选角色？</p>
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
        v-if="roleData"
        :columns="columns"
        :data-source="roleData"
        :pagination="false"
        :row-selection="rowSelection"
      >
        <div slot="insertTime" slot-scope="insertTime">
          {{ insertTime | dateFormat }}
        </div>
        <div slot="action" slot-scope="action">
          <!-- <a-tag color="#9615EE" @click="editRoleMenu(action)">
            菜单管理
          </a-tag> -->
          <a-tag color="#108ee9" @click="editRoleShow(action)">
            编辑
          </a-tag>
          <a-popconfirm
            placement="top"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteRole(action.id)"
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
      <!-- 添加角色 -->
      <a-modal v-model="visibleAdd" title="添加角色" @ok="handleOkAdd">
        <a-form
          :form="form"
          class="form_w"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="角色名">
            <a-input
              placeholder="Please input your RoleName!"
              v-decorator="[
                'roleName',
                {
                  rules: [
                    { required: true, message: 'Please input your RoleName!' }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 添加角色---over -->

      <!-- 修改角色 -->
      <a-modal v-model="visibleEdit" title="修改角色" @ok="handleOkEdit">
        <a-form
          :form="formEdit"
          class="form_w"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="角色名">
            <a-input
              placeholder="Please input your RoleName!"
              v-decorator="[
                'roleName',
                {
                  rules: [
                    { required: true, message: 'Please input your RoleName!' }
                  ]
                }
              ]"
            />
          </a-form-item>
          <!-- <a-form-item label="角色权限">
            <a-select
              v-decorator="['jurisdiction', { rules: [{ required: true, message: 'Please select your Jurisdiction!' }] }]"
              placeholder="Please select your Jurisdiction！"
              @change="handleSelectChange"
            >
              <a-select-option value="male">
                male
              </a-select-option>
              <a-select-option value="female">
                female
              </a-select-option>
              <a-select-option value="female2">
                female2
              </a-select-option>
            </a-select>
          </a-form-item> -->
        </a-form>
      </a-modal>
      <!-- 修改角色---over -->
      <!-- 菜单管理 -->
      <!-- <a-modal v-model="visibleMenu" title="管理角色菜单" @ok="handleOkMenu"></a-modal> -->
      <!-- /菜单管理 -->
    </div>
  </div>
</template>

<script>
import {
  getRoles,
  getSearchRoles,
  addRoles,
  deleteRoles,
  editRoles
} from '../../services/role'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '角色名',
    key: 'name',
    dataIndex: 'name'
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
      roleData: null,
      columns,
      visibleAdd: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      formEdit: this.$form.createForm(this),
      total: 10,
      start: 1,
      limit: 10,
      visibleEdit: false,
      text: 'Are you sure to delete this task?',
      deleteAllInfo: null,
      editId: null,
      visibleMenu: false
    }
  },
  created() {
    this.Roles()
  },
  watch: {
    start(val) {
      console.log(val)
      this.Roles()
    },
    limit(val) {
      console.log(val)
      this.Roles()
    }
  },
  methods: {
    // 角色表格
    async Roles() {
      const res = await getRoles(`${this.start}/${this.limit}`)
      console.log(res)
      console.log(res.data.datas)
      if (!res.messageCode === 0) {
        return this.$message.error('请求角色列表失败！！')
      } else {
        this.roleData = res.data.datas
        this.total = res.total
      }
    },
    // 搜索表格
    async onSearch(e) {
      console.log(e)
      if (!e) {
        return this.Roles()
      }
      const res = await getSearchRoles(e)
      console.log(res)
      if (res.messageCode === 0 && !res.data) {
        this.$message.success('搜索成功，但未查找到角色信息！')
      } else if (res.messageCode === 0 && res.data) {
        console.log(res.data)
        let n = []
        n.push(res.data)
        this.roleData = n
        this.$message.success('搜索成功！')
      }
    },
    // 显示添加角色框
    addRoleShow() {
      this.visibleAdd = true
    },
    // 添加成功后隐藏添加角色框
    handleOkAdd(e) {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const res = await addRoles([
            {
              name: values.roleName
            }
          ])
          if (res.messageCode === 0) {
            this.$message.success('添加角色成功')
            this.formEdit.resetFields()
            this.visibleAdd = false
            this.Roles()
          } else {
            this.$message.error('添加角色失败，请重试！！！')
          }
        }
      })
    },
    // 权限下拉框
    handleSelectChange(value) {
      console.log(value)
    },
    // 修改角色权限框
    editRoleShow(e) {
      this.editId = e.id
      this.formEdit.getFieldDecorator('roleName', { initialValue: e.name })
      this.visibleEdit = true
    },
    // 确认修改
    handleOkEdit(e) {
      console.log(e)
      this.formEdit.validateFields(async (err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          try {
            const res = await editRoles([
              { name: values.roleName, id: this.editId }
            ])
            if (res.messageCode === 0) {
              this.$message.success('修改成功')
              this.formEdit.resetFields()
              this.Roles()
              this.visibleEdit = false
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    // 删除角色确认
    async deleteRole(e) {
      console.log(e)
      const res = await deleteRoles([e])
      console.log(res)
      if (res.messageCode === 0) {
        this.$message.success('删除成功！')
        this.Roles()
      } else {
        this.$message.error('删除失败，请稍后重试！')
      }
    },
    // 删除选中
    async deleteAll() {
      console.log(this.deleteAllInfo)
      if (!this.deleteAllInfo) {
        return this.$message.error('请选择要删除的角色')
      } else {
        let n = []
        this.deleteAllInfo.forEach((e, i) => {
          // console.log(e.id)
          n.push(e.id)
        })
        const res = await deleteRoles(n)
        if (res.messageCode === 0) {
          this.$message.success('删除成功！')
          this.Roles()
        } else {
          this.$message.error('删除失败，请稍后重试！')
        }
      }
    }
    // 显示菜单管理
    // editRoleMenu(e) {
    //   console.log(e)
    //   this.visibleMenu = true
    // },
    // // 菜单管理确认
    // handleOkMenu() {},
  },
  computed: {
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
            disabled: record.name === 'Disabled Role', // Column configuration not to be checked
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
