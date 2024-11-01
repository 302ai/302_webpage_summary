'use client'
import { Button } from "@/components/ui/button";
import { FaExternalLinkAlt } from "react-icons/fa";

/**
 * 超链接组件（带图标）
 * Link component with icon
 * @param props
 * @returns
 */
export const ContentLink = (props: {
  url: string
}) => {
  const { url } = props;
  return (
    <>
      <Button variant="link">
        <a
          className='block text-purple-700 dark:text-white underline'
          href={url}
          rel='noreferrer'
          target='_blank'
        >
          <p className="flex flex-row underline">
            <FaExternalLinkAlt className='flex flex-col justify-center mr-1 leading-9 h-5' />
            {url}
          </p>
        </a>
      </Button>
    </>
  )
}
