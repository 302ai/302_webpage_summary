'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Markmap } from 'markmap-view';
import { Transformer } from 'markmap-lib'
import { Button } from '@/components/ui/button';
import { MdFullscreen, MdFullscreenExit, MdOutlineFileDownload } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { useClientTranslation } from '@/app/hooks/use-client-translation';

export const MarkUpHooks = (props: {
  /**
   * 渲染内容（markdown格式的字符串）
   * render content (markdown string)
   */
  content: string,
}) => {
  const { content = "" } = props;

  const transformer = new Transformer();

  const { t } = useClientTranslation()

  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement>(null);
  // Ref for markmap object
  const refMm = useRef<Markmap>();

  // 是否全屏
  // is full screen
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current) return;
    if (!refSvg.current) return;
    const mm = Markmap.create(refSvg.current);
    refMm.current = mm;
  }, [refSvg.current]);

  /**
   * 获取文件名
   * get file name
   * @param markdownStr
   * @returns
   */
  const getTitle = (markdownStr: string) => {
    const matches = markdownStr.split("\n##")
    if (matches && matches[0]) {
      const result = matches[0].replace("# ", "")
      return result;
    }
    else return `${t('home:main.default_svg_file_name')}`
  }

  const title = getTitle(content);

  const handleDownload = useCallback(
    async (format: 'png' | 'jpeg' | 'svg') => {
      if (!refSvg.current) return

      const svg = refSvg.current
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
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
          const bbox = svg.getBBox()
          const scale = 2

          canvas.width = 3840 * scale
          canvas.height = 2160 * scale

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (format === 'jpeg') {
              ctx.fillStyle = 'white'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            const scaleX = canvas.width / bbox.width
            const scaleY = canvas.height / bbox.height
            const scaleFactor = Math.min(scaleX, scaleY)

            const translateX =
              (canvas.width - bbox.width * scaleFactor) / 2 -
              bbox.x * scaleFactor
            const translateY =
              (canvas.height - bbox.height * scaleFactor) / 2 -
              bbox.y * scaleFactor

            ctx.setTransform(
              scaleFactor,
              0,
              0,
              scaleFactor,
              translateX,
              translateY
            )

            ctx.drawImage(img, 0, 0)

            const dataUrl = canvas.toDataURL(`image/${format}`, 0.9)
            const downloadLink = document.createElement('a')

            downloadLink.download = `${title}.${format}`
            downloadLink.href = dataUrl
            downloadLink.click()
          }
        }

        img.src =
          'data:image/svg+xml;base64,' +
          btoa(unescape(encodeURIComponent(svgData)))
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
      return;
    }
    refMm.current.fit();
  }

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(content);
    mm.setData(root);
    mm.fit();

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [refMm.current, content]);

  const onClickDownload = () => {
    handleDownload("jpeg")
  }

  const onClickFullScreen = () => {
    setIsFullscreen((isFullscreen) => !isFullscreen)
    rebuild()
  }

  return (
    <React.Fragment>
      <div className={cn(isFullscreen ? 'fixed inset-0 z-50 bg-background' : `relative`, "w-full h-full flex flex-1 flex-col")}>
        {/* 右上角-下载、全屏预览 */}
        {/* top right - download, full screen */}
        <div className={`${isFullscreen ? 'right-2 top-10' : 'right-2 top-2'} absolute w-20 h-10 z-10 flex items-center space-x-1 overflow-hidden rounded-md border border-border bg-background p-1 text-sm transition-opacity duration-300`}>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClickDownload}
            className='flex items-center justify-center rounded p-1 hover:bg-accent box-border w-full h-full'
          >
            <MdOutlineFileDownload className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClickFullScreen}
            className='flex items-center justify-center rounded p-1 hover:bg-accent box-border w-full h-full'
          >
            {isFullscreen ? (
              <MdFullscreenExit className='w-4 h-4' />
            ) : (
              <MdFullscreen className='w-4 h-4' />
            )}
          </Button>
        </div>
        <svg className="flex-1" ref={refSvg} />
      </div>
    </React.Fragment>
  );
}
