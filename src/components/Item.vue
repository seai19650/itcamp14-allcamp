<template>
  <div v-if="count != null, item != null" class="item row">
    <div class="col-2 img">
      <img class="img-item" :src="item.img" alt="">
    </div>
    <div class="col-6 name text-left">{{item.name}}</div>
    <div class="col-2 count">{{count}}</div>
    <div class="col-2 trade" @click="active = true"><i class="fas fa-angle-right"></i></div>
    <div v-if="active" class="overlay">
      <div class="content">
        <div class="container">
          <div class="row">
            <div class="col">
              <h3>{{item.name}}</h3>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col">
                  <div class="wall">
                    <img class="img-info" :src="item.img" alt="">
                  </div>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col py-3 desc">
                  <p>{{item.description}}</p>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col">
              <button style="background-color: rgb(59, 59, 59)" class="btn btn-spread" @click="abort">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: ['item', 'count'],
  data () {
    return {
      active: false
    }
  },
  methods: {
    abort () {
      this.active = false
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  overflow: hidden;
  margin: 1em 0;
  border-radius: 0.25em;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  .img-item {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
  }
  .count {
    background-color: rgb(3, 21, 48);
    color: #fff;
    padding: 0.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .name {
    padding: 1em 0.2em;
  }
  .trade {
    background-color: rgb(3, 54, 129);
    color: #fff;
    padding: 0.5em;
    border-radius: 0 0.25em 0.25em 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
}

.overlay {
  .content {
    width: 90vw;
    max-width: 400px;
  }
  .img-info {
    max-width: 250px;
    height: auto;
  }
  .desc {
    margin-top: 2px;
  }
  .btn-group {
    margin-bottom: 3px;
    .btn {
      margin: 3px;
      float: left;
      position: relative;
      display: block;
      border: none;
      padding: 1em 2em;
      color: #fff;
      border-radius: 0.25em;
      text-align: center;
    }
  }
}
.wall {
  max-width: 250px;
  overflow: hidden;
  border-radius: 10px;
  margin: 0 auto;
}
</style>
