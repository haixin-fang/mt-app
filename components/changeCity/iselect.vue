<template>
  <div class="m-iselect">
    <span class="nam">按省份选择:</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span class="nam">直接搜索:</span>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script type="text/ecmascript-6">
  import _ from 'lodash'
  export default {
    data(){
      return {
        province: [],
        pvalue: '',
        city: [],
        cvalue: '',
        input: '',
        cities: []
      }
    },
    watch: {
      pvalue: async function(newProvince){
        let self = this
        let {status, data: {city}} = await self.$axios.get(`/geo/province/${newProvince}`)
        if(status === 200){
          self.city = city.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          self.cvalue = ''
        }
      }
    },
    async mounted(){
      let self = this
      let {status, data: {province}} = await self.$axios.get('/geo/province')
      if(status === 200){
        self.province = province.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    },
    methods: {
      querySearchAsync: _.debounce(async function(query, cb){
        let self= this
        if(self.cities.length){
          cb(self.cities.filter(item => item.value.indexOf(query)>-1))
        }else{
          let {status, data: {city}} = await self.$axios.get('/geo/city')
          if(status === 200){
            self.cities = city.map(item => {
              return {
                value: item.name
              }
            })
            cb(self.cities.filter(item => item.value.indexOf(query)>-1))
          }else{
            cb([])
          }
        }
      }, 200),
      handleSelect(item){
//        this.$store.state.geo.position.city = item.value
        location.href = '/'
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/css/changecity/iselect.scss'
</style>
