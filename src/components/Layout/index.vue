<template>
  <router-view />
  <FooterNav />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterNav from './footer/index.vue'

export default defineComponent({
  name: 'layout',
  components: {
    FooterNav
  }
})

</script>