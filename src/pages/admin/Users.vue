<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row pt-5">
        <div class="col">
          <h1 class="console-header">Users</h1>
        </div>
      </div>
      <hr>
      <div class="row">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>House</th>
              <th v-if="getUser.mode === 'admin'">Mode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <p class="mb-0">{{ user.numId }}</p>
                <small>{{ user.uid }}</small>
              </td>
              <td>
                <p class="mb-0">{{ user.name }}</p>
                <small class="text-primary">{{ user.mode }}</small>
              </td>
              <td v-if="user.house">{{ user.house }}</td>
              <td v-else>-</td>
              <td v-if="getUser.mode === 'admin'">
                <div class="form-group mb-0">
                  <select @change="updateMode(user.uid)" v-model="user.mode" type="text" name="mode" class="form-control">
                    <option :selected="user.mode === 'player'" value="player">Player</option>
                    <option :selected="user.mode === 'controller'" value="controller">Controller</option>
                    <option :selected="user.mode === 'admin'" value="admin">Admin</option>
                  </select>
                </div>
              </td>
              <td>
                <router-link tag="button" class="btn btn-warning" :to="{name: 'UserEditor', params: {id: user.uid}}">Edit</router-link>
                <button @click="deleteUser(user.uid)" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { firestore } from 'firebase'
import { mapGetters } from 'vuex';
export default {
  name: 'Users',
  metaInfo: {
    title: 'Users'
  },
  data () {
    return {
      users: null
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      firestore().collection('users').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
        })
        this.users = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    updateMode (uid) {
      let payload = {}
      payload.mode = this.users[uid].mode
      firestore().collection('users').doc(uid).update(payload)
    },
    deleteUser (id) {
      firestore().collection('users').doc(id).delete()
    }
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style lang="scss" scoped>
td {
  vertical-align: middle
}
</style>
