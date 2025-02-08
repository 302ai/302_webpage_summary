'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Markmap } from 'markmap-view'
import { Transformer } from 'markmap-lib'
import { Button } from '@/components/ui/button'
import {
  MdFullscreen,
  MdFullscreenExit,
  MdOutlineFileDownload,
} from 'react-icons/md'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import * as htmlToImage from 'html-to-image'

export const MarkUpHooks = (props: { content: string }) => {
  const { content = '' } = props

  const transformer = new Transformer()

  const { t } = useClientTranslation()

  const refSvg = useRef<SVGSVGElement>(null)
  const refMm = useRef<Markmap>()

  const [isFullscreen, setIsFullscreen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (refMm.current) return
    if (!refSvg.current) return
    const mm = Markmap.create(refSvg.current)
    refMm.current = mm
  }, [])

  const getTitle = (markdownStr: string) => {
    const matches = markdownStr.split('\n##')
    if (matches && matches[0]) {
      const result = matches[0].replace('# ', '')
      return result
    } else return `${t('home:main.default_svg_file_name')}`
  }

  const title = getTitle(content)

  const handleDownload = useCallback(
    async (format: 'png' | 'jpeg' | 'svg') => {
      if (!refSvg.current || !wrapperRef.current) return

      const svg = refSvg.current
      const wrapper = wrapperRef.current
      const mm = refMm.current

      if (!mm) return
      await mm.fit()

      if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], {
          type: 'image/svg+xml;charset=utf-8',
        })
        const svgUrl = URL.createObjectURL(svgBlob)
        const downloadLink = document.createElement('a')

        downloadLink.href = svgUrl
        downloadLink.download = `${title}.svg`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(svgUrl)
      } else {
        const options = {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#ffffff',
        }

        const dataUrl =
          format === 'png'
            ? await htmlToImage.toPng(wrapper, options)
            : await htmlToImage.toJpeg(wrapper, options)

        const downloadLink = document.createElement('a')
        downloadLink.download = `${title}.${format}`
        downloadLink.href = dataUrl
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    },
    [title]
  )

  const rebuild = () => {
    if (refMm.current) {
      refMm.current.destroy()
      refMm.current = undefined
    }
    const mm = Markmap.create(refSvg.current!)
    refMm.current = mm
    const { root } = transformer.transform(content)
    mm.setData(root)
    mm.fit()
  }

  const resize = () => {
    if (!refMm.current) {
      return
    }
    refMm.current.fit()
  }

  useEffect(() => {
    const mm = refMm.current
    if (!mm) return
    const { root } = transformer.transform(content)
    mm.setData(root)
    mm.fit()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [content, transformer])

  const onClickFullScreen = () => {
    setIsFullscreen((isFullscreen) => !isFullscreen)
    rebuild()
  }

  return (
    <React.Fragment>
      <div
        className={cn(
          isFullscreen ? 'fixed inset-0 z-50 bg-background' : `relative`,
          'flex h-full w-full flex-1 flex-col'
        )}
      >
        <div
          className={`${isFullscreen ? 'right-2 top-10' : 'right-2 top-2'} absolute z-10 flex h-10 w-20 items-center space-x-1 overflow-hidden rounded-md border border-border bg-background p-1 text-sm transition-opacity duration-300`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
              <Button
                variant='ghost'
                size='sm'
                className='box-border flex h-full w-full items-center justify-center rounded p-1 hover:bg-accent'
              >
                <MdOutlineFileDownload className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload('jpeg')}>
                <p className='w-full text-center'>JPEG</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('png')}>
                <p className='w-full text-center'>PNG</p>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('svg')}>
                <p className='w-full text-center'>SVG</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClickFullScreen}
            className='box-border flex h-full w-full items-center justify-center rounded p-1 hover:bg-accent'
          >
            {isFullscreen ? (
              <MdFullscreenExit className='h-4 w-4' />
            ) : (
              <MdFullscreen className='h-4 w-4' />
            )}
          </Button>
        </div>
        <div ref={wrapperRef} className='flex-1'>
          <svg className='h-full w-full' ref={refSvg} />
        </div>
      </div>
    </React.Fragment>
  )
}
