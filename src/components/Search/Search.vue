<template>
  <el-input
    v-model="inputObject.userInput"
    placeholder="输入你要查找的关键词"
    :id="inputObject.inputId"
    @keyup.enter="searchClick"
  >
    <template #prefix>
      <el-icon class="el-input__icon" @click="searchClick"><search /></el-icon>
    </template>
    <template #suffix>
      <el-icon class="el-input__icon" @click="clearClick"><Close /></el-icon>
    </template>
  </el-input>
</template>

<script setup>
/* import { ref, reactive, toRef, toRefs,computed,watch， watchEffect,provide,inject,useSlots,useAttrs,onMounted,onUpdated,onUnmounted,onBeforeMount,onBeforeUpdate,onBeforeUnmount,shallowRef,shallowReactive,} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({})
const emit = defineEmits([]) */
//import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
//防抖
import debounce from 'lodash/debounce'
//节流
import throttle from 'lodash/throttle'
const store = useStore()

const inputObject = reactive({
  userInput: '',
  inputId: 'searchInput'
})
/* const searchClick = debounce(() => {
  //console.log('防抖函数执行')
  store.commit('setSearchInput', inputObject)
}, 1000) */

const searchClick = () => {
  store.commit('setSearchInput', inputObject)
}

const clearClick = () => {
  // console.log('clear')
}
onMounted(() => {
  searchClick()
})
</script>

<style lang="less" scoped>
.search_input {
  width: 100%;
  height: 100%;
}
</style>
