<template>
  <div class="container" ref="demo">123</div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

const demo = ref(null)
var mCharts = null
var option = {}
onMounted(() => {
  mCharts = echarts.init(demo.value)
  mCharts.setOption(option)
})
</script>

<style lang="less" scoped>
.container {
  width: 800px;
  height: 600px;
}
</style>
