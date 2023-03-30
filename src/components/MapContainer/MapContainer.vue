<template>
  <div id="container"></div>
</template>

<script setup>
//引入AMapLoader
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, onMounted, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import ShowMessage from '../../utils/message.js'
import { ElNotification } from 'element-plus'
import getImageUrl from '../../utils/getImageByPath'
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
watch(store.state, (newVal) => {
  autoOptions.input = newVal.searchInput.inputId
  searchPlaceInput.value = newVal.searchInput.userInput
  // console.log(autoOptions.input)
  // console.log(searchPlaceInput.value)
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
      city: searchPlaceInput, // heatmap兴趣点城市
      citylimit: true //是否强制限制在设置的城市内搜索
      // map: this.map, // 展现结果的地图实例
      // panel: 'panel', // 结果列表将在此容器中进行展示。
      // autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    })
    realSearch.search(detail, (status, result) => {
      //热力图
      showHatChart(result)
      // }
    })
  }
}

let heatmap = null
//let heatmapList = null

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

  //初始化heatmap对象
  heatmap = new AMap.HeatMap(map, {
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
  heatmap.setDataSet({
    data: info,
    max: 100
  })
  heatmap.show()
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

let infoWindow = null
//回调函数
const placeSearch_CallBack = (data) => {
  //infoWindow.open(map, result.lnglat);
  var poiArr = data.poiList.pois
  var location = poiArr[0].location
  infoWindow.setContent(createContent(poiArr[0]))
  infoWindow.open(map, location)
}
const createContent = (poi) => {
  //信息窗体内容
  var s = []
  s.push(
    '<div class="info-title">' +
      poi.name +
      '</div><div class="info-content">' +
      '地址：' +
      poi.address
  )
  s.push('电话：' + poi.tel)
  s.push('类型：' + poi.type)
  s.push('<div>')
  return s.join('<br>')
}

//构建初始化地图方法
const initMap = () => {
  AMapLoader.load({
    key: 'dcb3841ae0e471fed5651fea3aa69487', // 申请好的Web端开发者Key，首次调用 load 时必填     dcb3841ae0e471fed5651fea3aa69487
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
      'AMap.HeatMap',
      'AMap.HawkEye',
      'AMap.Geocoder' //地理逆编码插件
    ]
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '2D', //是否为3D地图模式
        zoom: 10, //初始化地图级别
        center: [121.473667, 31.230525], //初始化地图中心点位置    121.473667, 31.230525   116.418261, 39.921984
        isHotspot: true
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

      //初始化heatmap对象
      // heatmap = new AMap.HeatMap(map, {
      //   radius: 56, //给定半径
      //   opacity: [0, 0.5]
      //   /*,
      //       gradient:{
      //           0.5: 'blue',
      //           0.65: 'rgb(117,211,248)',
      //           0.7: 'rgb(0, 255, 0)',
      //           0.9: '#ffea00',
      //           1.0: 'red'
      //       }
      //        */
      // })

      // 创建一个 Marker 实例：
      // const marker1 = new AMap.Marker({
      //   position: new AMap.LngLat(121.473667, 31.230525), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   title: '上海'
      // })

      // // 将创建的点标记添加到已有的地图实例：
      // map.add(marker1)

      // 创建 AMap.Icon 实例：
      const icon = new AMap.Icon({
        size: new AMap.Size(40, 50), // 图标尺寸
        image: getImageUrl('Marker.png'), // Icon的图像
        imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(20, 20) // 根据所设置的大小拉伸或压缩图片
      })

      /* var content =
        '<div style="height: 30px; width: 30px;"><img style="width: 100%; height: 100%" src="' +
        getImageUrl('Marker.png') +
        '"></img></div>' */

      // 将 Icon 实例添加到 marker 上:
      const marker2 = new AMap.Marker({
        position: new AMap.LngLat(121.473667, 31.230525),
        offset: new AMap.Pixel(-10, -10),
        //content: content,
        icon: icon,
        title: '自定义点标记',
        zoom: 13
      })

      map.add(marker2)

      //圆点标记
      let circleMarker = new AMap.CircleMarker({
        map,
        center: new AMap.LngLat(121.473667, 31.230525), //AMap.LngLat()经纬度坐标
        radius: 20
      })

      circleMarker.setMap(map)

      infoWindow = new AMap.InfoWindow({})
      map.on('hotspotover', function (result) {
        if (map.getZoom() >= 13) {
          placeSearch.getDetails(result.id, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              placeSearch_CallBack(result)
            }
          })
        }
      })

      //绑定鼠标点击事件
      map.on('click', (e) => {
        let lat = e.lnglat.lat
        let lng = e.lnglat.lng
        getLngLatService(lng, lat)
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

var geocoder = null
//逆向地址编码服务
const getLngLatService = (lng, lat) => {
  let poi = [lng, lat]
  let lnglat = new AMap.LngLat(lng, lat)
  geocoder = new AMap.Geocoder({
    city: '全国', //城市设为北京，默认：“全国”
    radius: 1000 //范围，默认：500
  })

  // 创建 AMap.Icon 实例：
  const icon = new AMap.Icon({
    size: new AMap.Size(40, 50), // 图标尺寸
    image: getImageUrl('Marker.png'), // Icon的图像
    imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
    imageSize: new AMap.Size(20, 20) // 根据所设置的大小拉伸或压缩图片
  })

  //1.点击地图任意位置生成一个marker
  const marker3 = new AMap.Marker({
    position: new AMap.LngLat(lng, lat),
    icon: icon
  })

  map.add(marker3)

  //2.将位置信息转化为坐标-->地理信息
  //3.根据地理信息进行搜索获取详细信息
  geocoder.getAddress(lnglat, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {
      // result为对应的地理位置详细信息
      let address = result.regeocode.formattedAddress
      //4.固定的窗体信息进行展示(用vuex)
      let data = {}
      data.address = address
      data.lngLat = poi
      store.commit('setMouseGetMessage', data)
    }
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
