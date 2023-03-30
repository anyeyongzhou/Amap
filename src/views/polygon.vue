<template>
  <!-- <router-view></router-view> -->
  <div class="index_container">
    <div class="search_wrap">
      <search></search>
    </div>
    <div class="polygon_edit_wrap">
      <polygon-edit></polygon-edit>
    </div>
    <div class="infowindow_wrap">
      <info-window></info-window>
    </div>
  </div>
</template>

<script setup>
import PolygonEdit from '../components/PolygonEdit/PolygonEdit.vue'
import Search from '../components/Search/Search.vue'
import InfoWindow from '../components/InfoWidow/InfoWindow.vue'
</script>

<style lang="less" scoped>
.index_container {
  height: 100%;
  width: 100%;
  position: relative;
}
.polygon_edit_wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 80%;
}
.search_wrap {
  position: absolute;
  top: 9%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 60px;
  width: 400px;
}
.infowindow_wrap {
  position: absolute;
  width: 33%;
  z-index: 10;
  background-color: #ffffff;
  opacity: 0.9;
}
</style>
