<template>
  <div v-if="items != null, userItem != null" id="items">
    <h2>ไอเทม</h2>
    <item v-if="items != null" v-for="(count, key) in userItem" :key="key" :count="count" :item="items[key]"/>
    <p class="text-muted" v-if="state">ไม่มีไอเทม</p>
  </div>
</template>

<script>
import Item from '@/components/Item'
import { firestore } from 'firebase'
export default {
  name: 'Items',
  props: ['userItem', 'state'],
  components: {Item},
  data () {
    return {
      items: null
    }
  },
  mounted () {
    this.getItems()
  },
  methods: {
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
    }
  }
}
</script>
