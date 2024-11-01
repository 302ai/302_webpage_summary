'use client'
import { Button } from '@/components/ui/button'
import { FaExternalLinkAlt, FaRegEye } from 'react-icons/fa'
import { linkItem } from '../../types'
/**
 * 标签 - 链接
 * Tab - Links
 * @param props
 * @returns
 */
export const TabLinks = (props: {
  onClickUrl: (url: string) => void,
  links: linkItem[],
  loading: boolean,
}) => {
  const { links, onClickUrl: onClickUrlParent, loading } = props;

  return (
    <>
      <div className='flex flex-1 flex-col relative w-full max-h-full overflow-hidden justify-start'>
        {links.map((item, index) => (
          <div key={index} className={`flex flex-row box-border p-2 pr-4 shadow rounded-xl border bg-card space-x-1 mb-3`}>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              <div className={`${loading ? 'text-gray-400' : 'text-purple-700'} inline leading-9 dark:text-white underline cursor-pointer`} onClick={() => !loading && onClickUrlParent(item.url)}>
                {item.label}
              </div>
            </div>
            <Button disabled={loading} variant="outline" className='block' onClick={() => onClickUrlParent(item.url)}>
              <FaRegEye className='w-3' />
            </Button>
            <a className='block' href={item.url} target="_blank">
              <Button variant="outline" className='block'>
                <FaExternalLinkAlt className='w-3' />
              </Button>
            </a>
          </div>
        ))}
      </div>
    </>
  )
}
