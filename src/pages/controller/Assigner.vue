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
          <input @change="displayPlayer" v-model="playerId" type="text" class="form-id">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p>{{ selectedPlayer }}</p>
        </div>
      </div>
      <div v-if="selectedPlayer" class="row">
        <div class="col">
          <h3>ไอเทม</h3>
          <div :key="key" v-for="(item,key) in selectedPlayer.item" class="row">
            <div class="col">
              <p>{{ items[key].name }}</p>
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
  name: 'Assigner',
  data () {
    return {
      playerId: null,
      items: null,
      users: null,
      selectedPlayer: null
    }
  },
  mounted () {
    this.getItems()
    this.getPlayers()
  },
  methods: {
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
      this.selectedPlayer = this.users[this.playerId]
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
</style>
