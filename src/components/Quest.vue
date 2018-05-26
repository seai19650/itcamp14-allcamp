<template>
  <div v-if="energy" class="quest row">
    <div class="pl-2 col-9 name text-left">{{ id }} | {{quest.name}}</div>
    <div :class="['col-3 trade', {'done': isDone}, {'not-accept': !isAccept && !isDone}]" @click="active = true">&#9974;</div>
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
              <p>
                ใช้ <b>{{quest.requiredEnergy}}</b> energy
                <span v-if="quest.redo"> | สามารถทำซ้ำได้</span>
                <span v-else> | ไม่สามารถทำซ้ำได้</span>
                <span v-if="quest.flush"> | หักไอเทมและ energy</span>
              </p>
              <hr>
              <h5 class="text-info">ไอเทมที่ต้องการ</h5>
              <p class="m-1 text-muted" v-if="quest.requiredItem.length === 0">ไม่มีไอเทมที่ต้องการ</p>
              <p v-else
              :class="['m-1']"
              v-for="data in quest.requiredItem"
              :key="data.id">{{data.name}} : {{data.count}}</p>
              <hr>
              <h5 class="text-info">ของรางวัล</h5>
              <p class="m-1 text-muted" v-if="quest.prize.length === 0">ไม่มีของรางวัล</p>
              <p v-else :class="['m-1']" v-for="(data,key) in quest.prize" :key="key">{{data.name}} : {{data.count}}</p>
              <hr>
            </div>
          </div>
          <div class="row" v-if="!isAccept && !isDone">
            <div class="col">
              <p>ไม่สามารถรับเควสนี้ได้เนื่องจากไอเทม หรือ energy ไม่ตรงตามเงื่อนไข</p>
            </div>
          </div>
          <div class="row" v-if="!isDone">
            <div class="col" v-if="isAccept">
              <button @click="inGame" style="background-color: rgb(3, 54, 129)" class="btn btn-spread">รับเควส</button>
            </div>
            <div class="col">
              <button style="background-color: rgb(59, 59, 59)" class="btn btn-spread" @click="abort">ปิด</button>
            </div>
          </div>
          <div class="row" v-else>
            <div class="col">
              <p>ได้เคยทำเควสนี้ไปแล้ว</p>
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
  props: ['quest', 'hasItem', 'id', 'energy', 'uid'],
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

      if (!this.quest.redo) {
        this.user.doneQuest.push(this.id)
      }

      if (this.quest.flush) {
        this.quest.requiredItem.forEach((ritem) => {
          this.hasItem[ritem.id] -= ritem.count
          let item = {}
          item[ritem.id] = this.hasItem[ritem.id]
          firestore().collection('users').doc(this.user.uid).update({item})
        })
      }
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

      /* assume that player can join then check against it*/
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  background: rgba(0,0,0,0.8);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    width: 90vw;
    max-width: 600px;
    background: #fff;
    border-radius: 0.25em;
    position: relative;
    display: block;
  }
  .img-info {
    max-width: 250px;
    height: auto;
  }
  .desc {
    margin-top: 2px;
  }
  .btn-group {
    margin-bottom: 3px;
    .btn {
      margin: 3px;
      float: left;
      position: relative;
      display: block;
      border: none;
      padding: 1em 2em;
      color: #fff;
      border-radius: 0.25em;
      text-align: center;
    }
  }
}
</style>
