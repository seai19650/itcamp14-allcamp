<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row pt-5 mb-2">
        <div class="col">
          <h1>Assigner</h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input @click="selectedPlayer = null" @change="displayPlayer" v-model="playerId" type="text" class="form-id">
        </div>
      </div>
      <hr>
      <div v-if="error" class="row">
        <div class="col">
          <h3 class="text-muted">{{ error }}</h3>
        </div>
      </div>
      <div v-if="selectedPlayer" class="row mb-3">
        <div class="col-12 col-lg-6">
          <profile :id="selectedPlayer.uid" />
        </div>
        <div class="col-12 col-lg-6 p-3 my-3 my-md-5" id="control-assigner">
          <div class="row">
            <div class="col">
              <h3>เพิ่มไอเทม</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label for="itemId">ไอเทม</label>
                <select v-model="add.id" class="form-control" name="itemId" id="itemId">
                  <option :key="key" v-for="(item, key) in items" :value="key">{{ item.name }}</option>
                </select>
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label for="quantity">จำนวน</label>
                <input @keypress="numberOnly" v-model="add.quantity" class="form-control" type="number" name="quantity" id="quantity"/>
              </div>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col">
                  <button @click="handleItem(true)" class="mt-2 btn btn-info btn-spread">
                    เพิ่ม
                  </button>
                </div>
                <div class="col">
                  <button @click="handleItem(false)" class="mt-2 btn btn-danger btn-spread">
                    ลด
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col">
              <h3>เพิ่ม/ลด Energy</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label for="step">Step</label>
                <input type="number" @keypress="numberOnly" v-model="stepEnergy" class="form-control" name="step" id="step">
              </div>
            </div>
            <div class="col-12">
              <div class="row">
                <div class="col">
                  <button @click="handleEnergy(true)" class="mt-2 btn btn-info btn-spread">
                    เพิ่ม
                  </button>
                </div>
                <div class="col">
                  <button @click="handleEnergy(false)" class="mt-2 btn btn-danger btn-spread">
                    ลด
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-12">
              <h3>Quest ที่ทำไปแล้ว</h3>
              <small>(เฉพาะเควสที่ทำได้แค่ครั้งเดียวเท่านั้น)</small>
            </div>
          </div>
          <div class="row">
            <div class="col-6 p-1" v-for="(id, index) in doneQuest" :key="index">
              <p class="mb-0 done-action px-2 py-1">{{ id }} <span @click="deleteDoneQuest(id)" class="hand text-danger float-right">X</span></p>
            </div>
          </div>
        </div>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import Profile from '@/pages/Profile'
import { firestore } from 'firebase'
export default {
  name: 'Assigner',
  components: {Profile},
  metaInfo: {
    title: 'Assigner'
  },
  data () {
    return {
      playerId: null,
      items: null,
      users: null,
      selectedPlayer: null,
      add: {
        id: null,
        quantity: 0
      },
      stepEnergy: 0,
      doneQuest: [],
      error: undefined
    }
  },
  mounted () {
    this.getItems()
    this.getPlayers()
  },
  methods: {
    deleteDoneQuest (questId) {
      this.doneQuest.splice(this.doneQuest.indexOf(questId), 1)
      firestore().collection('users').doc(this.selectedPlayer.uid).update({doneQuest: this.doneQuest})
    },
    getDoneQuests () {
      if (this.selectedPlayer !== null) {
        firestore().collection('users').doc(this.selectedPlayer.uid).onSnapshot(user => {
          this.doneQuest = user.data().doneQuest
          this.error = undefined
        })
      } else {
        this.error = 'Not Found'
      }
    },
    handleItem (mode) {
      if (this.add.id === null || this.add.quantity.length === 0 || parseInt(this.add.quantity) === 0) {
        return
      }
      let self = this
      firestore().collection('users').doc(this.selectedPlayer.uid).get().then(user => {
        let item = user.data().item
        let payload = Object.assign({}, item)
        if (mode) {
          if (item[self.add.id] === undefined) {
            payload[self.add.id] = parseInt(self.add.quantity)
          } else {
            payload[self.add.id] = parseInt(item[self.add.id]) + parseInt(self.add.quantity)
          }
        } else {
          if (item[self.add.id] === undefined || parseInt(item[self.add.id]) - parseInt(self.add.quantity) < 0) {
            return
          } else {
            payload[self.add.id] = parseInt(item[self.add.id]) - parseInt(self.add.quantity)
          }
        }
        firestore().collection('users').doc(self.selectedPlayer.uid).update({item: payload})
      })
      this.displayPlayer()
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
    handleEnergy (mode) {
      if (this.stepEnergy.length === 0) {
        this.stepEnergy = 0
      }
      let self = this
      this.stepEnergy = parseInt(this.stepEnergy)
      if (mode) {
        firestore().collection('users').doc(this.selectedPlayer.uid).get().then(user => {
          firestore().collection('users').doc(user.id).update({energy: user.data().energy + self.stepEnergy})
        })
      } else {
        firestore().collection('users').doc(this.selectedPlayer.uid).get().then(user => {
          firestore().collection('users').doc(user.id).update({energy: user.data().energy - self.stepEnergy})
        })
      }
    },
    getPlayers () {
      firestore().collection('users').where('mode', '==', 'player').onSnapshot(users => {
        let tmp = {}
        users.forEach((user) => {
          tmp[user.id] = user.data()
        })
        this.users = tmp
      })
    },
    displayPlayer () {
      this.selectedPlayer = null
      for (let i = 0; i < Object.keys(this.users).length; i++) {
        if (this.playerId === this.users[Object.keys(this.users)[i]].numId) {
          this.selectedPlayer = this.users[Object.keys(this.users)[i]]
          break
        }
      }
      this.getDoneQuests()
    },
    numberOnly (el) {
      if (el.keyCode >= 48 && el.keyCode <= 57) {
        return true
      } else {
        el.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-id {
  border: none;
  border-bottom: 2px solid #000;
  outline: none;
  transition: 0.3s ease;
  text-align: center;
  &:focus {
    transform: scale(1.3)
  }
}

#control-assigner {
  background: #ffffff;
  border-radius: 1.25em;
}

.done-action {
  background-color: rgb(219, 219, 219);
  border-radius: 0.25em;
}

.hand {
  cursor: pointer;
}
</style>
