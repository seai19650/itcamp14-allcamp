<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2 p-0">
        <navigation />
      </div>
      <div class="col" id="display">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/admin/Navigation'
export default {
  name: 'Dashboard',
  components: {Navigation},
  metaInfo: {
    titleTemplate: '%s | Console'
  }
}
</script>

<style lang="scss" scoped>
#display {
  overflow-y: auto;
  height: 100vh;
  background-color: rgba(255,255,255,0.85)
}
</style>
