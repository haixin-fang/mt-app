<template>
  <div>
    <div
      :id="id"
      :style="{width:width+'px',height:height+'px',margin:'34px auto'}"
      class="m-map"/>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
          width: {
            type:Number,
            default:300
          },
          height: {
            type:Number,
            default:300
          },
          point: {
            type:Array,
            default(){
              return [102.54,30.5]
            }
          }
        },
        data () {
            return {
              id: `map`,
              key: '6f8d985a2009a6f6bb9e0f9cb7013d2f'
          }
        },
        mounted(){
          let self = this
//           使用了该组件，id名就不一样
          self.id = `map${Math.random().toString().slice(4, 6)}`
          window.onMapLoad  = function(){
            var map = new window.AMap.Map(`${self.id}`, {
              resizeEnable: true,
              zoom: 11,
              center: self.point
            });
            self.map = map
            //配置插件
            AMap.plugin('AMap.ToolBar',function(){//异步加载插件
              var toolbar = new window.AMap.ToolBar();
              map.addControl(toolbar);
              var marker = new window.AMap.Marker({
                position: self.point,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: '北京'
              });
              self.marker = marker
              marker.setMap(map)
            });
          }
          var url = `https://webapi.amap.com/maps?v=1.4.15&key=${self.key}&callback=onMapLoad`;
          var jsapi = document.createElement('script');
          jsapi.charset = 'utf-8';
          jsapi.src = url;
          document.head.appendChild(jsapi);
        },
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
