<template>
  <!-- <router-view></router-view> -->
  <div class="index_container">
    <div class="search_wrap">
      <search></search>
    </div>
    <div class="map_wrap">
      <map-container></map-container>
    </div>
  </div>
</template>

<script setup>
/* import { ref, reactive, toRef, toRefs,computed,watch， watchEffect,provide,inject,useSlots,useAttrs,onMounted,onUpdated,onUnmounted,onBeforeMount,onBeforeUpdate,onBeforeUnmount,shallowRef,shallowReactive,} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({})
const emit = defineEmits([]) */
import MapContainer from '../components/MapContainer/MapContainer.vue'
import Search from '../components/Search/Search.vue'
</script>

<style lang="less" scoped>
.index_container {
  height: 100%;
  width: 100%;
  position: relative;
}
.map_wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 60%;
  width: 60%;
}
.search_wrap {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 60px;
  width: 400px;
}
</style>
