<template>
  <div v-if="user && session" :class="[{'win': status},'col-12 player m-1']">
    <div class="row">
      <div class="col">
        <h6 class="text-left"><span class="text-info text-capitalize">{{ user.house }}</span> | {{ user.name }}</h6>
        <p class="text-left mb-0">Energy : {{ user.energy }}</p>
      </div>
      <div class="col-6">
        <div class="row justify-content-end">
          <div v-if="isPlaying" class="col-auto">
            <button @click="handleState" class="btn-spread btn-info btn">{{ btnMsg }}</button>
          </div>
          <div v-else class="col-auto">
            <button @click="rejectUser" class="btn-spread btn-danger btn">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore } from 'firebase'
export default {
  name: 'Player',
  props: ['player', 'quest', 'status', 'session', 'questData'],
  data () {
    return {
      users: null,
      user: null,
      userState: null
    }
  },
  mounted () {
    this.getUsers()
    this.userState = this.status
  },
  methods: {
    rejectUser () {
      let payload = {}
      payload[this.player] = null
      firestore().collection('sessions').doc(this.quest).update(payload)

      if (!this.questData.redo) {
        this.user.doneQuest.splice(this.user.doneQuest.indexOf(this.quest), 1)        
      }

      let message = {
        controlable: true,
        header: 'Aborted Quest',
        msg: 'การเข้าร่วมเควสถูกปฏิเสธ'
      }

      firestore().collection('users').doc(this.player).update({inProcess: message})

      if (this.questData.flush) {
        let reverse = {}
        reverse.energy = this.questData.requiredEnergy + this.user.energy
        this.questData.requiredItem.forEach((item) => {
          if (this.user.item[item.id] !== undefined) {
            this.user.item[item.id] += item.count
          } else {
            this.user.item[item.id] = item.count
          }
        })
        reverse.item = this.user.item
        reverse.doneQuest = this.user.doneQuest
        firestore().collection('users').doc(this.user.uid).update(reverse)
      }

    },
    getUsers () {
      firestore().collection('users').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
        })
        this.users = tmp
        this.user = this.users[this.player]
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    handleState () {
      let status = !this.status
      this.userState = status
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
    btnMsg () {
      if (this.userState) {
        return 'Unmark'
      }
      return 'Mark as Winner'
    },
    isPlaying () {
      return this.session.playing
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
