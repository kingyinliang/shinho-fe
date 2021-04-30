<template>
  <el-table-column :prop="prop" v-bind="$attrs">
    <template #default="scope">
      <span :style="childStyles(scope.row)" @click.prevent="toggleHandle(scope.$index, scope.row)">
          <em :class="iconClasses(scope.row)" :style="iconStyles(scope.row)" />
          {{ scope.row[prop] }}
      </span>
    </template>
  </el-table-column>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import isArray from 'lodash/isArray'

export default defineComponent({
  name: 'TableTreeColumn',
  emits: ['updateData'],
  props: {
    prop: {
      type: String,
      default: ''
    },
    treeKey: {
      type: String,
      default: 'id'
    },
    parentKey: {
      type: String,
      default: 'parentId'
    },
    levelKey: {
      type: String,
      default: '_level'
    },
    childKey: {
      type: String,
      default: 'children'
    }
  },
  setup (props, { emit }) {
    const _this = getCurrentInstance()
    const childStyles = (row) => {
      return {
        'padding-left': (row[props.levelKey] > 1 ? row[props.levelKey] * 7 : 0) + 'px'
      }
    }
    const iconClasses = (row) => {
      return [!row._expanded ? 'el-icon-caret-right' : 'el-icon-caret-bottom']
    }
    const hasChild = (row) => {
      return (isArray(row[props.childKey]) && row[props.childKey].length >= 1) || false
    }
    const iconStyles = (row) => {
      return { visibility: hasChild(row) ? 'visible' : 'hidden' }
    }
    // 切换处理
    const toggleHandle = async (index, row) => {
      if (hasChild(row)) {
        console.log(_this.parent)
        let data = _this.parent.store.states.data.value.slice(0)
        data[index]._expanded = !data[index]._expanded
        if (data[index]._expanded) {
          data = data
            .splice(0, index + 1)
            .concat(row[props.childKey])
            .concat(data)
        } else {
          data = removeChildNode(data, row[props.treeKey])
        }
        emit('updateData', data)
      }
    }

    // 移除子节点
    const removeChildNode = (data, parentId) => {
      const parentIds = isArray(parentId) ? parentId : [parentId]
      if (parentId.length <= 0) {
        return data
      }
      const ids = []
      for (let i = 0; i < data.length; i++) {
        if (parentIds.indexOf(data[i][props.parentKey]) !== -1 && parentIds.indexOf(data[i][props.treeKey]) === -1) {
          ids.push(data.splice(i, 1)[0][props.treeKey])
          i--
        }
      }
      return removeChildNode(data, ids)
    }

    return {
      toggleHandle,
      childStyles,
      iconClasses,
      iconStyles
    }
  }
})
</script>

<style scoped>

</style>
