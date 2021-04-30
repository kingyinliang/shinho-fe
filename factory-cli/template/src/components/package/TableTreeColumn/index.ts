import { App } from 'vue'
import TableTreeColumn from './src/index.vue'

TableTreeColumn.install = function (app: App) {
  app.component(TableTreeColumn.name as string, TableTreeColumn)
}

export default TableTreeColumn
