<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row pt-5 mb-2">
        <div class="col">
          <h1>Session</h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input @change="displaySession" v-model="questId" type="text" class="form-quest">
        </div>
      </div>
    </div>
    <hr>
    <div class="row" v-if="error">
      <div class="col">
        <h3 class="text-muted">{{ error }}</h3>
      </div>
    </div>
    <div v-if="selectedQuest">
      <div class="row">
        <div class="col">
          <h2 class="text-left header">{{ selectedQuest.name }}</h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="text-left mb-0 mt-2 text-info">ไอเทมที่ต้องการ</p>
          <ul>
            <li v-for="item in selectedQuest.requiredItem" :key="item.id">
              <p class="text-left">{{item.name}} : {{item.count}}</p>
            </li>
          </ul>
        </div>
        <div class="col">
          <p class="text-left mb-0 mt-2 text-info">ไอเทมของรางวัล</p>
          <ul>
            <li v-for="item in selectedQuest.prize" :key="item.id">
              <p class="text-left">{{item.name}} : {{item.count}}</p>
            </li>
          </ul>
        </div>
        <div class="col">
          <p class="text-left mb-0 mt-2 text-info">รางวัล Energy</p>
          <p class="text-left">{{ selectedQuest.payEnergy }}</p>
        </div>
      </div>
      <hr>
      <div class="row">
        <player :player="key" :quest="questId" :status="session" :key="key" v-for="(session,key) in sessions[questId]"/>
      </div>
      <div class="row" v-if="emptySession">
        <div class="col">
          ยังไม่มีผู้เข้าร่วม
        </div>
      </div>
      <hr>
      <div class="row mt-3">
        <div class="col">
          <button @click="finishGame" class="btn btn-info">
            จบรอบ (บันทึกผลและเตรียมระบบสำหรับรอบต่อไป)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Player from '@/components/controller/Player'
import { firestore } from 'firebase'
export default {
  name: 'Session',
  components: {Player},
  metaInfo: {
    title: 'Session'
  },
  data () {
    return {
      sessions: {},
      items: null,
      quests: null,
      questId: '',
      selectedQuest: null,
      error: null,
      emptySession: true
    }
  },
  mounted () {
    this.getSessions()
    this.getItems()
    this.getQuests()
  },
  methods: {
    handleState (key) {
      console.log(key)
    },
    getSessions () {
      firestore().collection('sessions').onSnapshot(sessions => {
        let tmp = {}
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
    },
    displaySession () {
      this.isEmptySession()
      this.selectedQuest = null
      if (this.quests[this.questId] !== undefined) {
        this.selectedQuest = this.quests[this.questId]
        this.error = null
      } else {
        this.error = 'Not found'
      }
    },
    finishGame () {
      let winners = []
      Object.keys(this.sessions[this.questId]).forEach((key) => {
        if (this.sessions[this.questId][key]) {
          winners.push(key)
        }
        /* Reverse to Normal Mode */
        firestore().collection('users').doc(key).update({inProcess: null})
      })

      /* Send Prize */
      winners.forEach((winner) => {
        firestore().collection('users').doc(winner).get().then(user => {
          let payload = {
            energy: user.data().energy + this.quests[this.questId].payEnergy,
            item: user.data().item
          }
          this.quests[this.questId].prize.forEach((item) => {
            if (payload.item[item.id]) {
              payload.item[item.id] += item.count
            } else {
              payload.item[item.id] = item.count
            }
          })
          firestore().collection('users').doc(winner).update(payload)
        })
      })
      firestore().collection('sessions').doc(this.questId).set({})
    },
    isEmptySession () {
      this.emptySession = Object.keys(this.sessions[this.questId]).length === 0
    }
  }
}
</script>

<style lang="scss" scoped>
.form-quest {
  border: none;
  border-bottom: 2px solid #000;
  outline: none;
  transition: 0.3s ease;
  text-align: center;
  &:focus {
    transform: scale(1.3)
  }
}
.header {
  border-left: 10px solid #000;
  padding-left: 10px;
}
</style>
