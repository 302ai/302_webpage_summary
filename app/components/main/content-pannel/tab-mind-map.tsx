'use client'
import { MarkUpHooks } from "./mark-up-hooks";
import { ContentLink } from "./content-link";

export const TabMindMap = (props: {
  show: boolean,
  url: string,
  summaryStr: string,
}) => {

  const { url, show, summaryStr } = props;

  return (
    <>
      <div className='flex flex-1 flex-col'>
        {/* 行-超链接 */}
        {/* Row - Hyperlink */}
        <div className="flex flex-row overflow-auto">
          <ContentLink
            url={url}
          />
        </div>
        {/* 行-脑图内容 */}
        {/* Row - Mind Map Content */}
        <div className="flex flex-1 flex-col relative">
          {/* 行-渲染内容 */}
          {/* Row - Rendered Content */}
          <div className={`flex flex-col flex-1 w-full box-border p-2 shadow rounded-xl border bg-card ${!show && 'hidden'}`}>
            {show && (
              <MarkUpHooks
                content={summaryStr}
              />
            )}
          </div>
        </div>
      </div >
    </>
  )
}
