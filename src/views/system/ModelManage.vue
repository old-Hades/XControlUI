<template>
  <div id="container">
    <div class="top">
      <div class="left">
        <a-upload-dragger
          name="file"
          :multiple="true"
          :action="ModelUrl + 'systemConfig/modelManage/cadModelImport'"
          @change="handleChange"
          :before-upload="beforeUpload"
          method="post"
          :showUploadList="false"
          accept=".dxf"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="upload" />
          </p>
          <p class="ant-upload-text">
            将文件拖到此处或点击上传
          </p>
          <p class="ant-upload-hint">
            支持单次或批量上传 仅支持dxf文件。
          </p>
        </a-upload-dragger>
      </div>
      <div class="right">
        <a-table :columns="columns" :dataSource="data">
          <span slot="customTitle">当前任务</span>
          <span slot="status" slot-scope="status">
            <a-tag v-for="tatus in status" :key="tatus" :class="status == '上传完成' ? 'finish' : 'begin'">
              {{ status }}
            </a-tag>
          </span>
        </a-table>
      </div>
    </div>
    <div class="bottom">
      <a-table :columns="columns2" :dataSource="data2" :pagination="false" :rowKey="(row) => row.key">
        <a slot="id" slot-scope="text">{{ text }}</a>
        <span slot="customTitle">ID</span>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm v-if="data2.length" title="是否确定删除?" @confirm="() => delcleanRoom(record)" okText="确定">
            <a-icon type="close" :style="{ fontSize: '24px', color: '#CC0000' }" />
          </a-popconfirm>
          <a-icon type="arrow-up" :style="{ fontSize: '24px', color: '#1E90FF' }" @click="upclean(record)" />
        </span>
      </a-table>
      <a-pagination v-model="start" show-size-changer :page-size.sync="limit" :total="total" />
      <a-drawer title="自定义上传背景" :width="550" :visible="visible" @close="onClose">
        <a-form :form="ruleForm" layout="vertical" hide-required-mark ref="ruleForm">
          <a-row>
            <a-col :span="18">
              <a-form-item label="背景图片">
                <a-upload :action="ModelUrl + 'systemConfig/modelManage/cadModelImport'" list-type="picture-card" :file-list="fileList" @preview="handlePreview" @change="handleChangeImage">
                  <div v-if="fileList.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                      Upload
                    </div>
                  </div>
                </a-upload>
                <img :src="'data:image/png;base64,' + info.bgPicture" alt="" srcset="" class="imageBg" />
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="18">
              <a-form-item label="画面名称">
                <a-input v-model="info.name" placeholder="画面名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="18">
              <a-form-item label="背景高度/px">
                <a-input v-model="info.bgHeight" placeholder="请输入背景高度" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="18">
              <a-form-item label="背景宽度/px">
                <a-input v-model="info.bgWidth" placeholder="请输入背景宽度" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="18">
              <a-form-item label="图片模式">
                <a-select v-model="info.bgPictureMode" placeholder="请选择图片模式">
                  <a-select-option value="0">
                    拉伸
                  </a-select-option>
                  <a-select-option value="1">
                    居中
                  </a-select-option>
                  <a-select-option value="2">
                    平铺
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="18">
              <a-form-item label="背景透明度">
                <a-input v-model="info.opacity" type="Number" max="1" min="0" placeholder="背景透明度(0~1之间)" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="18">
              <a-form-item label="排序">
                <a-input v-model="info.sort" type="Number" placeholder="排序(0~？之间)" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <a-form-item label="背景颜色">
                <sketch-picker v-model="colors" @input="updateValue"></sketch-picker>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 25px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-form>
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
              Cancel
            </a-button>
            <a-button type="primary" @click="submitForm(ruleForm)">
              Submit
            </a-button>
          </a-form>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { getRoom, delRoom, upclean } from '../../services/system'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { Sketch } from 'vue-color'
import { serverUrl } from '../../utils/config'
import { getToken } from '../../utils/auth'
const columns = [
  {
    dataIndex: 'currentTaskId',
    key: 'currentTaskId',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'currentTaskId' },
  },
  {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    style: {
      color: '#000',
    },
  },
]
const columns2 = [
  {
    dataIndex: 'id',
    key: 'id',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '画面名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
  },

  {
    title: '透明度',
    dataIndex: 'opacity',
    key: 'opacity',
  },
  {
    title: '背景颜色',
    dataIndex: 'bgColor',
    key: 'bgColor',
  },
  {
    title: '背景高度',
    dataIndex: 'bgHeight',
    key: 'bgHeight',
  },
  {
    title: '背景宽度',
    dataIndex: 'bgWidth',
    key: 'bgWidth',
  },
  {
    title: '图片模式',
    dataIndex: 'bgPictureMode',
    key: 'bgPictureMode',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
]

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'ModelManage',
  data() {
    return {
      data: [],
      stompClient: null,
      columns,
      data2: [],
      columns2,
      form: this.$form.createForm(this),
      visible: false,
      ruleForm: this.$form.createForm(this),
      colors: {
        hex: '#000',
        a: 1,
      },
      color: null,
      colorShow: false,
      bg: {},
      start: 1, // 页
      limit: 10, // 数量
      total: 0, // 总数量
      previewVisible: false,
      previewImage: '',
      fileList: [],
      info: {},
      opacity: null,
      ModelUrl: serverUrl.baseUrl,
      wsUrl: serverUrl.wsUrl,
    }
  },
  mounted() {
    this.getcleanRoom()
    this.initWebSocket()
  },
  components: {
    'sketch-picker': Sketch,
  },
  watch: {
    start(val) {
      console.log(val)
      this.getcleanRoom()
    },
    limit(val) {
      console.log(val)
      this.getcleanRoom()
    },
  },
  methods: {
    beforeUpload(file) {
      console.log(file)
      const isDxf = file.name.endsWith('dxf')
      if (!isDxf) {
        this.$message.error('仅支持Dxf文件!')
      }
      return isDxf
    },
    handleChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`)
      } else if (status === 'error') {
        this.$message.error('上传失败')
      }
    },
    async getcleanRoom() {
      var that = this
      await getRoom({ start: this.start, limit: this.limit, condition: 1 }).then((res) => {
        console.log(res)
        this.data2 = res.data
        if (res.total) {
          this.total = res.total
        }
        for (let i = 0; i < this.data2.length; i++) {
          if (this.data2[i].bgPictureMode == 0) {
            this.data2[i].bgPictureMode = '拉伸'
          } else if (this.data2[i].bgPictureMode == 1) {
            this.data2[i].bgPictureMode = '居中'
          } else {
            this.data2[i].bgPictureMode = '平铺'
          }
        }
        // console.log(this.data2);

        this.data2.forEach(function(value, index) {
          that.key = value.id
        })
      })
    },
    delcleanRoom(info) {
      delRoom(info.id).then(() => {
        // console.log("删除");
        this.getcleanRoom()
      })
      this.$message.info('删除成功')
    },
    initWebSocket() {
      this.connection()
      // 需要有一个失败重连得到问题
    },
    connection() {
      var that = this
      const socket = new WebSocket(this.wsUrl)
      this.stompClient = Stomp.over(socket)
      //建立连接，订阅主题
      this.stompClient.connect({ Authorization: getToken() }, (frame) => {
        this.stompClient.subscribe('import-cad-file-condition', (res) => {
          res.body = JSON.parse(res.body)
          if (res.body.status === 0) {
            res.body.status = ['正在解析']
          } else if (res.body.status === 1) {
            res.body.status = ['解析成功']
          } else if (res.body.status === 2) {
            res.body.status = ['解析失败']
          }
          this.data.push(res.body)
          console.log(this.data)
        })
      })
    },
    upclean(info) {
      console.log(info)
      this.bg = info.id
      this.info = info
      console.log(this.info)
      this.colors.hex = this.info.bgColor

      setTimeout(() => {
        this.visible = true
      }, 100)
    },
    onClose() {
      this.bg = {}
      this.ruleForm.resetFields()
      this.visible = false
    },
    updateValue(val) {
      // console.log("颜色选择", val);
      this.color = val.hex
      // console.log(this.color)
    },
    async submitForm(formName) {
      console.log(this.info)
      let imgUrl = null
      try {
        if (this.fileList) {
          imgUrl = this.fileList[0].thumbUrl.substr(22)
        } else {
          imgUrl = this.info.bgPicture
        }
      } catch (error) {
        console.log(error)
      }

      const params = {
        bgPicture: imgUrl,
        bgHeight: this.info.bgHeight,
        bgWidth: this.info.bgWidth,
        bgPictureMode: this.info.bgPictureMode,
        opacity: this.info.opacity - 0,
        bgColor: this.color || this.info.bgColor,
        id: this.info.id,
        sort: this.info.sort,
        name: this.info.name,
      }
      if (params.bgPictureMode === '平铺') {
        params.bgPictureMode = 2
      } else if (params.bgPictureMode === '居中') {
        params.bgPictureMode = 1
      } else if (params.bgPictureMode === '拉伸') {
        params.bgPictureMode = 0
      }
      console.log(params)
      try {
        await upclean(params).then((res) => {
          console.log(res)
          if (res.msgCode === 0) {
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败，请稍后重试')
          }
          this.info = {}
          this.colors.hex = '#000'

          function ownSort(a, b) {
            //通过比较ab对象的initial 来确认返回的是0还是大于0的书
            if (a.sort <= b.sort) {
              //如果a对象的initial小于并等于b对象，那么a对象就应该b对象的前面，所以返回0
              return 0
            } else {
              //如果b.initial要小于a.initial,那么b对象应该在a对象的前面，所以返回大于0的数字
              return 1
            }
          }
          this.data2.sort(ownSort)
          console.log(this.data2)
          this.visible = false
        })
        this.getcleanRoom()
      } catch (error) {
        console.log(error)
      }
    },

    handleCancel() {
      this.info = {}
      this.previewVisible = false
    },
    async handlePreview(file) {
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    async handleChangeImage({ fileList }) {
      console.log(fileList)
      this.fileList = fileList
    },
  },
  // beforeDestroy() {
  //   Stomp.over()
  // },
}
</script>

<style scoped>
.top {
  display: flex;
  margin-bottom: 30px;
}
.left {
  width: 40%;
}
.right {
  width: 50%;
  /* border: solid 1px; */
  margin-left: 20px;
}

.finish {
  color: rgb(167, 59, 59);
  background: rgba(221, 86, 86, 0.3);
}
.begin {
  color: green;
  background: rgba(101, 190, 131, 0.3);
}
.ant-pagination {
  margin-top: 20px;
}
.imageBg {
  width: 100px;
  height: 100px;
}
</style>
