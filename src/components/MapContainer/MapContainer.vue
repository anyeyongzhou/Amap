<template>
  <div id="container"></div>
</template>

<script setup>
/* import { ref, reactive, toRef, toRefs,computed,watch， watchEffect,provide,inject,useSlots,useAttrs,onMounted,onUpdated,onUnmounted,onBeforeMount,onBeforeUpdate,onBeforeUnmount,shallowRef,shallowReactive,} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps({})
const emit = defineEmits([]) */
//引入AMapLoader
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, onMounted, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import ShowMessage from '../../utils/message.js'
import { ElNotification } from 'element-plus'
const showMessage = new ShowMessage()
const store = useStore()
//引入秘钥
window._AMapSecurityConfig = {
  securityJsCode: 'ab50347180e98051a8caac09781b9f6e'
}

//data数据声明
let data = null
let map = null

//AutoComplement输入提示控件参数
//autoOptions是我们要接收的input输入框的id对象所以在其中定义input接收值为空
const autoOptions = reactive({ input: '' })
const searchPlaceInput = ref('')

//城市搜索关键字
let placeSearch = {}
//地图搜索方法，e是回调，e.poi.adcode城市ID,e.poi.name城市名字
const select = (e) => {
  placeSearch.setCity(e.poi.adcode)
  placeSearch.search(e.poi.name) //关键字查询查询
  //地图层级
  //map.setZoom(10, true)
}

//监听store,state的searchInput变化
watch(store.state.searchInput, (newVal) => {
  autoOptions.input = newVal.inputId
  searchPlaceInput.value = newVal.userInput
})

//是否展示热力图的标志
let showThermalMap = false

//监听store,state的thermalMapIsChecked变化
watch(
  () => store.state.thermalMapIsChecked,
  (newVal) => {
    showThermalMap = newVal
    if (showThermalMap) {
      showThermalOut()
    }
  }
)

//热力图坐标点搜索
const showThermalOut = () => {
  map.plugin(['AMap.PlaceSearch'], () => {
    //构造地点查询类
    var placeSearch = new AMap.PlaceSearch({
      pageSize: 50, // 单页显示结果条数
      pageIndex: 1, // 页码
      city: searchPlaceInput, // 兴趣点城市
      citylimit: true //是否强制限制在设置的城市内搜索
      //map: this.map, // 展现结果的地图实例
      // panel: 'panel', // 结果列表将在此容器中进行展示。
      // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    })
    //关键字查询
    placeSearch.search('商场', (status, result) => {
      // console.log(result)
      getHotChartPos('商场', result)
    })
  })
  ElNotification({
    title: '成功',
    message: '热力图获取成果，但是由于电脑性能，我们仅加载部分数据',
    type: 'success'
  })
}

//对搜索到的数据进行实际的获取
const getHotChartPos = (detail, result) => {
  console.log(result)
  let lengthSize = result.poiList.pageSize
  const count = result.poiList.count
  // const lengthPage = count / lengthSize
  if (lengthSize > count) {
    lengthSize = count
  }
  for (var n = 0; n < 2; n++) {
    // this.map.plugin(['AMap.PlaceSearch'], () => {
    //构造地点查询类
    var realSearch = new AMap.PlaceSearch({
      pageSize: 50, // 单页显示结果条数
      pageIndex: n + 1, // 页码
      city: searchPlaceInput, // 兴趣点城市
      citylimit: true //是否强制限制在设置的城市内搜索
      // map: this.map, // 展现结果的地图实例
      // panel: 'panel', // 结果列表将在此容器中进行展示。
      // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    })
    realSearch.search(detail, (status, result) => {
      // for (var j = 0; j < 50; j++) {
      // this.map.remove(this.map.getAllOverlays('marker'))
      //var centerPoint = [result.poiList.pois[j].location.lng, result.poiList.pois[j].location.lat]
      // console.log(result)
      //热力图
      showHatChart(result)
      // }
    })
  }
}

//展示热力图
const showHatChart = (result) => {
  var info = []
  for (let i = 0; i < 50; i++) {
    info.push({
      lng: result.poiList.pois[i].location.lng,
      lat: result.poiList.pois[i].location.lat,
      count: 3 * 6.4 * Math.round(Math.random() * (10 - 2) + 2)
    })
  }

  map.plugin(['AMap.HeatMap'], () => {
    // console.log('nn')
    //初始化heatmap对象
    heatmap = new AMap.HeatMap(this.map, {
      radius: 56, //给定半径
      opacity: [0, 0.5]
      /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
    })
    //设置数据集
    heatmap.setDataSet({
      data: info,
      max: 100
    })
    heatmapList.push(this.heatmap)
    heatmap.show()
  })
}

//用于drawBounds函数
let district = null
let polygons = []

//poi搜索
watch(searchPlaceInput, (newVal) => {
  placeSearch.search(newVal)
  map.setZoom(16, true, 1)
  drawBounds(newVal)
})

//auto是用于我们进行输入提示的接收变量，由于是new出的一个对象所以定义初始值为null
let auto = null

//构建初始化地图方法
const initMap = () => {
  AMapLoader.load({
    key: 'dcb3841ae0e471fed5651fea3aa69487', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    // plugins需要使用的的插件列表
    //'AMap.Control'地图控件基类，可扩展做自定义地图控件
    //'AMap.Scale'比例尺
    //'AMap.ToolBar'地图操作工具条插件。可支持方向导航、位置定位、视野级别缩放、视野级别选择等操作
    //'AMap.ControlBar'组合了旋转、倾斜、复位在内的地图控件。
    //'AMap.MapType'地图类型切换插件。用户通过该插件进行地图切换
    //'AMap.HawkEye'鹰眼控件，用于显示缩略地图，显示于地图右下角，可以随主图的视口变化而变化，也可以配置成固定位置实现类似于南海附图的效果。
    //'AMap.Geolocation'回到本身位置
    //'AMap.PlaceSearch'
    //'AMap.AutoComplete'输入提示控件
    plugins: [
      'AMap.Scale',
      'AMap.AutoComplete',
      'AMap.PlaceSearch',
      'AMap.HawkEye'
    ]
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '2D', //是否为3D地图模式
        zoom: 10, //初始化地图级别
        center: [121.473667, 31.230525] //初始化地图中心点位置
      })
      //添加比例尺控件
      /*  map.addControl(new AMap.Scale())
      map.addControl(new AMap.ToolBar())
      map.addControl(new AMap.ControlBar())
      map.addControl(new AMap.MapType())
      map.addControl(new AMap.HawkEye())
      map.addControl(new AMap.Geolocation()) */
      map.addControl(new AMap.Scale())
      map.addControl(new AMap.HawkEye())

      //触发输入提示
      auto = new AMap.AutoComplete(autoOptions)

      //城市poi搜索逻辑
      placeSearch = new AMap.PlaceSearch({
        map: map
      })
      //构造地点查询类
      auto.on('select', select)
    })
    .catch((e) => {
      console.log(e)
    })
}

//边界绘制函数
const drawBounds = (newValue) => {
  // 行政区区域划分
  //加载行政区划插件
  if (!district) {
    //实例化DistrictSearch
    var opts = {
      subdistrict: 0, //获取边界不需要返回下级行政区
      extensions: 'all', //返回行政区边界坐标组等具体信息
      level: 'district' //查询行政级别为 市
    }

    map.plugin(['AMap.DistrictSearch'], () => {
      district = new AMap.DistrictSearch(opts)
    })
    // this.district = new AMap.DistrictSearch(opts)
  }
  //行政区查询
  district.search(newValue, (status, result) => {
    if (result.districtList != null && newValue != '') {
      showMessage.success('区域搜索成功')
      console.log(result)
      if (polygons != null) {
        map.remove(polygons) //清除上次结果
        polygons = []
      }
      var bounds = result.districtList[0].boundaries
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          var polygon = new AMap.Polygon({
            strokeWeight: 1,
            path: bounds[i],
            fillOpacity: 0.4,
            fillColor: '#80d8ff',
            strokeColor: '#0091ea'
          })
          polygons.push(polygon)
        }
      }

      map.add(polygons)
      map.setFitView(polygons) //视口自适应
    } else {
      showMessage.error('区域搜索失败')
    }
  })
}

//查询结果给出的提示
// const messageFeedBack = (message, type) => {
//   ElMessage({
//     message,
//     type
//   })
// }

onMounted(() => {
  initMap()
})
</script>

<style lang="less" scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
}
</style>
