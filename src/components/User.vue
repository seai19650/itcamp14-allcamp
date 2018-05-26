<template>
  <div v-if="user !== null && energy" class="row p-3">
      <div class="col-3" id="profile">
        <div class="wall">
          <img :src="user.photoURL" alt="">
        </div>
        <p class="role">{{user.role}}</p>
      </div>
      <div class="col-9" id="info">
        <p class="name mb-1">{{user.name}}</p>
        <health :health="user.health"/>
        <h3 ref="energy" class="energy text-left">{{ energy }} <small>energy</small></h3>
      </div>
  </div>
</template>

<script>
import Health from '@/components/Health'
export default {
  name: 'User',
  props: ['user', 'energy'],
  components: {Health},
  watch: {
    energy () {
      if (this.$refs.energy !== undefined) {
        if (this.user.energy.toString().length > 9) {
          this.$refs.energy.style.fontSize = 30 - (this.user.energy.toString().length - 9) * 2.5 + 'px'
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
    bottom: 0;
    left: 0;
    position: absolute;
    margin: 0;
    background-color: rgb(3, 54, 129);
    color: #fff;
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
}

.role {
  border-radius: 0.25em;
}

</style>
