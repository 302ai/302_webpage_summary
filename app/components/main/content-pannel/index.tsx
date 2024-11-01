'use client'
import { cn } from "@/lib/utils";
import { TabSummary } from "./tab-summary";
import { TabMindMap } from "./tab-mind-map";
import { TabLinks } from "./tab-links";
import { TabImage } from "./tab-image";
import { linkItem } from "../../types";

/**
 * 对应tabs的每个标签页的内容
 * The content of each tab corresponding to the tabs
 * @param props
 * @returns
 */
export const ContentPannel = (props: {
  activeTab: string,
  onClickUrl: (url: string) => void,
  markdownSummaryStr: string,
  url: string,
  links: linkItem[],
  imageLinks: string[],
  loading: boolean,
}) => {

  const { activeTab, onClickUrl, markdownSummaryStr, url, links, imageLinks, loading } = props;

  return (
    <>
      <div className="flex flex-1 flex-col w-full">
        <div className={cn('flex flex-1 flex-col', activeTab === 'summary' ? '' : 'hidden')}>
          <TabSummary markdownStr={markdownSummaryStr} url={url} />
        </div>
        <div className={cn('flex flex-1 flex-col', activeTab === 'mindMap' ? '' : 'hidden')}>
          <TabMindMap url={url} show={activeTab === 'mindMap'} summaryStr={markdownSummaryStr} />
        </div>
        <div className={cn('flex flex-1 flex-col', activeTab === 'link' ? '' : 'hidden')}>
          <TabLinks onClickUrl={onClickUrl} links={links} loading={loading} />
        </div>
        <div className={cn('flex flex-1 flex-col', activeTab === 'image' ? '' : 'hidden')}>
          <TabImage imageLinks={imageLinks} />
        </div>
      </div>
    </>
  )
}
