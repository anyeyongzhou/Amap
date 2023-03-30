<template>
  <el-row>
    <el-col :span="24" class="showMessage_container">
      <el-text>信息展示</el-text>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="5">
      <el-text>地址：</el-text>
    </el-col>
    <el-col :span="19">
      <el-text>{{ placeAddress }}</el-text>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="5">
      <el-text>坐标：</el-text>
    </el-col>
    <el-col :span="19">
      <el-text>{{ placeLocation }}</el-text>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
const placeAddress = ref('')
const placeLocation = ref('')
const store = useStore()
watch(store.state, (newVal) => {
  placeAddress.value = newVal.mouseGetMessage.address
  placeLocation.value = newVal.mouseGetMessage.lngLat
})
</script>

<style lang="less" scoped>
.showMessage_container {
  text-align: center;
}
</style>
