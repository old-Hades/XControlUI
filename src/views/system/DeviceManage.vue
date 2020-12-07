<template>
  <div class="box">
    <div class="left">
      <a-tree :tree-data="treeData" :replaceFields="replaceFields" show-icon @select="clickTreeNode" @expand="onExpand" :default-expanded-keys="this.expandedKeys" default-expand-all v-if="!spinning">
        <a-spin :spinning="spinning" />
      </a-tree>
    </div>
    <div class="right">
      <a-upload accept=".xlsx" :action="UploadUrl + 'systemConfig/deviceManage/importData'" name="file" :multiple="true" :headers="headers" @change="uploadChange">
        <a-button type="primary" icon="upload">上传数据</a-button>
      </a-upload>
      <a-button type="primary" icon="download" @click="downloadFile">下载数据</a-button>
      <a-button type="primary" @click="showModal">
        编辑
      </a-button>
      <br /><br />

      <a-descriptions title="区域信息" bordered :column="{ xxl: 4, xl: 1, lg: 1, md: 1, sm: 2, xs: 1 }" v-if="this.showContent === 'zone'" v-model="zoneData">
        <a-descriptions-item label="区域名称">{{ zoneData.name }}</a-descriptions-item>
        <a-descriptions-item label="简称">{{ zoneData.aliasName }}</a-descriptions-item>
        <a-descriptions-item label="洁净室ID">{{ zoneData.cleanRoomId }}</a-descriptions-item>
        <a-descriptions-item label="串口服务器名称">{{ zoneData.serialDeviceServerName }}</a-descriptions-item>
        <a-descriptions-item label="串口服务器IP">{{ zoneData.serialDeviceServerIp }}</a-descriptions-item>
        <a-descriptions-item label="串口起始端口">{{ zoneData.serialDeviceServerStartPort }}</a-descriptions-item>
      </a-descriptions>

      <a-modal title="修改区域信息" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
        <a-form-model ref="checkForm" :model="zoneData">
          <a-form-model-item label="区域名称">
            <a-input v-model="zoneData.name" />
          </a-form-model-item>
          <a-form-model-item label="简称">
            <a-input v-model="zoneData.aliasName" />
          </a-form-model-item>
          <a-form-model-item label="串口服务器名称">
            <a-input v-model="zoneData.serialDeviceServerName" />
          </a-form-model-item>
          <a-form-model-item label="串口服务器IP">
            <a-input v-model="zoneData.serialDeviceServerIp" />
          </a-form-model-item>
          <a-form-model-item label="串口起始端口">
            <a-input v-model="zoneData.serialDeviceServerStartPort" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-descriptions title="风机组信息" bordered :column="{ xxl: 4, xl: 1, lg: 1, md: 1, sm: 2, xs: 1 }" v-if="this.showContent === 'group'" v-model="groupData">
        <a-descriptions-item label="风机组名称">
          {{ groupData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="简称">{{ groupData.aliasName }}</a-descriptions-item>
        <a-descriptions-item label="端口序号">{{ groupData.serialDeviceServerPortIndex }}</a-descriptions-item>
        <a-descriptions-item label="区域ID">{{ groupData.cleanZoneId }}</a-descriptions-item>
        <a-descriptions-item label="协议">{{ groupData.protocol == 1 ? 'OTHER' : 'EBM' }}</a-descriptions-item>
        <a-descriptions-item label="风机列表">
          <a-button icon="search" @click="setFan(groupData.id)">查看</a-button>
        </a-descriptions-item>
      </a-descriptions>
      <a-modal title="风机列表" :visible="fanEditVisible" @cancel="fanEditVisible = false" @ok="fanEditVisible = false" width="100" centered :footer="null">
        <a-table :columns="ebmFanColumns" :data-source="ebmFanData">
          <a slot="name" slot-scope="text">{{ text }}</a>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => save(record)">保存</a>
                <a @click="cancel(record)">取消</a>
              </span>
              <span v-else>
                <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
              </span>
            </div>
          </template>
        </a-table>
      </a-modal>
      <a-modal title="修改风机组信息" :visible="visible2" :confirm-loading="confirmLoading" @ok="handleOk2" @cancel="handleCancel">
        <a-form-model ref="checkForm" :model="groupData">
          <a-form-model-item label="风机组名称">
            <a-input v-model="groupData.name" />
          </a-form-model-item>
          <a-form-model-item label="简称">
            <a-input v-model="groupData.aliasName" />
          </a-form-model-item>
          <a-form-model-item label="端口序号">
            <a-input v-model="groupData.serialDeviceServerPortIndex" />
          </a-form-model-item>
          <a-form-model-item label="协议">
            <a-select placeholder="请选择" class="sel" @change="handleChange">
              <template v-for="(item, i) in this.val">
                <a-select-option :key="i" :value="item" :title="i">{{ i }}</a-select-option>
              </template>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { serverUrl } from '../../utils/config'
import { getToken } from '../../utils/auth'
import { getDeviceTree, exportData, getCleanZoneDetail, getFFUGroup, getFanDetail } from '../../services/device'
import { upZone, upffu, getProtocol } from '../../services/system'
import { formatTree, getExcel } from '../../utils/baseutil'
const ebmFanColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '简称',
    dataIndex: 'aliasName',
    key: 'aliasName',
  },
  {
    title: '设备地址',
    dataIndex: 'deviceAddress',
    key: 'deviceAddress',
  },
  {
    title: '组地址',
    dataIndex: 'groupAddress',
    key: 'groupAddress',
  },
  {
    title: 'X',
    dataIndex: 'centerX',
    key: 'centerX',
  },
  {
    title: 'Y',
    dataIndex: 'centerY',
    key: 'centerY',
  },
  {
    title: '宽度',
    dataIndex: 'width',
    key: 'width',
  },
  {
    title: '高度',
    dataIndex: 'height',
    key: 'height',
  },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
]
export default {
  data() {
    return {
      size: 'small',
      showContent: 'zone',
      zoneData: '',
      groupData: '',
      treeData: [],
      spinning: true,
      searchValue: '',
      autoExpandParent: true,
      expandedKeys: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id',
      },
      ModalText: '',
      visible: false,
      visible2: false,
      fanEditVisible: false,
      confirmLoading: false,
      val: '',
      value: '',
      ebmFanData: [],
      ebmFanColumns,
      headers: {
        Authorization: getToken(),
      },
      UploadUrl: serverUrl.baseUrl,
    }
  },
  methods: {
    downloadFile() {
      exportData().then((res) => {
        getExcel(res, 'XControl-config.xlsx')
      })
    },
    setFan(id) {
      this.fanEditVisible = true
      this.ebmFanData = null
      getFanDetail(id).then((res) => {
        this.ebmFanData = res.data
      })
    },
    clickTreeNode(keys, event) {
      // console.log(keys);
      let key = keys[0]
      if (key.startsWith('zone-')) {
        this.showContent = 'zone'
        getCleanZoneDetail(key.substring(key.lastIndexOf('-') + 1, key.length)).then((res) => {
          this.zoneData = res.data
          this.groupData = {}
        })
      } else if (key.startsWith('group-')) {
        this.showContent = 'group'
        getFFUGroup(key.substring(key.lastIndexOf('-') + 1, key.length)).then((res) => {
          this.groupData = res.data
          this.zoneData = {}
        })
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      // this.autoExpandParent = false;
    },
    showModal() {
      if (Object.keys(this.zoneData).length) {
        this.visible = true
      }
      if (Object.keys(this.groupData).length) {
        this.visible2 = true
      }
    },
    async handleOk(e) {
      await upZone(this.zoneData).then((res) => {
        this.confirmLoading = true
        this.visible = false
        this.confirmLoading = false
      })
      await getDeviceTree().then((res) => {
        // console.log(res);
        let data = res.data
        this.treeData = formatTree(data)
      })
    },
    handleChange(value) {
      // console.log(value);
      this.value = value
    },
    async handleOk2() {
      this.groupData.protocol = this.value
      // console.log(this.groupData,111)
      await upffu(this.groupData).then((res) => {
        this.confirmLoading = true
        this.visible2 = false
        this.confirmLoading = false
      })
      await getDeviceTree().then((res) => {
        // console.log(res);
        let data = res.data
        this.treeData = formatTree(data)
      })
    },
    handleCancel(e) {
      this.visible = false
      this.visible2 = false
    },
    Strategy() {
      var that = this
      getProtocol().then((res) => {
        that.val = res.data
        // console.log(this.value);
      })
    },
    uploadChange(info) {
      console.log(info)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      getDeviceTree().then((res) => {
        let data = res.data
        this.treeData = formatTree(data)
        this.spinning = false
      })
    })
    this.Strategy()
  },
}
</script>

<style scoped lang="less">
.box {
  display: flex;
}

.left {
  width: 30%;
}

.right {
  width: 60%;
}
.ant-descriptions-item-label {
  width: 50% !important;
}
/deep/.right {
  .ant-btn {
    margin-right: 15px;
  }
  .ant-upload-list {
    display: none;
  }
}
</style>
