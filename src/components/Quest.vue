<template>
  <div v-if="energy" class="quest row">
    <div class="pl-2 col-9 name text-left">
      <span class="text-info">{{ id }}</span> | {{quest.name}}
    </div>
    <div :class="['col-3 trade', {'done': isDone}, {'not-accept': (!isAccept && !isDone) || energyGone}]" @click="active = true"><i class="fas fa-angle-right"></i></div>
    <div v-if="active" class="overlay">
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>{{quest.name}}</h1>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <p>{{quest.description}}</p>
              <hr>
              <div class="row">
                <div class="col">
                  <h5 class="text-info">NPC</h5>
                  <p class="mb-0">{{ quest.npc }}</p>
                </div>
                <div class="col">
                  <h5 class="text-info">สถานที่รับเควส</h5>
                  <p class="mb-0">{{ quest.place }}</p>
                </div>
              </div>
              <hr>
              <ul class="list-unstyled">
                <li><b>ใช้ {{quest.requiredEnergy}}</b> energy</li>
                <li v-if="quest.redo">สามารถทำซ้ำได้</li>
                <li v-else>ไม่สามารถทำซ้ำได้</li>
                <li v-if="quest.flush">หักไอเทมและ energy</li>                         
              </ul>
              <hr>
              <h5 class="text-info">ไอเทมที่ต้องการ</h5>
              <p class="m-1 text-muted" v-if="quest.requiredItem.length === 0">ไม่มีไอเทมที่ต้องการ</p>
              <p v-else :class="['m-1']" v-for="data in quest.requiredItem" :key="data.id">{{data.name}} : {{data.count}}</p>
              <hr>
              <h5 class="text-info">ของรางวัล</h5>
              <p class="m-1 text-muted" v-if="quest.prize.length === 0">ไม่มีของรางวัล</p>
              <p v-else :class="['m-1']" v-for="(data,key) in quest.prize" :key="key">{{data.name}} : {{data.count}}</p>
              <hr>
              <h5 class="text-info">รางวัล Energy</h5>
              <p class="m-1">{{ quest.payEnergy }}</p>
              <hr>
            </div>
          </div>
          <div class="row">
            <div v-if="!isFull" class="col">
              <p>เควสนี้รับได้
                <span class="font-weight-bold">{{ quest.max }}</span> คนต่อรอบ</p>
              <p class="mb-0">ขณะนี้มีผู้เล่น
                <span class="font-weight-bold">{{ playerCount }}</span> คน</p>
            </div>
          </div>
          <hr v-show="!isFull">
          <div class="row">
            <div class="col">
              <p class="mb-0" v-if="(!isAccept && !isDone) || energyGone">ไม่สามารถรับเควสนี้ได้เนื่องจากไอเทม หรือ energy ไม่ตรงตามเงื่อนไข</p>
              <p class="mb-0" v-else-if="session.playing">เควสนี้ได้เริ่มไปแล้ว</p>
              <p class="mb-0" v-else-if="isFull">เควสนี้มีผู้ร่วมเล่นในรอบนี้ครบแล้ว</p>
              <p class="mb-0" v-else-if="isDone">เคยทำเควสนี้ไปแล้ว</p>
              <p class="mb-0" v-else>กดรับเควสข้างล่างเพื่อดำเนินการ</p>
            </div>
          </div>
          <hr>
          <div class="row" v-if="!isDone && !energyGone">
            <div class="col" v-if="isAccept && !isFull && !session.playing">
              <button @click="inGame" style="background-color: rgb(3, 54, 129)" class="btn btn-spread">รับเควส</button>
            </div>
            <div class="col">
              <button style="background-color: rgb(59, 59, 59)" class="btn btn-spread" @click="abort">ปิด</button>
            </div>
          </div>
          <div class="row" v-else>
            <div class=" col">
            </div>
            <div class="col">
              <button style="background-color: rgb(59, 59, 59)" class="btn btn-spread" @click="abort">ปิด</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { firestore } from 'firebase'
export default {
  name: 'Quest',
  props: ['quest', 'hasItem', 'id', 'energy', 'uid', 'session', 'energyGone'],
  data () {
    return {
      active: false,
      trade: false,
      user: {
        doneQuest: []
      }
    }
  },
  mounted () {
    this.getUserData()
  },
  methods: {
    abort () {
      this.active = false
      this.trade = false
    },
    inGame () {
      if (!this.isAccept) return
      let player = {}
      player[this.user.uid] = false

      firestore().collection('users').doc(this.user.uid).update(
        {
          inProcess: {
            controlable: false,
            header: 'อยู่ในเควส',
            msg: 'กำลังเข้าร่วมเควส "' + this.quest.name + '"',
            data: this.quest.description
          }
        }
      )
      if (!this.quest.redo) {
        this.user.doneQuest.push(this.id)
      }

      if (this.quest.flush) {
        this.quest.requiredItem.forEach((ritem) => {
          this.hasItem[ritem.id] -= ritem.count
        })
      }
      firestore().collection('users').doc(this.user.uid).update({item: this.hasItem})

      firestore().collection('users').doc(this.user.uid).update({
        energy: this.user.energy - this.quest.requiredEnergy,
        doneQuest: this.user.doneQuest
      })
      firestore().collection('sessions').doc(this.id).update(player)
    },
    getUserData () {
      firestore().collection('users').doc(this.uid).onSnapshot(user => {
        this.user = user.data()
      })
    }
  },
  computed: {
    isAccept () {
      let requiredItem = {}
      this.quest.requiredItem.forEach((item) => {
        requiredItem[item.id] = item.count
      })

      /* assume that player can join then check against it */
      let state = true
      Object.keys(requiredItem).forEach((item) => {
        if (this.hasItem[item] === undefined || this.hasItem[item] < requiredItem[item]) {
          state = false
        }
      })
      if (this.user.energy < this.energy) {
        state = false
      }
      return state
    },
    isDone () {
      if (this.user.doneQuest.includes(this.id)) return true
      else return false
    },
    isFull () {
      let count = 0
      Object.keys(this.session).forEach((user) => {
        if (this.session[user] === null) {
          count += 1
        }
      })
      if (Object.keys(this.session).length - count <= this.quest.max) {
        return false
      }
      return true
    },
    playerCount () {
      let count = 0
      Object.keys(this.session).forEach((user) => {
        if (this.session[user] === null) {
          count += 1
        }
      })
      return Object.keys(this.session).length - 1 - count
    }
  }
}
</script>

<style lang="scss" scoped>
.quest {
  overflow: hidden;
  margin: 1em 0;
  border-radius: 0.25em;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  .img-item {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
  }
  .name {
    padding: 1em 0.2em;
  }
  .trade {
    background-color: rgb(3, 54, 129);
    color: #fff;
    padding: 0.5em;
    border-radius: 0 0.25em 0.25em 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
  .not-accept {
    filter: grayscale(1)
  }
  .done {
    background-color: rgb(0, 121, 10);
  }
}
</style>
