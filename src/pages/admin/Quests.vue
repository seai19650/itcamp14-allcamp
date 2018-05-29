<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row pt-5">
        <div class="col">
          <h1 class="console-header">Quests</h1>
        </div>
        <div class="col-4 text-right">
          <button class="btn btn-info" @click="prepareAddQuest">Add a new quest</button>
        </div>
      </div>
      <hr>
      <div class="row">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ชื่อเควส</th>
              <th>รายละเอียด</th>
              <th>จำนวนการเล่นต่อรอบ</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quest, key) in quests" :key="key">
              <td class="text-left">
                <span class="text-primary">{{key}}</span> | {{quest.name}}<br>
                <p :class="['mb-0', {'text-info': quest.quest === 'extra'}, {'text-danger': quest.quest === 'event'}]">:{{ quest.quest }}</p>
              </td>
              <td>
                {{quest.description}}
              </td>
              <td>
                {{ quest.max }}
              </td>
              <td>
                <button @click="prepareEditQuest(quest, key)" class="btn btn-warning">Edit</button>
                <button @click="prepareDeleteQuest(quest, key)" class="text-white btn btn-danger dark">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- edit -->
    <div v-if="edit.active" class="overlay">
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h1>Edit Quest</h1>
              <h4>{{edit.name}}</h4>
            </div>
            <div class="form-group col-12">
              <label for="name">ชื่อเควส</label>
              <input class="center-form form-control" id="name" type="text" v-model="edit.name">
            </div>
            <div class="form-group col-12">
              <label for="description">คำอธิบาย</label>
              <textarea class="center-form form-control" id="description" type="text" v-model="edit.description" cols="50"></textarea>
            </div>
            <div class="form-group col-6">
              <label for="npc">NPC</label>
              <input class="center-form form-control" id="npc" type="text" v-model="edit.npc">
            </div>
            <div class="form-group col-6">
              <label for="place">สถานที่</label>
              <input class="center-form form-control" id="place" type="text" v-model="edit.place">
            </div>
            <div class="form-group col-12">
              <label for="requiredItem">ไอเทมที่ต้องการ</label>
              <multiselect
              :multiple="true"
              :close-on-select="true"
              placeholder="เลือกไอเทม"
              label="name"
              track-by="name"
              v-model="edit.requiredItem"
              :options="itemsOption">
              </multiselect>
              <div class="row my-2" v-for="requiredItem in edit.requiredItem" :key="requiredItem.id">
                <div class="form-group col m-0">
                  <input disabled class="form-control" type="text" name="name" :value="requiredItem.name">
                </div>
                <div class="col-1">
                  <p class="m-0"> = </p>
                </div>
                <div class="form-group col m-0">
                  <input class="form-control" type="text" name="count" v-model="requiredItem.count">
                </div>
              </div>
            </div>
            <div class="form-group col-12">
              <label for="prize">ของรางวัล</label>
              <multiselect
              :multiple="true"
              :close-on-select="true"
              placeholder="เลือกไอเทมรางวัล"
              label="name"
              track-by="name"
              v-model="edit.prize"
              :options="itemsOption">
              </multiselect>
              <div class="row my-2" v-for="prize in edit.prize" :key="prize.id">
                <div class="form-group col m-0">
                  <input disabled class="form-control" type="text" name="name" :value="prize.name">
                </div>
                <div class="col-1">
                  <p class="m-0"> = </p>
                </div>
                <div class="form-group col m-0">
                  <input class="form-control" type="text" name="count" v-model="prize.count">
                </div>
              </div>
            </div>
            <div class="form-group col-6">
              <label for="requiredEnergy">ใช้ Energy</label>
              <input @keypress="validateEnergy" class="center-form form-control" id="requiredEnergy" type="text" v-model="edit.requiredEnergy">
            </div>
            <div class="form-group col-6">
              <label for="payEnergy">ให้ Energy</label>
              <input @keypress="validateEnergy" class="center-form form-control" id="payEnergy" type="text" v-model="edit.payEnergy">
            </div>
            <div class="text-left form-group col-12 mt-2">
              <input id="flush" type="checkbox" v-model="edit.flush">
              <label for="flush" class="text-left">เมื่อกดรับเควส ระบบจะหักไอเทมที่ต้องการ</label>
            </div>
            <div class="text-left form-group col-12">
              <input id="redo" type="checkbox" v-model="edit.redo">
              <label for="redo" class="text-left">สามารถทำเควสนี้ซ้ำได้</label>
            </div>
            <div class="form-group col-6">
              <label for="quest">หมวดเควส</label>
              <select class="center-form form-control" id="quest" type="text" v-model="edit.quest">
                <option value="main">Main</option>
                <option value="extra">Extra</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div class="form-group col-6">
              <label for="role">Role ที่สามารถเข้าร่วมได้</label>
              <select class="center-form form-control" id="role" type="text" v-model="edit.role">
                <option :value="false">ไม่จำกัด</option>
                <option v-for="(role,index) in roles" :key="index" :value="role">{{role}}</option>
              </select>
            </div>
            <div class="form-group col-12">
              <label for="max">จำนวนคนที่สามารถเข้าร่วมได้ต่อรอบ</label>
              <input class="center-form form-control" id="max" type="text" v-model="edit.max">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button @click="editQuest" style="background-color: rgb(31, 136, 17)" class="btn btn-spread">Save</button>
            </div>
            <div class="col">
              <button @click="clearEditQuest" style="background-color: rgb(59, 59, 59)" class="btn btn-spread">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end edit -->
    <!-- create new -->
    <div v-if="add.active" class="overlay">
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h1>Add Quest</h1>
              <h4>{{add.name}}</h4>
            </div>
            <div class="form-group col-12">
              <label for="name">ชื่อเควส</label>
              <input class="center-form form-control" id="name" type="text" v-model="add.name">
            </div>
            <div class="form-group col-12">
              <label for="description">คำอธิบาย</label>
              <textarea class="center-form form-control" id="description" type="text" v-model="add.description" cols="50"></textarea>
            </div>
            <div class="form-group col-6">
              <label for="npc">NPC</label>
              <input class="center-form form-control" id="npc" type="text" v-model="add.npc">
            </div>
            <div class="form-group col-6">
              <label for="place">สถานที่</label>
              <input class="center-form form-control" id="place" type="text" v-model="add.place">
            </div>
            <div class="form-group col-12">
              <label for="requiredItem">ไอเทมที่ต้องการ</label>
              <multiselect
              :multiple="true"
              :close-on-select="true"
              placeholder="เลือกไอเทม"
              label="name"
              track-by="name"
              v-model="add.requiredItem"
              :options="itemsOption">
              </multiselect>
              <div class="row my-2" v-for="requiredItem in add.requiredItem" :key="requiredItem.id">
                <div class="form-group col m-0">
                  <input disabled class="form-control" type="text" name="name" :value="requiredItem.name">
                </div>
                <div class="col-1">
                  <p class="m-0"> = </p>
                </div>
                <div class="form-group col m-0">
                  <input class="form-control" type="text" name="count" v-model="requiredItem.count">
                </div>
              </div>
            </div>
            <div class="form-group col-12">
              <label for="prize">ของรางวัล</label>
              <multiselect
              :multiple="true"
              :close-on-select="true"
              placeholder="เลือกไอเทมรางวัล"
              label="name"
              track-by="name"
              v-model="add.prize"
              :options="itemsOption">
              </multiselect>
              <div class="row my-2" v-for="prize in add.prize" :key="prize.id">
                <div class="form-group col m-0">
                  <input disabled class="form-control" type="text" name="name" :value="prize.name">
                </div>
                <div class="col-1">
                  <p class="m-0"> = </p>
                </div>
                <div class="form-group col m-0">
                  <input class="form-control" type="text" name="count" v-model="prize.count">
                </div>
              </div>
            </div>
            <div class="form-group col-6">
              <label for="requiredEnergy">ใช้ Energy</label>
              <input @keypress="validateEnergy" class="center-form form-control" id="requiredEnergy" type="text" v-model="add.requiredEnergy">
            </div>
            <div class="form-group col-6">
              <label for="payEnergy">ให้ Energy</label>
              <input @keypress="validateEnergy" class="center-form form-control" id="payEnergy" type="text" v-model="add.payEnergy">
            </div>
            <div class="text-left form-group col-12 mt-2">
              <input id="flush" type="checkbox" v-model="add.flush">
              <label for="flush" class="text-left">เมื่อกดรับเควส ระบบจะหักไอเทมที่ต้องการ</label>
            </div>
            <div class="text-left form-group col-12">
              <input id="redo" type="checkbox" v-model="add.redo">
              <label for="redo" class="text-left">สามารถทำเควสนี้ซ้ำได้</label>
            </div>
            <div class="form-group col-6">
              <label for="quest">หมวดเควส</label>
              <select class="center-form form-control" id="quest" type="text" v-model="add.quest">
                <option value="main">Main</option>
                <option value="extra">Extra</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div class="form-group col-6">
              <label for="role">Role ที่สามารถเข้าร่วมได้</label>
              <select class="center-form form-control" id="role" type="text" v-model="add.role">
                <option :value="false">ไม่จำกัด</option>
                <option v-for="(role,index) in roles" :key="index" :value="role">{{role}}</option>
              </select>
            </div>
            <div class="form-group col-12">
              <label for="max">จำนวนคนที่สามารถเข้าร่วมได้ต่อรอบ</label>
              <input class="center-form form-control" id="max" type="text" v-model="add.max">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button @click="addQuest" style="background-color: rgb(31, 136, 17)" class="btn btn-spread">Add</button>
            </div>
            <div class="col">
              <button @click="clearAddQuest" style="background-color: rgb(59, 59, 59)" class="btn btn-spread">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end create new -->
    <alert @yes="deleteQuest" @no="clearDeleteQuest" v-if="deleting.active" :header="deleting.header" :msg="deleting.msg"/>
  </div>
</template>

<script>
import { firestore } from 'firebase'
import Multiselect from 'vue-multiselect'
import Alert from '@/components/admin/Alert'
export default {
  name: 'Quests',
  components: {Alert, Multiselect},
  metaInfo: {
    title: 'Quests'
  },
  data () {
    return {
      roles: ['สายลับ', 'นักสะกดจิต', 'นักบิน', 'มือปืน'],
      nextId: 0,
      quests: null,
      items: null,
      add: {
        active: false,
        name: '',
        description: '',
        npc: '',
        place: '',
        prize: [],
        requiredEnergy: 0,
        payEnergy: 0,
        requiredItem: [],
        flush: false,
        redo: false,
        quest: '',
        role: '',
        max: 0
      },
      edit: {
        active: false,
        name: '',
        description: '',
        npc: '',
        place: '',
        prize: [],
        requiredEnergy: 0,
        payEnergy: 0,
        requiredItem: [],
        flush: false,
        redo: false,
        quest: '',
        role: '',
        max: 0
      },
      deleting: {
        active: false,
        header: '',
        msg: '',
        id: null,
        name: null
      }
    }
  },
  mounted () {
    this.getItems()
    this.getQuests()
  },
  methods: {
    getQuests () {
      firestore().collection('quests').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
          if (parseInt(doc.id) >= parseInt(this.nextId)) {
            this.nextId = this.getNextId(parseInt(doc.id))
          }
          let prizeData = []
          Object.keys(tmp[doc.id].prize).forEach(key => {
            let target = Object.assign({}, this.items[key])
            let prize = Object.assign({}, target)
            prize['id'] = key
            prize['count'] = parseInt(tmp[doc.id].prize[key])
            prizeData.push(prize)
          })
          let requiredItemData = []
          Object.keys(tmp[doc.id].requiredItem).forEach(key => {
            let requiredItem = Object.assign({}, this.items[key])
            requiredItem['id'] = key
            requiredItem['count'] = parseInt(tmp[doc.id].requiredItem[key])
            requiredItemData.push(requiredItem)
          })
          tmp[doc.id].prize = prizeData
          tmp[doc.id].requiredItem = requiredItemData
        })
        this.quests = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    getItems () {
      firestore().collection('items').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach(doc => {
          tmp[doc.id] = doc.data()
        })
        this.items = tmp
      }, err => {
        console.log(`Encountered error: ${err}`)
      })
    },
    prepareAddQuest () {
      this.add.active = true
      this.add.name = ''
      this.add.description = ''
      this.add.npc = ''
      this.add.place = ''
      this.add.prize = []
      this.add.requiredEnergy = 0
      this.add.payEnergy = 0
      this.add.requiredItem = []
      this.add.flush = false
      this.add.redo = false
      this.add.quest = ''
      this.add.role = ''
      this.add.max = 0
    },
    clearAddQuest () {
      this.add.active = false
      this.add.name = ''
      this.add.description = ''
      this.add.npc = ''
      this.add.place = ''
      this.add.prize = []
      this.add.requiredEnergy = 0
      this.add.payEnergy = 0
      this.add.requiredItem = []
      this.add.flush = false
      this.add.redo = false
      this.add.quest = ''
      this.add.role = ''
      this.add.max = 0
    },
    addQuest () {
      if (this.add.max.length === 0) {
        this.add.max = 1
      }
      let payload = {}
      payload.name = this.add.name
      payload.description = this.add.description
      payload.npc = this.add.npc
      payload.place = this.add.place
      payload.prize = this.getPrizePayload(this.add.prize)
      payload.requiredEnergy = parseInt(this.add.requiredEnergy)
      payload.payEnergy = parseInt(this.add.payEnergy)
      payload.requiredItem = this.getRequiredItemPayload(this.add.requiredItem)
      payload.flush = this.add.flush
      payload.redo = this.add.redo
      payload.quest = this.add.quest
      payload.role = this.add.role
      payload.max = parseInt(this.add.max)
      firestore().collection('quests').doc(this.nextId).set(payload)
      firestore().collection('sessions').doc(this.nextId).set({playing: false})
      this.clearAddQuest()
    },
    prepareEditQuest (item, key) {
      this.edit.active = true
      this.edit.id = key
      this.edit.name = item.name
      this.edit.description = item.description
      this.edit.npc = item.npc
      this.edit.place = item.place
      this.edit.prize = item.prize
      this.edit.requiredEnergy = item.requiredEnergy
      this.edit.payEnergy = item.payEnergy
      this.edit.requiredItem = item.requiredItem
      this.edit.flush = item.flush
      this.edit.redo = item.redo
      this.edit.quest = item.quest
      this.edit.role = item.role
      this.edit.max = item.max
    },
    clearEditQuest () {
      this.edit.active = false
      this.edit.name = ''
      this.edit.description = ''
      this.edit.npc = ''
      this.edit.place = ''
      this.edit.prize = []
      this.edit.requiredEnergy = 0
      this.edit.requiredEnergy = 0
      this.edit.requiredItem = []
      this.edit.flush = false
      this.edit.redo = false
      this.edit.quest = ''
      this.edit.role = ''
      this.edit.max = 0
    },
    editQuest () {
      if (this.edit.max.length === 0) {
        this.edit.max = 1
      }
      let payload = {}
      payload.name = this.edit.name
      payload.description = this.edit.description
      payload.npc = this.edit.npc
      payload.place = this.edit.place
      payload.prize = this.getPrizePayload(this.edit.prize)
      payload.requiredEnergy = parseInt(this.edit.requiredEnergy)
      payload.payEnergy = parseInt(this.edit.payEnergy)
      payload.requiredItem = this.getRequiredItemPayload(this.edit.requiredItem)
      payload.flush = this.edit.flush
      payload.redo = this.edit.redo
      payload.quest = this.edit.quest
      payload.role = this.edit.role
      payload.max = parseInt(this.edit.max)
      firestore().collection('quests').doc(this.edit.id).update(payload)
      this.clearEditQuest()
    },
    prepareDeleteQuest (item, key) {
      this.deleting.active = true
      this.deleting.name = item.name
      this.deleting.id = key
      this.deleting.header = 'Delete This Quest?'
      this.deleting.msg = 'You\'re about to delete ' + item.name
    },
    clearDeleteQuest () {
      this.deleting.active = false
      this.deleting.name = null
      this.deleting.id = null
      this.deleting.header = null
      this.deleting.msg = null
    },
    deleteQuest () {
      firestore().collection('quests').doc(this.deleting.id).delete()
      firestore().collection('sessions').doc(this.deleting.id).delete()
      this.clearDeleteQuest()
    },
    validateEnergy (el) {
      if (el.keyCode >= 48 && el.keyCode <= 57) {
        return true
      } else {
        el.preventDefault()
      }
    },
    getNextId (id) {
      let nextId = (id + 1).toString()
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
    },
    getPrizePayload (prize) {
      let tmp = {}
      prize.map((item) => {
        if (item.count.length === 0) {
          item.count = 1
        }
        tmp[item.id] = parseInt(item.count)
      })
      return tmp
    },
    getRequiredItemPayload (requiredItem) {
      let tmp = {}
      requiredItem.map((item) => {
        if (item.count.length === 0) {
          item.count = 1
        }
        tmp[item.id] = parseInt(item.count)
      })
      return tmp
    }
  },
  computed: {
    itemsOption () {
      let data = []
      for (const key of Object.keys(this.items)) {
        let payload = {
          available: this.items[key].available,
          description: this.items[key].description,
          id: key,
          img: this.items[key].img,
          name: this.items[key].name
        }
        data.push(payload)
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
td {
  vertical-align: middle;
}
.black {
  background-color: #000000;
}
</style>
