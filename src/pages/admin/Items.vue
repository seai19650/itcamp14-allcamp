<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row pt-5">
        <div class="col">
          <h1 class="console-header">Items</h1>
        </div>
        <div class="col-4 text-right">
          <button class="btn btn-info" @click="prepareAddItem">Add a new item</button>
        </div>
      </div>
      <hr>
      <div class="row">
        <table class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in data" :key="key">
              <td><img class="img-item" :src="item.img" alt=""></td>
              <td>{{item.name}}</td>
              <td>{{item.description}}</td>
              <td v-if="!editing.active">{{item.available}}</td>
              <td v-else><input type="text" v-model="editing.available"></td>
              <td>
                <button class="btn btn-warning" @click="prepareEditItem(item, key)">Edit</button>
                <button class="btn btn-danger text-white" @click="prepareDeleteItem(item, key)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- editing -->
    <div v-if="editing.active" class="overlay">
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Modify Item</h1>
              <h4>{{ editing.name }}</h4>
              <div class="form-group">
                <label for="available"></label>
                <input @keypress="validateAvailable" class="center-form form-control" id="available" type="text" v-model="editing.available">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button @click="editItem" style="background-color: rgb(31, 136, 17)" class="btn btn-spread">Save</button>
            </div>
            <div class="col">
              <button @click="clearEditItem" style="background-color: rgb(59, 59, 59)" class="btn btn-spread">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end editing -->

    <!-- create new -->
    <div v-if="add.active" class="overlay">
      <div class="content">
        <div class="container">
          <div class="row">
              <div class="col-12">
            <h1>Add Item</h1>
            </div>
            <div class="form-group col-12">
              <label for="name">Name</label>
              <input class="center-form form-control" id="name" type="text" v-model="add.name">
            </div>
            <div class="form-group col-12">
              <label for="description">Description</label>
              <textarea class="center-form form-control" id="description" type="text" v-model="add.description" cols="50"></textarea>
            </div>
            <div class="form-group col-12">
              <label for="available">Available</label>
              <input @keypress="validateAvailable" class="center-form form-control" id="available" type="text" v-model="add.available">
            </div>
            <div class="form-group col-12">
              <label for="img">Image Url</label>
              <input class="center-form form-control" id="img" type="text" v-model="add.img">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button @click="addItem" style="background-color: rgb(31, 136, 17)" class="btn btn-spread">Add</button>
            </div>
            <div class="col">
              <button @click="clearAddItem" style="background-color: rgb(59, 59, 59)" class="btn btn-spread">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end create new -->

    <alert @yes="deleteItem" @no="clearDeleteItem" v-if="deleting.active" :header="deleting.header" :msg="deleting.msg"/>
  </div>
</template>

<script>
import { firestore } from 'firebase'
import Alert from '@/components/admin/Alert'
export default {
  name: 'Items',
  components: {Alert},
  metaInfo: {
    title: 'Items'
  },
  data () {
    return {
      deleting: {
        active: false,
        name: null,
        id: null,
        header: null,
        msg: null
      },
      add: {
        active: false,
        name: '',
        description: '',
        available: 0,
        img: ''
      },
      editing: {
        active: false,
        id: null,
        available: null,
        name: null
      },
      data: null
    }
  },
  mounted () {
    this.getItems()
  },
  methods: {
    getItems () {
      firestore().collection('items').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
        })
        this.data = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    prepareAddItem () {
      this.add.active = true
    },
    clearAddItem () {
      this.add.active = false
      this.add.name = ''
      this.add.description = ''
      this.add.available = 0
      this.add.img = ''
    },
    addItem () {
      let payload = {}
      payload.name = this.add.name
      payload.description = this.add.description
      payload.available = parseInt(this.add.available)
      payload.img = this.add.img
      firestore().collection('items').add(payload)
      this.clearAddItem()
    },
    prepareEditItem (item, key) {
      this.editing.active = true
      this.editing.id = key
      this.editing.name = item.name
      this.editing.available = item.available
    },
    clearEditItem () {
      this.editing.active = false
      this.editing.id = null
      this.editing.name = null
      this.editing.available = null
    },
    editItem () {
      firestore().collection('items').doc(this.editing.id).update({available: parseInt(this.editing.available)})
      this.clearEditItem()
    },
    prepareDeleteItem (item, key) {
      this.deleting.active = true
      this.deleting.name = item.name
      this.deleting.id = key
      this.deleting.header = 'Delete This one?'
      this.deleting.msg = 'You\'re about to delete ' + item.name
    },
    clearDeleteItem () {
      this.deleting.active = false
      this.deleting.name = null
      this.deleting.id = null
      this.deleting.header = null
      this.deleting.msg = null
    },
    deleteItem () {
      firestore().collection('items').doc(this.deleting.id).delete()
      this.clearDeleteItem()
    },
    validateAvailable (el) {
      if (el.keyCode >= 48 && el.keyCode <= 57) {
        return true
      } else {
        el.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.center-form {
  text-align: center;
}
.img-item {
  width: 50px;
}
td {
  vertical-align: middle
}
</style>
