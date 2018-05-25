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
import { auth, firestore, storage } from 'firebase'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      user: undefined,
      loggingIn: false,
      accId: null
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
        return
      } else {
        console.log('Auth Redirection triggered.')

        /* Set it up */
        let self1 = self
        let inner = self1
        let user = result.user
        let data

        firestore().collection('uid-matching').doc(user.providerData[0].uid).get().then(uid => {
          let self2 = inner
          self1.user = uid.data()
          firestore().collection('users').doc(user.providerData[0].uid).get().then(account => {
            if (!account.exists) {
              let firedata = self2
              console.log('Creating a new user.')
              firestore().collection('env').doc('counter').get().then(order => {
                self2.accId = order.data().positionId
                firestore().collection('env').doc('counter').update({positionId: firein.accId + 1})
                data = {
                  name: user.providerData[0].displayName,
                  uid: user.providerData[0].uid,
                  photoURL: user.providerData[0].photoURL,
                  firebaseUID: user.uid,
                  energy: 0,
                  role: (firedata.user === undefined) ? null : firedata.user.role,
                  house: (firedata.user === undefined) ? null : firedata.user.house,
                  health: 3,
                  doneQuest: [],
                  item: {},
                  numId: firedata.getFormatAccId(firedata.accId),
                  mode: (firedata.user === undefined) ? null : (firedata.user.player) ? 'player' : 'controller'
                }
                if (firedata.user === undefined) {
                  console.log('No matching UID.')              
                  firedata.$router.replace('contact/' + data.uid)
                } else {
                  console.log('Found matched UID.')
                  let stroage = Object.assign({}, data)
                  stroage.token = result.credential.accessToken
                  window.localStorage.setItem('itcamp-wallet', JSON.stringify(stroage))
                  firestore().collection('users').doc(data.uid).set(data)
                  firedata.$router.replace('profile')
                }
              })
            } else {
              console.log('Account is already in Database.')
              data = account.data()
              let stroage = Object.assign({}, data)
              stroage.token = result.credential.accessToken
              window.localStorage.setItem('itcamp-wallet', JSON.stringify(stroage))
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
    login () {
      let provider = new auth.FacebookAuthProvider()
      this.loggingIn = true
      window.localStorage.setItem('loggingIn', true)
      auth().signInWithRedirect(provider)
    },
    getFormatAccId (id) {
      let nextId = id.toString()
      let strLength = nextId.length
      if (strLength === 3) {
        return nextId
      } else {
        if (strLength === 2) {
          return '0' + nextId
        } else {
          return '00' + nextId
        }
      }
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
