'use client'
import React from "react"
import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

/**
 * badge
 * 右上角显示数字的组件
 * Component that displays a number in the top-right corner
 * @param props
 * @returns
 */
const Badge = (props: {
  show: boolean,
  /**
   * 显示数值，数值为0时不提示
   * Display value, do not show if value is 0
   */
  counts: number,
  /**
   * slot
   * Child elements
   */
  children: React.ReactNode,
}) => {
  const { counts, children, show } = props;
  return (
    <div className="relative">
      {children}
      {show && (
        <span className="absolute top-0 -right-1 transform -translate-y-1/2 translate-x-full bg-purple-700 text-white text-xs rounded-full p-1 justify-center min-w-8">
          {counts}
        </span>
      )}
    </div>
  )
}
/**
 * 标签页切换组件
 * Tab switching component
 */
const TopTabs = (props: {
  activeTab: string,
  setActiveTab: (tab: string) => void,
  /**
   * 链接数量
   * Number of links
   */
  linksCounts: number,
  /**
   * 图片数量
   * Number of images
   */
  imageCounts: number,
}) => {
  const { activeTab, setActiveTab, linksCounts, imageCounts } = props;
  const { t } = useClientTranslation()
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList
        className='mb-4 grid w-full grid-cols-4 bg-gray-200 dark:bg-gray-800'
      >
        <TabsTrigger value='summary'>
          <Badge show={false} counts={0}>
            <p>
              {t('home:main.view_summary')}
            </p>
          </Badge>
        </TabsTrigger>
        <TabsTrigger value='mindMap'>
          <Badge show={false} counts={0}>
            <p>
              {t('home:main.view_mind_map')}
            </p>
          </Badge>
        </TabsTrigger>
        <TabsTrigger value='link'>
          <Badge show={linksCounts > 0} counts={linksCounts}>
            <p>
              {t('home:main.view_link')}
            </p>
          </Badge>
        </TabsTrigger>
        <TabsTrigger value='image'>
          <Badge show={imageCounts > 0} counts={imageCounts}>
            <p>
              {t('home:main.view_image')}
            </p>
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default TopTabs
