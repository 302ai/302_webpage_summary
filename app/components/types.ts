/**
 * 表单值，传递给父级组件 // Form values to be passed to the parent component
 */
interface HeaderSubmitValue {
  url: string,
  language: string,
}

/**
 * 保存在历史记录中的数据 // Data stored in history
 */
interface HistoryItem {
  id: string,
  url: string,
  markdown: string,
  markdownSummary: string,
  language: string,
  createdAt: number,
  updatedAt: number
}

interface linkItem {
  label: string,
  url: string,
}

export type { HeaderSubmitValue, HistoryItem, linkItem }
