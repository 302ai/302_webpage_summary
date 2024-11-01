interface Resp<T> {
  code: number
  success: boolean
  message: string
  data: T
}
/**
 * 存在本地的上一次数据的key值
 * There is a local key value for the previous data
 */
const historyItemKey = "history_item"
export {
  historyItemKey
}
