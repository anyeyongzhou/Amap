<template>
  <div id="heat_map_search_box_container">
    <el-radio-group>
      <el-checkbox
        v-model="checked"
        label="热力图显示"
        size="large"
        @change="checkedChange"
      />
    </el-radio-group>
  </div>
</template>

<script setup>
/* import { ref, reactive, toRef, toRefs,computed,watch， watchEffect,provide,inject,useSlots,useAttrs,onMounted,onUpdated,onUnmounted,onBeforeMount,onBeforeUpdate,onBeforeUnmount,shallowRef,shallowReactive,} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({})
const emit = defineEmits([]) */
import { ref } from 'vue'
import { useStore } from 'vuex'
const checked = ref(false)
const store = useStore()
const checkedChange = () => {
  store.commit('setThermalMap', checked.value)
}
</script>

<style lang="less" scoped>
#heat_map_search_box_container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
