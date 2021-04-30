import { App } from 'vue'
import MdsCard from './src/mds-card.vue'

MdsCard.install = function (app: App) {
  app.component(MdsCard.name as string, MdsCard)
}

export default MdsCard
