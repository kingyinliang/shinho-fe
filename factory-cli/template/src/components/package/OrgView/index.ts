import { App } from 'vue'
import OrgView from './src/index.vue'

OrgView.install = function (app: App) {
  app.component(OrgView.name as string, OrgView)
}

export default OrgView
