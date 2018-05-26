<template>
  <div id="profile-card" v-if="userDetail != null" style="min-height: 100vh" class="container-fluid flex-center">
    <div class="container my-3 my-md-5 profile">
      <user :user="userDetail" :energy="userDetail.energy"/>
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
    <div id="in-process" class="overlay" v-if="userDetail.inProcess !== null">
      <div class="content py-3 px-2">
        <h3 class="processing">{{ userDetail.inProcess.header }}<span>.</span><span>.</span><span>.</span></h3>
        <hr>
        <p>{{ userDetail.inProcess.msg }}</p>
        <hr>
        <p v-if="!userDetail.inProcess.controlable" class="text-muted">ระหว่างการเข้าร่วมเควส ผู้ใช้ไม่สามารถดำเนินการใดๆกับระบบได้ ระบบจะเข้าสู่โหมดปกติเมื่อเควสได้สิ้นสุดลง</p>
        <button @click="closeMessage" v-else class="btn btn-theme-1 btn-spread">ปิด</button>
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
      userDetail: null,
      sessions: null
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
    closeMessage () {
      firestore().collection('users').doc(this.userDetail.uid).update({inProcess: null})
    },
    logOut () {
      auth().signOut().then(() => {
        window.localStorage.removeItem('itcamp-wallet')
        window.localStorage.setItem('justOut', true)
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
    },
    getSessions () {
      let tmp = {}
      firestore().collection('sessions').onSnapshot(sessions => {
        sessions.forEach((session) => {
          tmp[session.id] = session.data()
        })
        this.sessions = tmp
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
    max-width: 400px;
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

@keyframes blink {
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
}

.processing span {
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.processing span:nth-child(2) {
  animation-delay: .2s;
}

.processing span:nth-child(3) {
  animation-delay: .4s;
}
</style>
