<template>
  <div class="m-product-select">
    <dl class="tab">
      <dt>{{ name }}<i class="el-icon-arrow-down el-icon--right"/></dt>
      <dd>
        <h3>{{ name }}</h3>
        <span
          v-for="(item, idx) in list"
          :key="idx">
          <a :href="'/products?keyword='+encodeURIComponent(item)">{{ item }}</a>
        </span>
      </dd>
    </dl>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default(){
          return []
        }
      }
    }
  }
</script>
