'use client'
import Masonry from 'react-layout-masonry';
import ImageItem from './image-item';
/**
 * 标签 - 图片
 * Tab - Images
 * @param props
 * @returns
 */
export const TabImage = (props: {
  imageLinks: string[],
}) => {

  const { imageLinks } = props;

  return (
    <div className="flex flex-1 flex-col relative justify-start">
      <Masonry columns={{ 640: 1, 768: 2, 1024: 3, 1280: 5 }} gap={16}>
        {imageLinks.map((item, index) => (
          <ImageItem key={index} url={item} />
        ))}
      </Masonry >
    </div >
  )
}
