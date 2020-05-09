<template>
  <div class="page-cart">
    <el-row>
      <el-col
        :span="24"
        class="m-cart"
        v-if="1 || cart.length">
        <list :cart-data="cart"/>
        <p>
          预付金额： <em class="money">￥{{ total }}</em>
        </p>
        <div class="post">
          <el-button
            type="primary"
            @click="submit">提交订单</el-button>
        </div>
      </el-col>
      <el-col
        :span="24"
        class="empty"
        v-else>购物车为空</el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import List from '@/components/cart/list.vue'
  export default {
    components: {
      List
    },
    data(){
      return {
        cart: []
      }
    },
    computed: {
      total(){
        let total = 0
        this.cart.forEach(item => {
          total = item.count*item.price
        })
        return total
      }
    },
    methods: {
      submit(){

      }
    },
    async asyncData(ctx){
      let {status, data: {code,data: {name, price}}} = await ctx.$axios.post('/cart/getCart', {
        id: ctx.query.id
      })
      if(status===200&&code===0){
        return {
          cart: [{
            name,
            price,
            count:1
          }],
          cartNo: ctx.query.id
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/css/cart/index.scss'
</style>
