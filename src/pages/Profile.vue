<template>
  <div v-if="userDetail != null" style="min-height: 100vh" class="container-fluid flex-center">
    <div class="container my-5 profile">
      <user :user="userDetail"/>
      <hr>
      <items :userItem="userDetail.item" :state="noItem"/>
      <hr>
      <quests :doneQuest="userDetail.doneQuest" :hasItem="userDetail.item"/>
      <hr>
      <div class="row">
        <div class="col">
          <small>Player ID</small>
          <h3>{{ user.numId }}</h3>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col">
          <button @click="logOut" class="text-white mb-3 btn-theme-1">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from '@/components/User'
import Items from '@/components/Items'
import Quests from '@/components/Quests'
import { auth, firestore } from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Profile',
  components: {User, Items, Quests},
  metaInfo: {
    title: 'Profile'
  },
  data () {
    return {
      user: null,
      userDetail: null
    }
  },
  mounted () {
    this.user = this.getUser
    this.getUserData()
  },
  methods: {
    logOut () {
      auth().signOut().then(() => {
        window.localStorage.removeItem('itcamp-wallet')
        window.localStorage.setItem('justOut', true)
        window.localStorage.removeItem('accId')        
        this.$router.replace('login')
      })
    },
    getUserData () {
      let self = this
      firestore().collection('users')
        .where('uid', '==', this.user.uid.toString()).onSnapshot(snapshot => {
          snapshot.forEach((user) => {
            self.userDetail = user.data()
            self.setUser(user.data())
          })
        })
    },
    ...mapActions([
      'setUser'
    ])
  },
  computed: {
    noItem () {
      return Object.keys(this.userDetail.item).length === 0 && this.userDetail.item.constructor === Object
    },
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style lang="scss" scoped>
.profile {
  max-width: 440px!important;
  background: #fff;
  display: block;
  position: relative;
  border-radius: 1.25em;
}
</style>
