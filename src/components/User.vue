<template>
  <div v-if="user !== null && energy !== null" class="row p-3">
      <div class="col-3 p-0 flex-center" id="profile">
        <div class="wall mx-auto">
          <img :src="user.photoURL" alt="">
        </div>
        <p class="mb-0 role">{{user.role}}</p>
      </div>
      <div class="col-9 p-0" id="info">
        <p class="name mb-1">{{user.name}} : <span class="text-capitalize text-info">{{user.house}}</span></p>
        <health :health="user.health"/>
        <h3 v-if="!energyGone" ref="energy" class="energy text-left">{{ formatEnergy(energy) }} <small>energy</small></h3>
        <h3 v-else ref="energy" class="energy text-left text-danger">0 <small>energy</small></h3>
      </div>
  </div>
</template>

<script>
import Health from '@/components/Health'
export default {
  name: 'User',
  props: ['user', 'energy', 'energyGone'],
  components: {Health},
  methods: {
    formatEnergy(energy) {
      return energy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  },
  watch: {
    energy () {
      if (this.$refs.energy !== undefined) {
        if (this.user.energy.toString().length > 9) {
          this.$refs.energy.style.fontSize = 30 - Math.min(16 ,(this.user.energy.toString().length - 9) * 2.5) + 'px'
        } else {
          this.$refs.energy.style.fontSize = '30px'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#profile {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  .wall {
    width: 60px;
    height: 60px;
    position: relative;
    border: 1px solid #000;
    border-radius: 50%;
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
  p {
    text-align: center;
    width: 100%;
    padding: 0.2em;
    color: rgb(0, 0, 0);
  }
}

#info {
  .name {
    text-align: left;
  }
}

.energy {
  margin-top: 10px;
  border-left: 5px solid #000;
  padding-left: 10px;
  font-size: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  border-radius: 0.25em;
}

</style>
