<template>
  <div class="m-menu">
    <dl
      class="nav"
      @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd
        v-for="(item, index) in $store.state.home.menu"
        :key="index"
        @mouseenter="mouseenter">
        <i :class="item.type"/>{{ item.name }}<span class="arrow"/>
      </dd>
    </dl>
    <div
      class="detail"
      v-if="kind"
      @mouseenter="sover"
      @mouseleave="sout">
      <h4>{{ detail.title }}</h4>
      <span
        v-for="item in detail.child"
        :key="item">{{ item }}</span>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        kind: '',
        menu:[{
          type:'food',
          name:'美食',
          child:[{
            title:'美食',
            child:['代金券','甜点饮品','火锅','自助餐','小吃快餐']
          }]
        },{
          type:'takeout',
          name:'外卖',
          child:[{
            title:'外卖',
            child:['美团外卖']
          }]
        },{
          type:'hotel',
          name:'酒店',
          child:[{
            title:'酒店星级',
            child:['经济型','舒适/三星','高档/四星','豪华/五星']
          }]
        }]
      }
    },
    computed: {
      detail(){
        let arr = this.$store.state.home.menu.filter(item => item.type === this.kind)
        let child = arr[0]
        child = JSON.parse(JSON.stringify(child)).child[0]
        let title = JSON.parse(JSON.stringify(child)).title
        child = JSON.parse(JSON.stringify(child.child))
        return {title, child}
      }
    },
    methods: {
      mouseleave(){
        let self = this;
        self._timer = setTimeout(function(){
          self.kind = ''
        }, 200)
      },
      mouseenter(e){
        this.kind = e.target.querySelector('i').className
      },
      sover(){
        clearTimeout(this._timer)
      },
      sout(){
        this.kind = ''
      }
    }

  }
</script>
