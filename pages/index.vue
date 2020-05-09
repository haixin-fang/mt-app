<template>
  <div class="page-index">
    <el-row>
      <el-col :span="5">
        <emenu/>
      </el-col>
      <el-col :span="19">
        <Left/>
      </el-col>
    </el-row>
    <el-row :span="24">
      <Artistic/>
    </el-row>
  </div>
</template>

<script>
import Emenu from '../components/index/menu.vue'
import Left from '../components/index/left.vue'
import Artistic from '../components/index/artistic.vue'
export default {
  components: {
    Emenu,
    Left,
    Artistic
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/index/index.scss'
</style>
