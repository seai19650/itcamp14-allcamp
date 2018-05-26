<template>
  <div v-if="doneQuest != null && quests != null && items != null" id="quests">
    <h2>เควสหลัก</h2>
    <quest
    v-if="quest.quest === 'main' && (!quest.role || quest.role === userRole)"
    v-for="(quest, key) in quests"
    :key="key" :id="key"
    :quest="quest"
    :hasItem="hasItem"
    :energy="quest.requiredEnergy"
    :uid="uid"/>
  </div>
</template>

<script>
import { firestore } from 'firebase'
import Quest from '@/components/Quest'
export default {
  name: 'Quests',
  props: ['doneQuest', 'hasItem', 'uid', 'userRole'],
  components: {Quest},
  data () {
    return {
      quests: null,
      items: null
    }
  },
  mounted () {
    this.getItems()
    this.getQuests()
  },
  methods: {
    getQuests () {
      firestore().collection('quests').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
          if (parseInt(doc.id) >= parseInt(this.nextId)) {
            this.nextId = this.getNextId(parseInt(doc.id))
          }
          let prizeData = []
          Object.keys(tmp[doc.id].prize).forEach(key => {
            let prize = Object.assign({}, this.items[key])
            prize['id'] = key
            prize['count'] = parseInt(tmp[doc.id].prize[key])
            prizeData.push(prize)
          })
          let requiredItemData = []
          Object.keys(tmp[doc.id].requiredItem).forEach(key => {
            let requiredItem = Object.assign({}, this.items[key])
            requiredItem['id'] = key
            requiredItem['count'] = parseInt(tmp[doc.id].requiredItem[key])
            requiredItemData.push(requiredItem)
          })
          tmp[doc.id].prize = prizeData
          tmp[doc.id].requiredItem = requiredItemData
        })
        this.quests = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    getItems () {
      firestore().collection('items').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
        })
        this.items = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
