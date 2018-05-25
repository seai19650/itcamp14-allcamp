<template>
  <div @click="handleState" :class="[{'win': state},'col-12 player m-1']">
    <div class="row">
      <div class="col">
        <h6 class="text-left">{{ users[player].name }}</h6>
        <p class="text-left mb-0">Energy : {{ users[player].energy }}</p>
      </div>
      <div class="col-4">
        <p class="m-0 house text-capitalize">{{ users[player].house }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore } from 'firebase'
export default {
  name: 'Player',
  props: ['player', 'quest', 'status'],
  data () {
    return {
      users: null
    }
  },
  mounted () {
    this.getUsers()
    this.state = this.status
  },
  methods: {
    getUsers () {
      firestore().collection('users').onSnapshot(snapshot => {
        this.state = this.status
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
        })
        this.users = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    handleState () {
      let status = !this.status
      let payload = {}
      if (status) {
        payload[this.player] = true
      } else {
        payload[this.player] = false
      }
      firestore().collection('sessions').doc(this.quest).update(payload)
    }
  },
  computed: {
    state () {
      return this.status
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  padding: 1em;
  border-radius: 0.25em;
  background-color: rgb(230, 230, 230);
  border: 1px solid rgb(32, 89, 116);
}
.center {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.house {
  border: 1px solid #000;
  border-radius: 0.25em;
}
.win {
  background-color: rgb(130, 238, 130);
}
</style>
