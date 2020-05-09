<template>
  <div class="m-geo">
    <i class="el-icon-location"/> {{ $store.state.geo.position.province }}
    <nuxt-link
      class="changCity"
      to="/changeCity">切换城市</nuxt-link>
    [南充 天津 {{ $store.state.geo.position.city }}]
  </div>
</template>
<script>
  export default {
//    async mounted(){
//      let {status, data} = await this.$axios.get('/geo/getPosition')
//      if(status === 200){
//        console.log(data.province)
//        console.log(data.city)
//      }
//    }
  }
</script>
<style lang="scss">

</style>
