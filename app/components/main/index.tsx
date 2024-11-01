'use client'
import { useEffect, useRef, useState } from 'react'
import TopTabs from './top-tabs'
import { ContentPannel } from './content-pannel'
import { logger } from '@/lib/logger'
import { linkItem } from '../types'

export default function Main(props: {
  onClickUrl: (url: string) => void,
  markdownStr: string,
  markdownSummaryStr: string,
  url: string,
  loading: boolean,
}) {
  const { onClickUrl, markdownSummaryStr, markdownStr, url, loading } = props;

  const outerRef = useRef<HTMLDivElement>(null)

  // 当前选中的标签
  // Currently selected tab
  const [activeTab, setActiveTab] = useState('summary');

  /**
   * 获取链接列表
   * Get link list
   * @returns
   */
  const getLinks = () => {
    const linkRegex = /\[.*?\]\((.*?)\)/g;
    // const linkRegex = /\[(!)?\[([\]]+)\]\(([\)]+)\)/g;
    let matches;
    const links: linkItem[] = [];

    // 循环查找所有匹配项
    // Loop through all matches
    while ((matches = linkRegex.exec(markdownStr)) !== null) {
      try {
        // 和用户输入url相同的链接不需要显示
        // Do not display links that are the same as the user-input URL
        if (url !== matches[1] && !matches[1].startsWith("blob")) {
          const labelRegex = /\[(.*?)\]/;
          const match = matches[0].match(labelRegex);
          let label = matches[1]
          if (match && match[0]) {
            label = match[0].replace("[", "").replace("]", "")
            if (label.startsWith("![")) {
              label = label.replace("![", "")
            }
            // 没有标题的时候使用链接作为标题
            // Use the link as the title if there is no title
            if (!label) {
              label = matches[1]
            }
          }
          // 非正常链接无需记录
          // Do not record non-standard links
          if (!matches[1].startsWith("http")) {
            continue;
          }
          links.push({
            label: label,
            url: matches[1]
          });
        }
      } catch (e) {
        logger.error(e)
      }
    }
    let result: linkItem[] = [];
    links.forEach(item => {
      const resultUrls = result.map(item => item.url);
      if (resultUrls.includes(item.url)) {
        return;
      }
      result.push(item)
    })
    return result;
  }

  const links = getLinks();

  /**
 * 获取图片链接列表
 * Get list of image links
 * @returns
 */
  const getImgLinks = () => {
    // 使用正则表达式匹配Markdown中的图片链接
    // Use regular expression to match image links in Markdown
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let matches;
    const imageLinks = [];

    if (!url) return [];
    const inputUrlObject = new URL(url);

    const domain = inputUrlObject.href;

    const imageTypes = [".svg", ".jpg", ".png", ".jpeg"]

    const invalidPrefix = ["blob:https://", "blob:http://"]

    // 循环查找所有匹配项
    // Loop through all matches
    while ((matches = imageRegex.exec(markdownStr)) !== null) {
      try {
        let str = matches[1];

        if(invalidPrefix.find(item=>str.startsWith(item))){
          continue;
        }

        const urlObject = new URL(str);
        // console.log("input: ", str, urlObject);
        if (urlObject.protocol === "blob:") {
          imageLinks.push(str);
          continue;
        }
        const pathname = urlObject.pathname;
        const originPathName = urlObject.origin + pathname;
        // 符合图片格式
        // Matches image format
        if (imageTypes.find(item => (pathname.toLowerCase()).endsWith(item))) {
          imageLinks.push(originPathName)
        }
      } catch (e) {
        logger.error(e)
      }
    }
    return imageLinks;
  }

  const imgLinks = getImgLinks();

  // 当内容有变时，需要切换回第一页
  // When the content changes, need to switch back to the first page
  useEffect(() => {
    setActiveTab("summary")
  }, [markdownStr])

  return (
    <>
      <div
        className='flex flex-col py-4 flex-1'
        ref={outerRef}
      >
        <div
          className='flex flex-col flex-1'
        >
          <TopTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            linksCounts={links.length}
            imageCounts={imgLinks.length}
          />
          <ContentPannel
            loading={loading}
            links={links}
            imageLinks={imgLinks}
            onClickUrl={onClickUrl}
            activeTab={activeTab}
            markdownSummaryStr={markdownSummaryStr}
            url={url}
          />
        </div>
      </div>
    </>
  )
}
