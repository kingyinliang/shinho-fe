<template>
  <mds-card :title="title" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="org-card">
          <div class="org-card_title">
            组织架构一览
          </div>
          <div class="filter-input">
            <el-input v-model="filterText" placeholder="部门名称" size="small">
              <template #suffix>
                <em class="el-input__icon el-icon-search" />
              </template>
            </el-input>
          </div>
          <div class="tree-main SelfScrollbar">
            <el-tree
              ref="treeRef"
              :data="OrgTree"
              node-key="id"
              :props="{ label: 'deptName' }"
              :expand-on-click-node="false"
              :default-expanded-keys="arrList"
              highlight-current
              :filter-node-method="filterNode"
              @node-click="treeNodeClick"
              @node-contextmenu="treeNodeContextMenu"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="org-card">
          <div class="org-card_title">
            {{ rightTitle }}
          </div>
          <div class="detail-main SelfScrollbar">
            <slot name="view" />
          </div>
        </div>
      </el-col>
    </el-row>
  </mds-card>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, watch } from 'vue'
import { ORG_TREE_API } from '@/api/api'

interface DeptObject {
  id: string;
  deptName: string;
  children: DeptObject[];
}
export default defineComponent({
  name: 'OrgView',
  emits: ['getTreeSuccess', 'treeNodeClick', 'treeNodeContextMenu'],
  props: {
    title: {
      type: String,
      default: function () {
        return '标题'
      }
    },
    rightTitle: {
      type: String,
      default: function () {
        return '标题'
      }
    }
  },
  setup (props, { emit }) {
    const filterText = ref('')
    const OrgTree = ref([] as DeptObject[])
    const arrList = ref([] as string[])
    const treeRef = ref()

    const getTree = (extendId = '') => {
      ORG_TREE_API({
        factory: 'common'
      }).then(async ({ data }) => {
        OrgTree.value = data.data
        if (extendId !== '') {
          arrList.value = [extendId]
        } else {
          arrList.value = [OrgTree.value[0].children[0]?.id]
          await nextTick()
          treeRef.value.setCurrentKey('1')
        }
        emit('getTreeSuccess', data.data)
      })
    }
    // 搜索
    const filterNode = (value:string, data:DeptObject) => {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    }

    // 组织架构点击
    const treeNodeClick = (row: DeptObject) => {
      emit('treeNodeClick', row, true)
    }

    // 组织架构右击
    const treeNodeContextMenu = (event: MouseEvent, object: DeptObject) => {
      emit('treeNodeContextMenu', event, object)
    }

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })
    onMounted(() => {
      getTree()
    })
    return {
      filterText,
      OrgTree,
      filterNode,
      treeNodeClick,
      treeNodeContextMenu,
      arrList,
      treeRef
    }
  }
})
</script>

<style scoped lang="scss">

</style>
