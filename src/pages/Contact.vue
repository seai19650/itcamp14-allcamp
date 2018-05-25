<template>
  <div v-if="uid !== null" class="container-fluid center">
    <div class="container contact">
      <div class="row">
        <div class="col">
          <h1>Oops!</h1>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col">
          <h2>{{ uid }}</h2>
        </div>
      </div>
      <hr>
      <div class="row mb-4">
        <div class="col">
          เหมือนว่าจะเกิดความผิดพลาดกับการยืนยันตัวของน้อง ลองไปติดต่อโต๊ะลงทะเบียนนะ!
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button @click="setWall" class="btn-theme-1 text-white">กลับไปหน้าเข้าสู่ระบบ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contact',
  data () {
    return {
      uid: null
    }
  },
  mounted () {
    this.uid = this.$route.params.uid
  },
  methods: {
    setWall () {
      window.localStorage.setItem('justOut', true)
      this.$router.replace('/login')     
    }
  }
}
</script>

<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.contact {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 8px 50px;
  padding: 20px 10px;
  position: relative;
  max-width: 450px;
}
</style>
