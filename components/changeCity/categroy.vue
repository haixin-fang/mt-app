<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">
          {{ item }}
        </a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">
        {{ item.title }}
      </dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">
          {{ c }}
        </span>
      </dd>
    </dl>
  </div>
</template>

<script type="text/ecmascript-6">
  import pyJS from 'js-pinyin'
  export default {
    data(){
      return {
        list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        block: []
      }
    },
    async mounted(){
    let self = this
    let block = []
    let {status, data: {city}} = await self.$axios.get('/geo/city')
    if(status === 200){
      let p //首字母
      let c //对应首字母的码
      let d = {} // 每个字母对应的城市 {a: ['']}
      city.forEach(item => {
        p = pyJS.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
        c = p.charCodeAt(0)
        if(c>96 && c<123){
          if(!d[p]){
            d[p] = []
          }
          d[p].push(item.name)
        }
      })
      for(let [k,v] of Object.entries(d)){
        block.push({
          title: k.toUpperCase(),
          city: v
        })
      }
      block.sort((a,b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      self.block = block
    }
  }
}

</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
