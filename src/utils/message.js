// 对element-plus的ElMessage进行二次封装，使其不会多次弹出
/* import ShowMessage from '../../utils/message.js'
const showMessage = new ShowMessage() 
showMessage.success(option)*/

import { ElMessage } from 'element-plus'
let messageStatus = null
export default class ShowMessage {
  success(options) {
    this.message('success', options)
  }

  warning(options) {
    this.message('warning', options)
  }

  info(options) {
    this.message('info', options)
  }

  error(options) {
    this.message('error', options)
  }

  message(type, options) {
    if (messageStatus) {
      messageStatus.close()
    }
    messageStatus = ElMessage[type](options)
  }
}
