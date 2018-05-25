<template>
  <div v-if="users !== null" class="container-fluid">
    <div class="container">
      <div class="row pt-5">
        <div class="col">
          <h1 class="console-header">UID Matching</h1>
        </div>
      </div>
      <div class="row">
        <table class="table">
          <thead>
            <tr>
              <th>UID</th>
              <th>Role</th>
              <th>House</th>
              <th>Camp</th>
            </tr>
          </thead>
          <tbody v-for="(house, index) in houses" :key="index">
            <tr class="table-section">
              <td><h3 class="text-capitalize mb-0">{{house}}</h3></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr v-for="(user, key) in users" v-if="user.house === house && user.player" :key="key">
              <td>{{ key }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.house }}</td>
              <td>{{ user.camp }}</td>
            </tr>
          </tbody>
          <tbody>
            <tr class="table-section">
              <td><h3 class="text-capitalize mb-0">Admin/Controller</h3></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr v-for="(core, key) in users" v-if="!core.player" :key="key">
              <td>{{ key }}</td>
              <td class="text-muted nope">{{ core.role }}</td>
              <td class="text-muted nope">{{ core.house }}</td>
              <td class="text-muted nope">{{ core.camp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <form @submit="addNewUIDData" class="row">
        <div class="col-4 form-group">
          <input v-model="add.key" type="text" class="form-control">
        </div>
        <div class="col-2 form-group">
          <select v-model="add.player" type="text" class="form-control">
            <option :value="true">Player</option>
            <option :value="false">Admin/Controller</option>
          </select>
        </div>
        <div class="col-2 form-group">
          <select :disabled="!add.player" v-model="add.house" type="text" class="form-control">
            <option v-for="(house, index) in houses" :key="index">{{ house }}</option>
          </select>
        </div>
        <div class="col-2 form-group">
          <select :disabled="!add.player" v-model="add.camp" type="text" class="form-control">
            <option v-for="(camp, index) in camps" :key="index">{{ camp }}</option>
          </select>
        </div>
        <div class="col-2 form-group">
          <input class="form-control" type="submit" value="Add">
        </div>
      </form>
      <div class="row">
        <div class="col">
          <button @click="randomAssign" class="ml-2 btn">Random Role (All)</button>
          <button v-if="isRandomed" @click="saveRoles" class="ml-2 btn">Save Roles</button>
          <p>This button will random the role for players. You have to click save.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore } from 'firebase'
export default {
  name: 'UIDController',
  data () {
    return {
      users: null,
      add: {
        key: '',
        role: '',
        house: '',
        player: true,
        camp: ''
      },
      roles: ['สายลับ', 'นักสะกดจิต', 'นักบิน', 'มือปืน'],
      houses: ['drop', 'pro', 're', 'tire'],
      camps: ['APPLIDANUS', 'I-OPOLLO', 'NETWORK STELLAR', 'GAME ORION', 'DTA48'],
      isRandomed: false
    }
  },
  mounted () {
    this.getUIDData()
  },
  methods: {
    getUIDData () {
      firestore().collection('uid-matching').onSnapshot(users => {
        let tmp = {}
        users.forEach((user) => {
          tmp[user.id] = user.data()
        })
        this.users = tmp
      })
    },
    addNewUIDData (el) {
      el.preventDefault()
      let payload = {}
      payload.role = this.add.role
      payload.house = this.add.house
      payload.player = this.add.player
      payload.camp = this.add.camp
      if (!this.add.player) {
        payload.role = false
        payload.house = false
        payload.camp = false
      } else {
        payload.house = this.add.house
        payload.player = this.add.player
        payload.camp = this.add.camp
      }
      firestore().collection('uid-matching').doc(this.add.key).set(payload)
      this.add = {
        key: '',
        role: '',
        house: '',
        camp: ''
      }
    },
    randomAssign () {
      let drop = []
      let pro = []
      let re = []
      let tire = []
      Object.keys(this.users).forEach((key) => {
        if (this.users[key].house === 'drop') {
          drop.push(key)
        } else if (this.users[key].house === 'pro') {
          pro.push(key)
        } else if (this.users[key].house === 're') {
          re.push(key)
        } else if (this.users[key].house === 'tire') {
          tire.push(key)
        }
      })
      let dropLimit = Math.ceil(drop.length / 4)
      let proLimit = Math.ceil(pro.length / 4)
      let reLimit = Math.ceil(re.length / 4)
      let tireLimit = Math.ceil(tire.length / 4)
      let dropPayload = []
      let proPayload = []
      let rePayload = []
      let tirePayload = []

      for (let i = 0; i <= dropLimit; i++) {
        this.roles.forEach((role) => {
          dropPayload.push(role)
        })
      }
      for (let i = 0; i <= proLimit; i++) {
        this.roles.forEach((role) => {
          proPayload.push(role)
        })
      }
      for (let i = 0; i <= reLimit; i++) {
        this.roles.forEach((role) => {
          rePayload.push(role)
        })
      }
      for (let i = 0; i <= tireLimit; i++) {
        this.roles.forEach((role) => {
          tirePayload.push(role)
        })
      }

      drop.forEach((key) => {
        this.users[key].role = dropPayload.splice(Math.floor(Math.random() * dropPayload.length), 1).toString()
      })
      pro.forEach((key) => {
        this.users[key].role = proPayload.splice(Math.floor(Math.random() * proPayload.length), 1).toString()
      })
      re.forEach((key) => {
        this.users[key].role = rePayload.splice(Math.floor(Math.random() * rePayload.length), 1).toString()
      })
      tire.forEach((key) => {
        this.users[key].role = tirePayload.splice(Math.floor(Math.random() * tirePayload.length), 1).toString()
      })
      this.isRandomed = true
    },
    saveRoles () {
      let payload = {}
      Object.keys(this.users).forEach((key) => {
        payload.role = this.users[key].role
        firestore().collection('uid-matching').doc(key).update(payload)
      })
      this.isRandomed = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table-section {
  color: #fff;
  background-color: rgb(44, 44, 44);
  border-bottom: 5px solid rgb(172, 172, 172);
}
.nope {
  text-decoration: line-through
}
</style>
