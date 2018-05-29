<template>
  <div v-if="systemEnv !== {}" ref="outer" id="live">
    <div ref="bar" id="house-status" class="container-fluid">
      <div class="row py-3">
        <div class="col mx-1 status">
          <p class="mb-0 mt-1">Drop : energy</p>
          <hr class="my-1">
          <h3>{{formatEnergy(dropValue)}}</h3>
        </div>
        <div class="col mx-1 status">
          <p class="mb-0 mt-1">Pro : energy</p>
          <hr class="my-1">
          <h3>{{formatEnergy(proValue)}}</h3>
        </div>
        <div class="col mx-1 status">
          <p class="mb-0 mt-1">Re : energy</p>
          <hr class="my-1">
          <h3>{{formatEnergy(reValue)}}</h3>
        </div>
        <div class="col mx-1 status">
          <p class="mb-0 mt-1">Tire : energy</p>
          <hr class="my-1">
          <h3>{{formatEnergy(tireValue)}}</h3>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div id="columns">
        <figure v-for="(quest, key) in quests" :key="key">
          <div class="content">
            <div class="row">
              <div class="col">
                <h3>{{quest.name}}</h3>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col">
                <p>{{quest.description}}</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col">
                <p class="mb-0 text-info">Quest Code</p>
                <h2>{{key}}</h2>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </div>
  </div>
</template>


<script>
import User from '@/helper/user'
import { firestore } from 'firebase'
export default {
  name: 'Live',
  metaInfo: {
    title: 'Live'
  },
  data () {
    return {
      users: {},
      quests: {},
      items: {},
      systemEnv: {}
    }
  },
  mounted () {
    this.getSystemEnv()
    this.getUsers()
    this.getItems()
    this.getQuests()
    this.$refs.outer.style.paddingTop = this.$refs.bar.scrollHeight + 'px'
  },
  methods: {
    formatEnergy(energy) {
      return energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
    getUsers () {
      firestore().collection('users').where('mode', '==', 'player').onSnapshot(users => {
        let tmp = {}
        users.forEach((user) => {
          tmp[user.id] = user.data()
        })
      this.users = tmp
      })
    },
    getQuests () {
      firestore().collection('quests').where('quest', '==', 'extra').onSnapshot(snapshot => {
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
    dropValue () {
      return User.getUsersEnergyByHouse(this.users, 'drop', this.systemEnv)
    },
    proValue () {
      return User.getUsersEnergyByHouse(this.users, 'pro', this.systemEnv)      
    },
    reValue () {
      return User.getUsersEnergyByHouse(this.users, 're', this.systemEnv)      
    },
    tireValue () {
      return User.getUsersEnergyByHouse(this.users, 'tire', this.systemEnv)      
    }
  }
}
</script>

<style lang="scss" scoped>
#house-status {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  background: #fff;
  .status {
    background: rgb(221, 221, 221);
    border-radius: 10px;
  }
}

#columns {
	column-width: 320px;
	column-gap: 15px;
  width: 95%;
	max-width: 1200px;
  margin: 20px auto;
  & figure {
    width: 100%;
    background: #fefefe;
    border: 2px solid #fcfcfc;
    box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4);
    margin: 0 2px 15px;
    padding: 15px;
    padding-bottom: 10px;
    transition: opacity .4s ease-in-out;
    display: inline-block;
    column-break-inside: avoid;
    position: relative;
    border-radius: 0.25em;
  }
}

@media screen and (max-width: 750px) { 
  #columns { column-gap: 0px; }
  #columns figure { width: 100%; }
}
</style>
