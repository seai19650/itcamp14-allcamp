<template>
  <div class="overlay">
    <div class="content">
      <div class="container">
        <div class="row">
          <div class="col">
            <h1>{{header}}</h1>
            <p>{{msg}}</p>
          </div>
        </div>
        <div class="row btn-group">
          <button style="background-color: rgb(255, 60, 60)" class="btn col" @click="$emit('yes')">Delete</button>
          <button style="background-color: rgb(59, 59, 59)" class="btn col" @click="$emit('no')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  props: ['header', 'msg']
}
</script>

<style lang="scss" scoped>

</style>
