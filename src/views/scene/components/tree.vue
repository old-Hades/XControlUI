<template>
  <div>
    <a-tree
      :load-data="onLoadData"
      @select="onSelect"
      @check="onCheck"
      show-icon
      :tree-data="treeData"
      :replace-fields="replaceFields"
    >
      <img
        class="smile"
        slot="smile"
        src="@/assets/floor/洁净ikcon@2x.png"
        alt=""
      />
      <img
        class="smile"
        slot="meh"
        src="@/assets/floor/洁净ikcon@2x.png"
        alt=""
      />
      <img
        class="smile"
        slot="custom"
        src="@/assets/floor/洁净区域@2x.png"
        alt=""
      />

      <template slot="next">
        <img
          class="smile"
          slot="next"
          src="@/assets/floor/停机-颜色提示@2x.png"
          alt=""
        />
      </template>
    </a-tree>
  </div>
</template>
<script>
import { lazyDeviceTree } from '@/services/Floor.js'
export default {
  props: {
    id_order: {
      type: [Number]
    }
  },
  data() {
    return {
      replaceFields: {
        children: 'children',
        title: 'name'
      },
      kname: 'xyy',
      treeData: [
        {
          name: '--',
          key: '0',
          scopedSlots: {
            icon: 'smile'
          }
        }
      ],
      pid: null,
      num: 0
    }
  },
  created() {
    console.log('room-' + this.id_order)
    lazyDeviceTree({
      pid: 0,
      dynamic: false
    }).then(res => {
      console.log(res)
      res.data.forEach(e => {
        console.log(e.id)
        if (e.id === 'room-' + this.id_order) {
          this.treeData[0].key = e.id
          this.treeData[0].name = e.name
        }
      })
    })
  },
  methods: {
    onSelect(selectedKeys, info) {
      console.log(selectedKeys)
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
    },
    onLoadData(treeNode) {
      if (!this.pid) {
        this.pid = this.treeData[0].key
      } else {
        this.pid = treeNode.dataRef.id
      }
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        lazyDeviceTree({
          pid: this.pid,
          dynamic: false
        }).then(res => {
          console.log(res)
          if (!res.data) {
            resolve()
            return
          }
          res.data.forEach(e => {
            let r = e.id.split('-')[0]
            if (r === 'room') {
              e.scopedSlots = {
                icon: 'smile'
              }
            } else if (r === 'zone') {
              e.scopedSlots = {
                icon: 'custom'
              }
            } else if (r === 'group') {
              e.scopedSlots = {
                icon: 'custom'
              }
            } else if (r === 'ebmffu') {
              e.scopedSlots = {
                icon: 'next'
              }
              e.isLeaf = true
            }
            e.key = e.id
          })
          treeNode.dataRef.children = res.data
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.smile {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
// /deep/.ant-tree-node-content-wrapper {
//   position: relative;
// }
// .current {
//   position: absolute;
//   right: -26px;
//   top: 5px;
// }
</style>
