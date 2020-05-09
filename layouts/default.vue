<template>
  <el-container class="layout-default">
    <el-header style="height: 200px">
      <my-header/>
    </el-header>
    <el-main>
      <Nuxt/>
    </el-main>
    <el-footer height="100%">
      <my-footer/>
    </el-footer>
  </el-container>
</template>
<script>
  import MyHeader from '@/components/public/header/index.vue'
  import MyFooter from '@/components/public/footer/index.vue'
  export default {
    components: {
      MyHeader,
      MyFooter
    }
  }
</script>
<style lang="scss">
</style>
