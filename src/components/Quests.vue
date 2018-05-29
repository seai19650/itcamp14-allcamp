<template>
  <div v-if="doneQuest != null && quests != null && items != null && sessions != null" id="quests">
    <h2>เควสหลัก</h2>
    <quest
    v-if="quest.quest === 'main' && (!quest.role || quest.role === userRole)"
    v-for="(quest, key) in quests"
    :key="key"
    :id="key"
    :quest="quest"
    :hasItem="hasItem"
    :energy="quest.requiredEnergy"
    :uid="uid"
    :session="sessions[key]"
    :energyGone="energyGone"/>
    <hr>
    <h2>เควสเสริม</h2>
    <div class="row">
      <div class="col-9 pr-0">
        <input placeholder="extra quest code" class="form-styling" type="text" name="quest-code" id="quest-code" v-model="extraQuestId">
      </div>
      <div class="col-3 pl-0">
        <span @click="findExtraQuest" class="find"><p class="mb-0 w-100 text-center">Find</p></span>        
      </div>
    </div>
    <quest
    v-if="extraQuest"
    :quest="extraQuest"
    :hasItem="hasItem"
    :energy="extraQuest.requiredEnergy"
    :id="extraQuestId"
    :session="sessions[extraQuestId]"
    :uid="uid"
    :energyGone="energyGone"/>
  </div>
</template>

<script>
import { firestore } from 'firebase'
import Quest from '@/components/Quest'
export default {
  name: 'Quests',
  props: ['doneQuest', 'hasItem', 'uid', 'userRole', 'energyGone'],
  components: {Quest},
  data () {
    return {
      quests: null,
      items: null,
      sessions: null,
      extraQuestId: null,
      extraQuest: null,
      questError: null
    }
  },
  mounted () {
    this.getItems()
    this.getQuests()
    this.getSessions()
  },
  methods: {
    findExtraQuest () {
      if (this.quests[this.extraQuestId] !== undefined && this.quests[this.extraQuestId].quest !== 'main') {
        this.extraQuest = this.quests[this.extraQuestId] 
        this.questError = null
      } else {
        this.extraQuest = null
        this.questError = 'ไม่พบเควส'
      }
    },
    getSessions () {
      let tmp = {}
      firestore().collection('sessions').onSnapshot(sessions => {
        sessions.forEach((session) => {
          tmp[session.id] = session.data()
        })
        this.sessions = tmp
      })
    },
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
.form-styling {
  width: 100%;
  height: 35px;
	border: none;
	border-radius: 20px 0 0 20px;
  margin-bottom: 20px;
  background: rgba(161, 161, 161, 0.2);
  outline: none;
  text-align: center;
}

span.find {
  background: linear-gradient(90deg,#323598 10%,#5155fe 90%);
  color: #fff;
  height: 35px;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
  display: block;
  position: relative;
  p {
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}

</style>
