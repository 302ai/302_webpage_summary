import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"
import { useEffect, useState } from "react"
import { FaExternalLinkAlt } from "react-icons/fa"
import { MdOutlineFileDownload } from "react-icons/md"
import { PhotoProvider, PhotoView } from "react-photo-view"

/**
 * 单个图片元素
 * Single image element
 * @param props
 * @returns
 */
const ImageItem = (props: { url: string }) => {
  const { url: urlFromParent } = props;
  const { t } = useClientTranslation();
  const [renderUrl, setRenderUrl] = useState("");

  const downloadImg = () => {
    // 使用new URL()解析网址
    // Use new URL() to parse the URL
    const parsedUrl = new URL(urlFromParent);
    // 获取路径部分
    // Get the pathname part
    const pathname = parsedUrl.pathname;
    const fileName = pathname.split('/').pop() || "default.jpg";

    var a = document.createElement('a');
    // 设置a标签的href属性为Blob URL
    // Set the href attribute of the a tag to the Blob URL
    a.href = renderUrl;
    // 设置下载的文件名
    // Set the download file name
    a.download = fileName;
    // 将a标签添加到文档中（不会显示）
    // Append the a tag to the document (it won't be displayed)
    document.body.appendChild(a);
    // 模拟点击a标签
    // Simulate clicking the a tag
    a.click();
    // 从文档中移除a标签
    // Remove the a tag from the document
    document.body.removeChild(a);
  }

  const getImgProxyUrl = (imgUrl: string) => `/api/img-proxy?url=${encodeURIComponent(imgUrl)}`

  const getBlobFromUrl = async (url: string) => {
    const promise = new Promise<string | null>(resolve => {
      fetch(url)
        .then(response => {
          if (response.status !== 200) {
            resolve(null);
            return;
          }
          response.blob().then(blob => {
            // 如果需要转换为Blob URL
            // If you need to convert to Blob URL
            const blobUrl = URL.createObjectURL(blob);
            resolve(blobUrl);
          }).catch(e => {
            logger.error(e);
            resolve(null);
          });
        }).catch(e => {
          logger.error(e);
          resolve(null);
        });
    });
    const result = await promise;
    return result;
  }

  const getRenderUrl = async (url: string) => {
    const urlObject = new URL(url);
    if (urlObject.protocol === 'blob:') {
      return url;
    }

    return await getBlobFromUrl(url);
  }

  const init = async () => {
    const proxyUrl = window.location.origin + getImgProxyUrl(urlFromParent);
    const renderUrl = await getRenderUrl(proxyUrl) || ""
    setRenderUrl(renderUrl);
    return;
  }

  useEffect(() => {
    init()
  }, [urlFromParent])

  return !!renderUrl ? (
    <div className='block relative bg-card p-2 border rounded-xl'>
      <div className="flex flex-row justify-end absolute bottom-3 right-3 space-x-1">
        <Button variant="outline" className='flex flex-col w-10 shadow' onClick={() => downloadImg()}>
          <MdOutlineFileDownload className='w-6 h-5' />
        </Button>
        <a className='block' href={renderUrl} target="_blank">
          <Button variant="outline" className='flex flex-col w-10 shadow'>
            <FaExternalLinkAlt className='w-6 h-5' />
          </Button>
        </a>
      </div>
      <PhotoProvider>
        <PhotoView src={renderUrl}>
          <div className='rounded-xl overflow-hidden bg-stone-100 dark:bg-neutral-800 min-h-16 flex flex-col justify-center'>
            <img className='m-auto' src={renderUrl} alt="" />
          </div>
        </PhotoView>
      </PhotoProvider>
    </div>
  ) : null
}

export default ImageItem;
