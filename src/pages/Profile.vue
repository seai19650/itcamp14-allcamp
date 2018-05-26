<template>
  <div id="profile-card" v-if="userDetail != null" style="min-height: 100vh" class="container-fluid flex-center">
    <div class="container my-3 my-md-5 profile">
      <user :user="userDetail"/>
      <hr>
      <items :userItem="userDetail.item" :state="noItem"/>
      <hr>
      <quests
      :doneQuest="userDetail.doneQuest"
      :hasItem="userDetail.item"
      :uid="userDetail.uid"
      :userRole="userDetail.role"/>
      <hr>
      <div class="row">
        <div class="col">
          <small>Player ID</small>
          <h3>{{ userDetail.numId }}</h3>
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
export default {
  name: 'Profile',
  components: {User, Items, Quests},
  props: ['id'],
  metaInfo: {
    title: 'Profile'
  },
  data () {
    return {
      uid: JSON.parse(window.localStorage.getItem('itcamp-wallet')).uid,
      userDetail: null
    }
  },
  mounted () {
    if (this.id !== undefined) {
      this.uid = this.id
    }
    console.log('Profile for ' + this.uid)    
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
        .where('uid', '==', this.uid.toString()).onSnapshot(snapshot => {
          snapshot.forEach((user) => {
            self.userDetail = user.data()
          })
        })
    }
  },
  computed: {
    noItem () {
      return Object.keys(this.userDetail.item).length === 0 && this.userDetail.item.constructor === Object
    }
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
@media screen and (max-width: 320px) {
  #profile-card {
    padding: 0;
    margin: 0;
  }
  .profile {
    margin: 0;
  }
}
</style>
