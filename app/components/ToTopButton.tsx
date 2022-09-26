import { useCallback } from "react"

/***
 * 利用規約・操作説明・プライバシーポリシーのスクロールボタン
 */

export const ToTopButton = ({ scrollToElementRef }: { scrollToElementRef: React.MutableRefObject<any> }) => {
  const scrollToBottomOfList = useCallback(() => {
    scrollToElementRef!.current!.scrollIntoView({
      behavior: "smooth",
      block: "end"
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToElementRef])
  return (
    <div
      className="bg-[#888] rounded-full fixed right-10 bottom-10 flex justify-center items-center w-12 h-12 z-[9998] shadow-md flex-col hover:noPhone:scale-125 trans30 cursor-pointer active:sm:scale-125"
      onClick={scrollToBottomOfList}
    >
      <div className="relative flex justify-center items-center">
        <p className="text-white text-lg font-bold absolute top-[-22px]">↑</p>
        <p className="text-white text-base font-semibold absolute bottom-[-19px]">Top</p>
      </div>
    </div>
  )
}
