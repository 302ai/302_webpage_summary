'use client'
import { Footer } from '@/app/components/footer'
import { useLogin } from '@/app/hooks/use-login'
import { useTranslation } from '@/app/i18n/client'
import { Header } from '../components/header'
import { cn, getLocalStorage, getSessionStorage, removeLocalStorage, setLocalStorage } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Main from '../components/main'
import 'react-photo-view/dist/react-photo-view.css';
import { apiKy } from '@/lib/api/api'
import { logger } from '@/lib/logger'
import useLocale from '../hooks/use-locale'
import { HeaderSubmitValue, HistoryItem } from '../components/types'
import { LANGUAGE_LIST } from '../components/language'
import { historyItemKey } from '@/types'
import { getAll, getMaxId, save } from '@/lib/db'
import toast from 'react-hot-toast'
import useSettings from '../hooks/use-settings'

export default function Home() {

  const { locale } = useLocale();

  const { t } = useTranslation(locale);

  const { settings } = useSettings();

  // const global = useAppSelector(selectGlobal)

  // 是否已经提交过了 需要修改
  // Whether it has been submitted, needs modificatio
  const [isAfterSubmit, setIsAfterSubmit] = useState(false);
  // 加载状态
  const [loading, setLoading] = useState(false);
  /**
   * 后端返回数据 markdown
   * Markdown data returned from the backend
   */
  const [markdownStr, setMarkdownStr] = useState("");
  /**
   * 后端返回总结数据 markdown
   * Summary markdown data returned from the backend
   */
  const [summaryStr, setSummaryStr] = useState("");

  const [url, setUrl] = useState("");

  const [languageValue, setLanguageValue] = useState<string>(LANGUAGE_LIST[0].en)

  const [headerRenderTrigger, setHeaderRenderTrigger] = useState(0)

  const renderHeader = () => {
    setHeaderRenderTrigger(headerRenderTrigger + 1);
  }

  const getSesssionModelName = () => {
    const objectStr = getSessionStorage("user_store_websum")
    if (!objectStr) return null;
    const object = JSON.parse(objectStr);
    let modelName: string | null = null
    try {
      const modelNameRaw = object.state.modelName;
      modelName = modelNameRaw;
    } catch (e) {
      logger.error(e)
    }
    return modelName
  }

  const ajaxGetMarkdown = async (url: string) => {
    try {
      const resp = await apiKy.get(`jina/reader/${encodeURIComponent(url)}`, {
        searchParams: {
          "model": "jina-embeddings-v3",
          "task": "classification",
        }
      })
      return resp;
    } catch (error) {
      logger.error(error)
      return null;
    }
  }

  const ajaxGetSummary = async (mdStr: string, language: string) => {
    const url = "v1/chat/completions"
    const resp = await apiKy.post(url, {
      json: {
        "model": getSesssionModelName() || "gpt-4o-mini-2024-07-18",
        "X-No-Cache": true,
        "X-Wait-For-Selector": "#content",
        "messages": [
          {
            role: 'user',
            content: `Write a summarization based on provided text, return in markdown format.
Add some key features and related questions.
Example output:
# {title of content}
## {subtitle 1}
- key point 1
- key point 2
  - sub key point 1
...
## {subtitle 2}
...
## {key features}
- feature 1
- feature n
...
## {related questions}
- question 1
- question n
...

You must follow the format, make sure that is a list after a title or subtitle, do not contain a text without bullet list.
Input content:<text>
${mdStr}
</text>
Return the result in ${language}, do not wrapped in code block with '\`\`\`markdown' and '\`\`\`'.

`
          }
        ]
      }
    }).catch(error => {
      logger.error(error)
    })
    return resp;
  }

  const onSubmit = async (param: HeaderSubmitValue) => {
    const { url: newUrl, language: newLanguage } = param;
    setLoading(true)
    // 获取markdown
    const resp = await ajaxGetMarkdown(newUrl);
    if (!resp) {
      toast.error(`${t('home:header.error_url_invalid')}`)
      setLoading(false)
      return;
    }
    const markdownStr = await resp.text()
    // 获取总结markdown
    const resultSummary = await ajaxGetSummary(markdownStr, newLanguage);
    if (!resultSummary) {
      toast.error(`${t('home:header.error_change_model')}`)
      setLoading(false);
      return;
    }

    /**
     * 总结markdown
     */
    let SummaryStr = "";
    try {
      const resultStr: any = await resultSummary.json()
      const newSummaryStr = (resultStr.choices || [])[0].message.content
      SummaryStr = newSummaryStr;
    } catch (e) {
      logger.error(e)
      SummaryStr = '# ' + t('home:header.error_change_model')
      setLoading(false);
    }

    setUrl(newUrl);
    setLanguageValue(newLanguage)
    setMarkdownStr(markdownStr)
    setSummaryStr(SummaryStr)
    setLoading(false)
    setIsAfterSubmit(true);

    const maxId = await getMaxId();
    const historyData: HistoryItem = {
      url: newUrl,
      markdown: markdownStr,
      markdownSummary: SummaryStr,
      language: newLanguage,
      id: maxId + 1 + "",
      createdAt: 0,
      updatedAt: 0
    }
    await save(historyData);
    setLocalStorage(historyItemKey, JSON.stringify(historyData))
  }

  const onClickUrl = async (url: string) => {
    onSubmit({
      url: url,
      language: languageValue,
    });
    setUrl(url)
  }

  /**
   * 根据数据更新视图
   * Update the view based on data
   * @param newItem
   */
  const setDataFromItem = (newItem: HistoryItem) => {
    const { url, markdown, markdownSummary, language } = newItem;
    setUrl(url);
    setMarkdownStr(markdown);
    setSummaryStr(markdownSummary);
    setLanguageValue(language);
    setIsAfterSubmit(true);
    renderHeader();
  }
  /**
   * 页面打开初始化
   * init page
   * @returns
   */
  const initHistoryData = () => {
    const historyData = getLocalStorage(historyItemKey);
    if (!historyData) {
      return;
    }
    try {
      const historyDataObject: HistoryItem = JSON.parse(historyData);
      setDataFromItem(historyDataObject)
    } catch (e) {
      removeLocalStorage(historyItemKey)
      logger.error(e)
    }

  }
  /**
   * 点击了历史记录某行数据
   * Clicked on a row of data in the history record
   * @param id 历史记录id history record id
   * @returns
   */
  const onClickHistoryId = async (id: string) => {
    const historyData = await getAll();
    const item = historyData.find(item => item.id === id)
    if (!item) {
      return;
    }
    setDataFromItem(item)
  }

  useEffect(() => {
    initHistoryData();
  }, [])

  useLogin(t)
  return (
    <>
      <div className='flex min-h-screen h-screen flex-col overflow-auto'>
        <Header
          key={headerRenderTrigger + ""}
          defaultValue={{
            url: url,
            language: languageValue
          }}
          className={isAfterSubmit ? "" : "flex-1"}
          isSubmitting={loading}
          onSubmit={param => onSubmit(param)}
          onClickHistoryId={id => onClickHistoryId(id)}
        />
        <main
          className={cn(
            // 此处需要判断本地是否有保存数据 && 是否正在加载
            // It is necessary to determine whether there is saved data locally and whether it is loading
            // hasSubtitles && !isSubmitting ? 'block' : 'hidden',
            isAfterSubmit ? 'flex' : 'hidden',
            'container mx-auto max-w-[1280px] px-2 flex-1 flex-col z-10'
          )}
        >
          <Main loading={loading} onClickUrl={onClickUrl} markdownSummaryStr={summaryStr} url={url} markdownStr={markdownStr} />
        </main>
        {!settings?.hideBrand && (
          <Footer className={cn('mb-4')} />
        )}
      </div>
    </>
  )
}
