<template>
  <div v-if="user !== null" class="row p-3">
      <div class="col-auto" id="profile">
        <div class="wall">
          <img :src="user.photoURL" alt="">
        </div>
        <p class="role">{{user.role}}</p>
      </div>
      <div class="col" id="info">
        <p class="name mb-1">{{user.name}}</p>
        <health :health="user.health"/>
        <h3 class="energy text-left">{{ user.energy }} <small>energy</small></h3>
      </div>
  </div>
</template>

<script>
import Health from '@/components/Health'
export default {
  name: 'User',
  props: ['user'],
  components: {Health}
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
}

.role {
  border-radius: 0.25em;
}

</style>
