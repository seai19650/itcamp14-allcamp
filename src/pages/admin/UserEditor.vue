<template>
  <div v-if="account != null" class="container-fluid">
    <div class="container">
      <div class="row pt-5">
        <div class="col">
          <h3>Editing <span class="text-info">{{account.name}}</span>'s' information</h3>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-6 form-group text-left">
          <label class="text-left" for="">Name</label>
          <input class="form-control" type="text" v-model="account.name">
        </div>
        <div class="col-6 form-group text-left">
          <label class="text-left" for="">Energy</label>
          <input class="form-control" type="text" v-model="account.energy">
        </div>
        <div class="col-2 form-group text-left">
          <label class="text-left" for="">Health</label>
          <input class="form-control" type="text" v-model="account.health">
        </div>
        <div class="col-5 form-group text-left">
          <label class="text-left" for="">House</label>
          <input disabled class="form-control" type="text" :value="account.house">
        </div>
        <div class="col-5 form-group text-left">
          <label class="text-left" for="">Role</label>
          <input disabled class="form-control" type="text" :value="account.role">
        </div>
        <div class="col-12 form-group text-left">
          <label class="text-left" for="">Photo URL</label>
          <input class="form-control" type="text" v-model="account.photoURL">
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button @click="saveData" class="btn btn-info">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore } from 'firebase'
export default {
  name: 'UserEditor',
  props: ['user'],
  metaInfo: {
    title: 'U-Editor'
  },
  data () {
    return {
      account: null
    }
  },
  mounted () {
    this.getThisUser()
  },
  methods: {
    getThisUser () {
      firestore().collection('users').doc(this.$route.params.id).get()
        .then(account => {
          this.account = account.data()
        })
    },
    saveData () {
      this.account.energy = parseInt(this.account.energy)
      firestore().collection('users').doc(this.account.uid).set(this.account)
      this.$router.replace('/dashboard/users')
    }
  }
}
</script>
