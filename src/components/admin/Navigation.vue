<template>
  <div id="navigation-dash" v-if="user">
    <div class="row pt-5">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageQuests'}">Quests</router-link>
      </div>
      <hr>
    </div>
    <div class="row">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageItems'}">Items</router-link>
      </div>
      <hr>
    </div>
    <div class="row" v-if="user.mode === 'admin'">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageUsers'}">Users</router-link>
      </div>
      <hr>
    </div>
    <div class="row">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageWorld'}">World Control</router-link>
      </div>
      <hr>
    </div>
    <div class="row">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageSession'}">Session</router-link>
      </div>
      <hr>
    </div>
    <div class="row">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageAssigner'}">Assigner</router-link>
      </div>
      <hr>
    </div>

    <div class="row">
      <hr>
      <div class="col">
        <router-link tag="div" active-class="active" class="btn-side-navigation text-right" :to="{name: 'ManageUID'}">UID</router-link>
      </div>
      <hr>
    </div>
    <div class="row">
      <div class="col">
        <div class="btn-side-navigation text-right text-white go-red" @click="logOut">Logout</div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Navigation',
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.user = this.getUser
  },
  methods: {
    logOut () {
      auth().signOut().then(() => {
        window.localStorage.removeItem('itcamp-wallet')
        window.localStorage.setItem('justOut', true)
        this.clearUser()
        this.$router.replace('/login')
      })
    },
    ...mapActions([
      'clearUser'
    ])
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style lang="scss" scoped>
#navigation-dash {
  height: 100vh;
  background-color: rgb(189, 189, 189);
  .active {
    background: #fff;
  }
  .btn-side-navigation {
    width: 100%;
    padding: 0.7em 1.1em;
    cursor: pointer;
  }
}
hr {
  margin: 0;
}

.go-red {
  background-color: rgb(124, 33, 33);
}
</style>
