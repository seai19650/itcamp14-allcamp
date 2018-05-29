<template>
  <div class="container-fluid">
    <div class="container flex-center" style="height: 100vh">
      <div class="row pt-5">
        <div class="col">
          <img id="camp-logo" :class="['w-100', {'loading': loggingIn}]" src="../assets/logo.png" alt="">
        </div>
      </div>
      <div v-if="!loggingIn" class="row">
        <div class="col">
          <button class="mt-3 btn-theme-1 text-white" @click="login">Login ด้วย Facebook</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, firestore } from 'firebase'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      user: undefined,
      loggingIn: false
    }
  },
  mounted () {
    let self = this
    if (window.localStorage.getItem('loggingIn')) {
      this.loggingIn = true
      window.localStorage.removeItem('loggingIn')
    }
    auth().getRedirectResult().then(function (result) {
      /* Prevent Unwanted Redirect to process auth */
      if (window.localStorage.getItem('justOut') || result.user === null) {
        window.localStorage.removeItem('justOut')
      } else {
        console.log('Auth Redirection triggered.')
        /* Set it up */
        let self1 = self
        let inner = self1
        let user = result.user
        let data
        firestore().collection('uid-matching').doc(user.providerData[0].uid).get().then(uid => {
          self1.user = uid.data()
          let self2 = inner
          firestore().collection('users').doc(user.providerData[0].uid).get().then(account => {
            if (!account.exists) {
              console.log('Creating a new user.')
              if (self2.user === undefined) {
                console.log('No matching UID.')
                self2.$router.replace('contact/' + user.providerData[0].uid)
              } else {
                data = {
                  name: user.providerData[0].displayName,
                  uid: user.providerData[0].uid,
                  photoURL: user.providerData[0].photoURL,
                  firebaseUID: user.uid,
                  energy: 0,
                  role: (self2.user === undefined) ? null : self2.user.role,
                  house: (self2.user === undefined) ? null : self2.user.house,
                  health: 3,
                  doneQuest: [],
                  item: {},
                  inProcess: {
                    controllable: true,
                    header: 'สวัสดีนะ!',
                    msg: 'ยินดีต้อนรับเข้าสู่ IT CAMP 14 ครับ!'
                  },
                  numId: self2.user.numId,
                  mode: (self2.user === undefined) ? null : (self2.user.player) ? 'player' : 'controller'
                }
                console.log('Found matched UID.')
                let stroage = Object.assign({}, data)
                stroage.token = result.credential.accessToken
                firestore().collection('users').doc(data.uid).set(data)
                self2.setUser(stroage)
                self2.$router.replace('profile')
              }
            } else {
              console.log('Account is already in Database.')
              data = account.data()
              let stroage = Object.assign({}, data)
              stroage.token = result.credential.accessToken
              self.setUser(stroage)
              self.$router.replace('profile')
            }
          })
        }).catch(function (error) {
          console.log('Error : Login => ' + error.message)
        })
      }
    })
  },
  methods: {
    ...mapActions([
      'setUser'
    ]),
    login () {
      let provider = new auth.FacebookAuthProvider()
      this.loggingIn = true
      window.localStorage.setItem('loggingIn', true)
      auth().signInWithRedirect(provider)
    }
  }
}
</script>

<style lang="scss" scoped>
#camp-logo {
  max-width: 400px;
  animation: none;
}
.loading {
  animation: pulse 1s infinite!important;
}
@keyframes pulse {
  0% {
    transform: scale(1)
  }
  70% {
    transform: scale(1.03)
  }
  100% {
    transform: scale(1)
  }
}
</style>
