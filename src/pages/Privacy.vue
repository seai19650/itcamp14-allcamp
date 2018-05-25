<template>
  <div class="container-fluid flex-center" style="height: 100vh">
    <div class="container contact">
      <div class="row pt-5">
        <div class="col">
          <h1>Privacy Policy</h1>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col">
          <p>เราเก็บข้อมูลพื้นฐานเพื่อใช้ในการทำงานของ Web Application เช่น Facebook UID เพื่อใช้ในการระบุตัวต้น,
            ชื่อผู้ใช้งานที่แสดงบน Facebook, Email-Address, ลิ้งค์รูปภาพโปรไฟล์บน Facebook เพื่อนำมาแสดงบนหน้าเว็บ
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacy',
  metaInfo: {
    title: 'Privacy'
  }
}
</script>

<style lang="scss" scoped>
.contact {
  background-color: #fff;
  position: relative;
  border-radius: 8px 50px;
  max-width: 450px;
}
</style>
