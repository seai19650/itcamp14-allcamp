<template>
  <div id="profile-card" v-if="userDetail != null && systemEnv !== null" style="min-height: 100vh" class="container-fluid flex-center">
    <div class="container my-3 my-md-5 profile">
      <hr>
      <user :user="userDetail" :energy="userDetail.energy" :energyGone="isEnergyDown"/>
      <hr>
      <items :userItem="userDetail.item" :state="noItem"/>
      <hr>
      <quests
      :doneQuest="userDetail.doneQuest"
      :hasItem="userDetail.item"
      :uid="userDetail.uid"
      :userRole="userDetail.role"
      :energyGone="isEnergyDown"/>
      <hr>
      <div class="row">
        <div class="col">
          <small>Player ID</small>
          <h3>{{ userDetail.numId }}</h3>
        </div>
      </div>
      <hr>
      <div class="row" v-if="currLogin === 'player'">
        <div class="col">
          <button @click="logOut" class="text-white mb-3 btn-theme-1">
            Logout
          </button>
        </div>
      </div>
      <div class="row" v-else-if="currLogin !== 'player' && (userDetail.inProcess !== null || isSystemSuspensed || isMessageArrive)">
        <div class="col" v-if="!isSystemSuspensed && !isMessageArrive">
          <h3>User Notification Status</h3>
          <p class="text-info">{{ userDetail.inProcess.header }}</p>
          <p class="text-primary mb-0">{{ userDetail.inProcess.msg }}</p>
          <p v-if="userDetail.inProcess.data !== undefined">{{ userDetail.inProcess.data }}</p>
          <p class="text-muted" v-if="userDetail.inProcess.controllable">ผู้ใช้สามารถปิด Popup นี้ได้</p>
          <p class="text-muted" v-else>ผู้ใช้ไม่สามารถปิด Popup นี้ได้</p>
          <button @click="closeMessage" class="btn btn-danger mb-3">ลบการแจ้งเตือน</button>
        </div>
        <div class="col" v-else-if="isSystemSuspensed">
          <h3 class="text-danger">ระงับการใช้งานโดยผู้ดูแล</h3>
          <p>ผู้เล่นคนนี้ถูกระงับการใช้งานระบบชั่วคราว สามารถแก้ไขได้ที่ World Control</p>
        </div>
        <div class="col" v-else-if="isMessageArrive">
           <h3 class="text-info">ข้อความที่ผู้ใช้ได้รับ</h3>
           <p>{{ systemEnv.message.data }}</p>
        </div>
      </div>
    </div>
    <div id="in-process" class="overlay" v-if="currLogin === 'player' && (userDetail.inProcess !== null || isSystemSuspensed || (isMessageArrive && !readed))">
      <div class="content py-3 px-2" v-if="!isSystemSuspensed && !isMessageArrive">
        <h3 class="processing">{{ userDetail.inProcess.header }}<span v-show="!userDetail.inProcess.controllable">.</span><span v-show="!userDetail.inProcess.controllable">.</span><span v-show="!userDetail.inProcess.controllable">.</span></h3>
        <hr>
        <p class="text-info">{{ userDetail.inProcess.msg }}</p>
        <p v-if="userDetail.inProcess.data !== undefined">{{ userDetail.inProcess.data }}</p>
        <hr>
        <p v-if="!userDetail.inProcess.controllable" class="text-muted">ระหว่างการเข้าร่วมเควส ผู้ใช้ไม่สามารถดำเนินการใดๆกับระบบได้ ระบบจะเข้าสู่โหมดปกติเมื่อเควสได้สิ้นสุดลง</p>
        <button @click="closeMessage" v-else class="btn btn-theme-1 btn-spread">ปิด</button>
      </div>
      <div v-else-if="isSystemSuspensed || isMessageArrive" class="content py-3 px-2">
        <section v-if="isSystemSuspensed">
          <h4>System is administratively down.</h4>
          <hr>
          <p>ระบบถูกปิดใช้งานชั่วคราวโดยผู้ดูแล</p>
        </section>
        <section v-if="isMessageArrive">
          <h4>Message</h4>
          <hr>
          <p>{{ systemEnv.message.data }}</p>
          <hr>
          <button v-if="!isSystemSuspensed" @click="readed = true" class="btn-theme-1 w-100 text-white">ปิด</button>
        </section>
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
  props: ['id'],
  metaInfo: {
    title: 'Profile'
  },
  data () {
    return {
      uid: undefined,
      userDetail: null,
      sessions: null,
      currLogin: undefined,
      systemEnv: null,
      readed: false
    }
  },
  mounted () {
    this.getSystemEnv()
    if (this.id !== undefined) {
      console.log('Assigner View')
      this.uid = this.id
    } else {
      console.log('Profile View')      
      this.uid = this.getUser.uid
    }
    this.currLogin = this.getUser.mode
    this.getUserData()
  },
  methods: {
    ...mapActions([
      'clearUser'
    ]),
    closeMessage () {
      firestore().collection('users').doc(this.userDetail.uid).update({inProcess: null})
    },
    logOut () {
      auth().signOut().then(() => {
        window.localStorage.setItem('justOut', true)
        this.clearUser()
        this.$router.replace('/login')
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
    getSystemEnv () {
      firestore().collection('env').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach((env) => {
          tmp[env.id] = env.data()
        })
        this.systemEnv = tmp
      })
    }
  },
  computed: {
    noItem () {
      return Object.keys(this.userDetail.item).length === 0 && this.userDetail.item.constructor === Object
    },
    ...mapGetters([
      'getUser'
    ]),
    isSystemSuspensed () {
      let status = this.systemEnv.suspension
      if (status.role !== null) {
        if (status.role.includes(this.userDetail.role) && status.house.includes(this.userDetail.house)) {
          return true
        }
      }
      return false
    },
    isEnergyDown () {
      let status = this.systemEnv.consumption
      if (status.role !== null) {
        if (status.role.includes(this.userDetail.role) && status.house.includes(this.userDetail.house)) {
          return true
        }
      }
      return false
    },
    isMessageArrive () {
      let status = this.systemEnv.message
      if (status.role !== null) {
        if (status.role.includes(this.userDetail.role) && status.house.includes(this.userDetail.house)) {
          return true
        }
      }
      return false
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
