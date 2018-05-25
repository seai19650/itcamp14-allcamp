<template>
  <div v-if="health != null" id="health" class="row">
    <div class="col pr-0">
      <div :class="['bar', {active: health >= 1}]"></div>
    </div>
    <div class="col px-0">
      <div :class="['bar', {active: health >= 2}]"></div>
    </div>
    <div class="col pl-0">
      <div :class="['bar', {active: health >= 3}]"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Health',
  props: ['health']
}
</script>

<style lang="scss" scoped>
.bar {
  height: 20px;
  border: 2px solid #fff;
  background-color: rgb(212, 212, 212);
  border-radius: 0.25em;
}
.active {
  background-color: rgb(36, 110, 36);
}
</style>
