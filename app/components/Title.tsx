import { BiChevronRight } from "react-icons/bi"
import { useNavigate } from "@remix-run/react"
import { Button } from "app/components/common/Button"

/***
 * 各画面タイトル
 */

type Props = {
  currentText: string
  previous?: {
    text: string
    rootPath: string
    state?: any
    isHidden?: boolean
  }[]
}

export const Title = ({ currentText, previous }: Props) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-start">
      {previous && previous?.length > 0 && (
        <Button
          text="< 戻る"
          variant="text"
          onClick={() => navigate(previous[previous.length - 1]?.rootPath, { state: previous[previous.length - 1]?.state })}
        />
      )}
      <div className="flex items-baseline overflow-auto w-full hidden-scrollbar">
        {previous?.map(({ text, rootPath, state, isHidden }, i) => (
          <div key={i} className={`flex ${isHidden && "hidden"}`}>
            <h2 className="text-[#666] hover:text-[#aaa] cursor-pointer truncate" onClick={() => navigate(rootPath, { state: state })}>
              {text}
            </h2>
            <BiChevronRight size={20} color="#666" />
          </div>
        ))}
        <h1 className="text-lg font-bold text-primary-text whitespace-nowrap">{currentText}</h1>
      </div>
    </div>
  )
}
