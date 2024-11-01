import { Button } from "@/components/ui/button"
import { getAll, remove } from "@/lib/db";
import { HistoryIcon } from "lucide-react"
import { useRef, useState } from "react"
import { FaExternalLinkAlt, FaRegEye } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { HistoryItem } from "./types";

/**
 * 历史记录按钮
 * HistoryButton
 * @param props
 * @returns
 */
export const HistoryButton = (props: {
  onClickId: (id: string) => void,
}) => {
  const { onClickId: onClickViewParent } = props;

  const modalRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<HistoryItem[]>([]);

  const updateItems = async () => {
    const historyItems = await getAll();
    setItems(historyItems.sort((prev, next) => Number(next.id) - Number(prev.id)));
  }
  /**
   * 点击打开
   * click to open
   * @returns
   */
  const onClickButton = async () => {
    setOpen(true)
    await updateItems();
    if (!modalRef.current) return;
    document.body.appendChild(modalRef.current)
  }
  const onClickBackground = () => {
    setOpen(false)
    if (!modalRef.current) return;
    document.body.removeChild(modalRef.current)
  }

  const onClickDelete = async (idStr: string) => {
    await remove(idStr)
    await updateItems();
  }
  const onClickView = (id: string) => {
    onClickViewParent(id);
    setOpen(false)
  }
  return (
    <>
      <Button
        aria-label='show history'
        variant='icon'
        size='roundIconLg'
        onClick={() => onClickButton()}
      >
        <HistoryIcon />
      </Button>
      <div className="hidden">
        {/* dom，插入到body下显示 */}
        {/* dom, append to body */}
        <div
          className={`${open ? 'fixed' : 'hidden'} flex flex-col z-10 top-0 bottom-0 left-0 right-0`}
          style={{ backgroundColor: "#0000004d" }}
          ref={modalRef}
        >
          <div className="flex-1 h-1/5" onClick={() => onClickBackground()}></div>
          <div className="flex flex-1 h-4/5 flex-col bg-card shadow p-2 rounded-tl-lg rounded-tr-lg">
            <div className="flex flex-1 flex-col overflow-auto">
              {items.map((item, index) => (
                // 单个元素
                // single item
                <div key={index} className={`flex flex-row box-border p-2 pr-4 shadow rounded-xl border bg-card space-x-1 mb-3`}>
                  <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    <p className="inline leading-9 text-purple-700 dark:text-white underline" onClick={() => onClickView(item.id)}>
                      {item.url}
                    </p>
                  </div>
                  <Button variant="outline" className='block border-green-500 text-green-500' onClick={() => onClickView(item.id)}>
                    <FaRegEye className='size-4' />
                  </Button>
                  <a className='block' href={item.url} target="_blank">
                    <Button variant="outline" className='block border-cyan-500 text-cyan-500'>
                      <FaExternalLinkAlt className='size-4' />
                    </Button>
                  </a>
                  <Button variant="outline" className='block border-red-500 text-red-500' onClick={() => onClickDelete(item.id)}>
                    <FaRegTrashCan className='size-4' />
                  </Button>
                </div>
              ))}
              {items.length > 0 && (
                <div className="w-full min-h-20"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
