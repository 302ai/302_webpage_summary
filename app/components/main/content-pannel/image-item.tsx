import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { MdOutlineFileDownload } from 'react-icons/md'
import { PhotoProvider, PhotoView } from 'react-photo-view'

const ImageItem = (props: { url: string }) => {
  const { url: urlFromParent } = props
  const { t } = useClientTranslation()

  const [renderUrl, setRenderUrl] = useState('')
  const downloadImg = async () => {
    try {
      const response = await fetch(renderUrl)
      const blob = await response.blob()

      const parsedUrl = new URL(urlFromParent)
      const fileName = parsedUrl.pathname.split('/').pop() || 'default.jpg'

      const imageBlob = new Blob([blob], { type: 'image/jpeg' })
      const blobUrl = URL.createObjectURL(imageBlob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = fileName

      a.style.display = 'none'
      document.body.appendChild(a)

      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)
      }, 100)
    } catch (error) {
      toast.error(t('home:main.tab_image.image_download_error'))
      logger.error(error)
    }
  }

  const getImgProxyUrl = (imgUrl: string) =>
    `/api/img-proxy?url=${encodeURIComponent(imgUrl)}`

  const getBlobFromUrl = async (url: string) => {
    const promise = new Promise<string | null>((resolve) => {
      fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            resolve(null)
            return
          }
          response
            .blob()
            .then((blob) => {
              const blobUrl = URL.createObjectURL(blob)
              resolve(blobUrl)
            })
            .catch((e) => {
              logger.error(e)
              resolve(null)
            })
        })
        .catch((e) => {
          logger.error(e)
          resolve(null)
        })
    })
    const result = await promise
    return result
  }

  const getRenderUrl = async (url: string) => {
    const urlObject = new URL(url)
    if (urlObject.protocol === 'blob:') {
      return url
    }

    return await getBlobFromUrl(url)
  }

  const init = async () => {
    const proxyUrl = window.location.origin + getImgProxyUrl(urlFromParent)
    let renderUrl = (await getRenderUrl(proxyUrl)) || ''
    if (!renderUrl) {
      renderUrl = urlFromParent
    }
    setRenderUrl(renderUrl)
    return
  }

  useEffect(() => {
    init()
  }, [urlFromParent])

  return !!renderUrl ? (
    <div className='relative block rounded-xl border bg-card p-2'>
      <div className='absolute bottom-3 right-3 flex flex-row justify-end space-x-1'>
        <Button
          variant='outline'
          className='flex w-10 flex-col shadow'
          onClick={() => downloadImg()}
        >
          <MdOutlineFileDownload className='h-5 w-6' />
        </Button>
        <a className='block' href={renderUrl} target='_blank'>
          <Button variant='outline' className='flex w-10 flex-col shadow'>
            <FaExternalLinkAlt className='h-5 w-6' />
          </Button>
        </a>
      </div>
      <PhotoProvider>
        <PhotoView src={renderUrl}>
          <div className='flex min-h-16 flex-col justify-center overflow-hidden rounded-xl bg-stone-100 dark:bg-neutral-800'>
            <img className='m-auto' src={renderUrl} alt='' />
          </div>
        </PhotoView>
      </PhotoProvider>
    </div>
  ) : null
}

export default ImageItem
