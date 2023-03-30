<template>
  <div class="father">
    <div id="container"></div>
    <div id="panel"></div>
    <el-button class="start_btn" @click="startDraw" :disabled="disabled"
      >开始绘制</el-button
    >
    <el-button class="store_btn" @click="storeDraw">保存绘制</el-button>
  </div>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="保存绘制图形"
      width="30%"
      :before-close="handleClose"
      destroy-on-close
    >
      <el-input
        v-model="drawPolydonName_input"
        placeholder="请输入需要保存的图形名称"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelStoreDraw">放弃保存</el-button>
          <el-button type="primary" @click="confirmStoreDraw">
            确认保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//引入AMapLoader
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref, onMounted, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import ShowMessage from '../../utils/message.js'
import getImageUrl from '../../utils/getImageByPath'
import { ElMessageBox } from 'element-plus'
const showMessage = new ShowMessage()
const store = useStore()
//引入秘钥
window._AMapSecurityConfig = {
  securityJsCode: 'ab50347180e98051a8caac09781b9f6e'
}

let map = null

//AutoComplement输入提示控件参数
//autoOptions是我们要接收的input输入框的id对象所以在其中定义input接收值为空
const autoOptions = reactive({ input: '' })
const searchPlaceInput = ref('')

//通过监听store.state的searchInput变化，知道输入框的变化
watch(store.state, (newVal) => {
  autoOptions.input = newVal.searchInput.inputId
  searchPlaceInput.value = newVal.searchInput.userInput
})

//城市搜索关键字，用于poi关键字搜索
let placeSearch = {}

//poi关键字搜索
watch(searchPlaceInput, (newVal) => {
  placeSearch = new AMap.PlaceSearch({
    pageSize: 5, // 单页显示结果条数
    pageIndex: 1, // 页码
    city: '全国', // 兴趣点城市
    citylimit: false, //是否强制限制在设置的城市内搜索
    map: map, // 展现结果的地图实例
    panel: 'panel', // 结果列表将在此容器中进行展示。
    autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
  })
  //关键字查询
  placeSearch.search(newVal)
  map.setZoom(16, true, 1)
})

let markerBig = null

//根据鼠标的点击放大地图
const getLngLatService = (lng, lat) => {
  if (drawFlag) {
    let poi = [lng, lat]
    let lnglat = new AMap.LngLat(lng, lat)
    if (markerBig != null) {
      markerBig.setMap(null)
    }

    // 创建 AMap.Icon 实例：
    const icon = new AMap.Icon({
      size: new AMap.Size(40, 50), // 图标尺寸
      image: getImageUrl('Marker.png'), // Icon的图像
      imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
      imageSize: new AMap.Size(20, 20) // 根据所设置的大小拉伸或压缩图片
    })

    //1.点击地图任意位置生成一个marker图标
    markerBig = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),
      icon: icon
    })
    markerBig.setMap(map)
    //2.根据图标的经纬度放大地图到17级并移动到标记位置:如果没有开始绘制，不会放大地图

    map.setZoom(17)
    map.setCenter(poi)
  }
}

//是否绘制标志
let drawFlag = false
var polyEditor = null

//开始绘制点击事件
const startDraw = () => {
  //console.log('开始绘制')
  drawFlag = true
  disabled.value = true
  //视界移动到地图的中心点
  var center = map.getCenter()
  map.setZoom(16)
  drawPolygon(center)
}
var polygon = null
const drawPolygon = (val) => {
  //构建需要绘制的图形的形状
  var lng = val.lng
  var lat = val.lat
  var index1 = [lng - 0.003, lat + 0.003]
  var index2 = [lng + 0.003, lat + 0.003]
  var index3 = [lng + 0.003, lat - 0.003]
  var index4 = [lng - 0.003, lat - 0.003]
  var path = [index1, index2, index3, index4]
  //console.log(path)
  polygon = new AMap.Polygon({
    path: path,
    //线条颜色
    strokeColor: '#FF33FF',
    //轮廓线宽度 2
    strokeWeight: 6,
    //轮廓线透明度
    strokeOpacity: 0.2,
    //多边形填充透明度
    fillOpacity: 0.4,
    //多边形填充颜色
    fillColor: '#1791fc',
    //多边形覆盖物的叠加顺序。地图上存在多个多边形覆盖物叠加时，通过该属性使级别较高的多边形覆盖物在上层显示
    zIndex: 50,
    //是否将覆盖物的鼠标或touch等事件冒泡到地图上
    bubble: true
  })

  map.add([polygon])

  polyEditor = new AMap.PolygonEditor(map, polygon)
  polyEditor.open()
}

//储存绘制图形名称
const drawPolydonName_input = ref('')

//储存绘制图形名称的对象
let drawPolydonName_obj = reactive([])

const disabled = ref(false)

//储存绘制点击事件
const storeDraw = () => {
  drawFlag = false
  dialogVisible.value = true
}

//控制保存绘制的弹窗是否出现
const dialogVisible = ref(false)

const handleClose = () => {
  dialogVisible.value = false
}

//取消保存
const cancelStoreDraw = () => {
  ElMessageBox.confirm('确定不保存关闭吗', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: '警告'
  })
    .then(() => {
      //不保存则清除该覆盖物
      //console.log(map.getAllOverlays('polygon')._opt.path)
      //清除所有覆盖物
      polyEditor.close()
      map.clearMap()

      //展示存在drawPolydonName_obj的覆盖物
      showDrawPolydon()
      dialogVisible.value = false
      disabled.value = false
      showMessage.success('取消保存成功')
    })
    .catch(() => {
      //showMessage.info('操作失败')
    })
}

//确定保存
const confirmStoreDraw = () => {
  //console.log(drawPolydonName_obj)
  //console.log(polyEditor.getTarget()._opts.path)
  var data = {
    name: drawPolydonName_input.value,
    data: polyEditor.getTarget()._opts.path
  }
  drawPolydonName_obj.push(data)
  //TODO数据传输到后台
  disabled.value = false
  dialogVisible.value = false
  drawPolydonName_input.value = ''
  polyEditor.close()
  showDrawPolydon()
}

//取出保存在drawPolydonName_obj的数据
const showDrawPolydon = () => {
  drawPolydonName_obj.forEach((item, index) => {
    var path = item.data
    polygon = new AMap.Polygon({
      path,
      //线条颜色
      strokeColor: '#FF33FF',
      //轮廓线宽度 2
      strokeWeight: 6,
      //轮廓线透明度
      strokeOpacity: 0.2,
      //多边形填充透明度
      fillOpacity: 0.4,
      //多边形填充颜色
      fillColor: '#1791fc',
      //多边形覆盖物的叠加顺序。地图上存在多个多边形覆盖物叠加时，通过该属性使级别较高的多边形覆盖物在上层显示
      zIndex: 50,
      //是否将覆盖物的鼠标或touch等事件冒泡到地图上
      bubble: true
    })
    map.add([polygon])

    // 计算区域面积
    var area = Math.round(AMap.GeometryUtil.ringArea(path))

    var text = new AMap.Text({
      map,
      position: new AMap.LngLat(path[0][0], path[0][1]),
      text: '区域面积' + area + '平方米',
      offset: new AMap.Pixel(-20, -20)
    })
    console.log('text' + text)
    text.setMap(map)
  })
}

//构建初始化地图方法
const initMap = () => {
  AMapLoader.load({
    key: 'dcb3841ae0e471fed5651fea3aa69487', // 申请好的Web端开发者Key，首次调用 load 时必填     dcb3841ae0e471fed5651fea3aa69487
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.Scale',
      'AMap.HawkEye',
      'AMap.PlaceSearch',
      'AMap.PolygonEditor',
      'AMap.Geocoder' //地理逆编码插件
    ]
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        //设置地图容器id
        viewMode: '2D', //是否为3D地图模式
        zoom: 14, //初始化地图级别
        center: [116.400274, 39.905812], //初始化地图中心点位置    121.473667, 31.230525   116.418261, 39.921984
        isHotspot: true
      })

      map.addControl(new AMap.Scale())
      map.addControl(new AMap.HawkEye())

      //绑定鼠标点击事件
      map.on('click', (e) => {
        let lat = e.lnglat.lat
        let lng = e.lnglat.lng
        getLngLatService(lng, lat)
      })

      //showDrawPolydon()
    })
    .catch((e) => {
      console.log(e)
    })
}

onMounted(() => {
  initMap()
})
</script>

<style lang="less" scoped>
.father {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
}
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
  // border: 1px solid black;
}
#panel {
  right: 0;
  width: 100px;
  height: 100px;
  position: absolute;
  // border: 1px solid black;
  //z-index: 99;
}
.start_btn {
  position: absolute;
  right: 90px;
  top: -40px;
  // z-index: 20;
  // border: 1px solid black;
}
.store_btn {
  position: absolute;
  right: -4px;
  top: -40px;
}
.dialog-footer {
  display: flex;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
