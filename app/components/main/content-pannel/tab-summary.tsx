'use client'
import { FaRegCopy } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useClientTranslation } from '@/app/hooks/use-client-translation';
import { ContentLink } from './content-link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

/**
 * 标签 - 总结
 * Tab - Summary
 * @param props
 * @returns
 */
export const TabSummary = (props: {
  url: string,
  markdownStr: string,
}) => {
  const { url, markdownStr } = props;

  const { t } = useClientTranslation()

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownStr).then(() => {
      toast.success(t('home:extras.share.success'))
    }).catch(() => {
      toast.error(t('home:extras.share.error'))
    })
  }

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
        {/* 行-总结内容 */}
        {/* Row - Summary Content */}
        <div className="flex flex-1 flex-col relative">
          {/* 右上角-复制按钮 */}
          {/* Row - Summary Content */}
          <div className='absolute w-10 h-10 right-4 top-4 z-10 flex flex-row space-x-2 overflow-hidden rounded-md border border-border bg-background p-1 text-sm transition-opacity duration-300'>
            <Button
              variant='ghost'
              size='sm'
              onClick={handleCopy}
              className='flex items-center justify-center rounded p-1 hover:bg-accent box-border w-full h-full'
            >
              <FaRegCopy className='w-4 h-4' />
            </Button>
          </div>
          {/* 行-渲染内容 */}
          {/* Row - Rendered Content */}
          <div
            className='flex flex-col flex-1 w-full box-border p-4 shadow rounded-xl border bg-card prose lg:prose-md dark:prose-invert prose-code:bg-transparent prose-code:text-slate-500 prose-pre:bg-transparent prose-pre:p-0 prose-h1:mb-5 prose-h1:mt-5 prose-h2:mt-1 prose-h2:mb-1'
            style={{
              maxWidth: "100%"
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // @ts-ignore
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    // @ts-ignore
                    <SyntaxHighlighter
                      // style={isDark ? oneDark : oneLight}
                      language={match[1]}
                      PreTag='div'
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {markdownStr}
            </ReactMarkdown>
          </div>
        </div>
      </div >
    </>
  )
}
