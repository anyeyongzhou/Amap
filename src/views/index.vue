<template>
  <!-- <router-view></router-view> -->
  <div class="index_container">
    <div class="search_wrap">
      <search></search>
    </div>
    <div class="map_wrap">
      <map-container></map-container>
    </div>
    <div class="theramalmap_wrap">
      <thermal-map></thermal-map>
    </div>
    <div class="infowindow_wrap">
      <info-window></info-window>
    </div>
  </div>
</template>

<script setup>
import MapContainer from '../components/MapContainer/MapContainer.vue'
import Search from '../components/Search/Search.vue'
import ThermalMap from '../components/ThermalMapBox/ThermalMapBox.vue'
import InfoWindow from '../components/InfoWidow/InfoWindow.vue'
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
.theramalmap_wrap {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  // height: 20px;
  // width: 20px;
  // border: 1px solid red;
  z-index: 10;
}
.infowindow_wrap {
  position: absolute;
  width: 33%;
  z-index: 10;
  background-color: #ffffff;
  opacity: 0.9;
}
</style>
