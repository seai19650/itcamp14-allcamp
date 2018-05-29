<template>
  <div class="container-fluid">
    <div class="container">
      <div class="row pt-5">
        <div class="col">
          <h1 class="console-header">World Control</h1>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col">
          <h3 class="text-center">Control</h3>
        </div>
      </div>
      <div class="row">
        <table class="table table-striped" style="table-layout: auto">
          <thead>
            <tr>
              <th>Action Name</th>
              <th style="width: 300px">Option</th>
              <th>Activation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">
                <h5 class="text-info">System Suspension</h5>
                <p class="mb-0">ห้ามผู้เล่นใช้งานระบบ</p>
              </td>
              <td>
                <div class="form-group col-12">
                  <label>บ้านที่จะห้ามใช้งาน : </label>
                  <multiselect
                      v-model="suspense.house"
                      :options="houses"
                      :multiple="true"
                      :close-on-select="false"
                      >
                    </multiselect>
                </div>
                <div class="form-group col-12">
                  <label>หน่วยงานที่จะห้ามใช้งาน : </label>
                  <multiselect
                      v-model="suspense.role"
                      :options="roles"
                      :multiple="true"
                      :close-on-select="false"
                      >
                    </multiselect>
                </div>
              </td>
              <td>
                <button @click="suspenseSystem" class="btn btn-info">
                  Apply
                </button>
              </td>
            </tr>
            <tr>
              <td class="text-left">
                <h5 class="text-info">Energy Consumption</h5>
                <p>ระงับการใช้ Energy ของผู้เล่น โดยแสดงให้เห็นว่า Energy เป็น 0</p>
              </td>
              <td>
                <div class="form-group col-12">
                  <label>บ้านที่จะระงับ : </label>
                    <multiselect
                      v-model="energySuspense.house"
                      :options="houses"
                      :multiple="true"
                      :close-on-select="false"
                      >
                    </multiselect>
                  </div>
                  <div class="form-group col-12">
                    <label>หน่วยงานที่จะระงับ : </label>
                    <multiselect
                      v-model="energySuspense.role"
                      :options="roles"
                      :multiple="true"
                      :close-on-select="false"
                      >
                    </multiselect>
                  </div>
              </td>
              <td>
                <button @click="suspenseEnergy" class="btn btn-info">
                  Apply
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr>
      <div class="row">
        <div class="col">
          <h3 class="text-center">Message</h3>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <textarea class="form-control" v-model="msg.data" cols="30" rows="5"></textarea>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="form-group col-6">
              <label>บ้านที่จะส่งไป : </label>
              <multiselect
                v-model="msg.house"
                :options="houses"
                :multiple="true"
                :close-on-select="false"
                >
              </multiselect>
            </div>
            <div class="form-group col-6">
              <label>หน่วยงานที่จะส่งไป : </label>
              <multiselect
                v-model="msg.role"
                :options="roles"
                :multiple="true"
                :close-on-select="false"
                >
              </multiselect>
            </div>
            <hr>
            <div class="col-12">
              <button @click="msgSender" class="btn btn-info">
                ส่งข้อความ
              </button>
            </div>
            <div class="col-12 mt-2">
              <p>ทุกข้อความที่ถูกส่งออกไปจากหน้านี้จะสามารถปิดได้โดยผู้รับ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { firestore } from 'firebase';
export default {
  name: 'WorldControl',
  components: {Multiselect},
  metaInfo: {
    title: 'World'
  },
  data () {
    return {
      msg: {
        data: '',
        house: [],
        role: []
      },
      suspense: {
        house: [],
        role: []
      },
      energySuspense: {
        house: [],
        role: []
      },
      roles: ['สายลับ', 'นักสะกดจิต', 'นักบิน', 'มือปืน'],
      houses: ['drop', 'pro', 're', 'tire']
    }
  },
  mounted () {
    this.getSystemEnv()
  },
  methods: {
    getSystemEnv () {
      firestore().collection('env').onSnapshot(snapshot => {
        let tmp = {}
        snapshot.forEach((env) => {
          tmp[env.id] = env.data()
        })
        this.msg = tmp['message']
        this.suspense = tmp['suspension']
        this.energySuspense = tmp['consumption']
      })
    },
    suspenseSystem () {
      if (this.suspense.house.length === 0 || this.suspense.role.length === 0) {
        firestore().collection('env').doc('suspension').update({
          house: null,
          role: null
        })        
      } else {
        firestore().collection('env').doc('suspension').update(this.suspense)        
      }
    },
    suspenseEnergy () {
      if (this.energySuspense.house.length === 0 || this.energySuspense.role.length === 0) {
        firestore().collection('env').doc('consumption').update({
          house: null,
          role: null
        })        
      } else {
        firestore().collection('env').doc('consumption').update(this.energySuspense)        
      }
    },
    msgSender () {
      if (this.msg.house.length === 0 || this.msg.role.length === 0 || this.msg.data.length === 0) {
        firestore().collection('env').doc('message').update({
          house: null,
          role: null,
          data: null
        })        
      } else {
        firestore().collection('env').doc('message').update(this.msg)        
      }
    }
  }
}
</script>
