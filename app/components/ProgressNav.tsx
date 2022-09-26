import { BiChevronRight } from "react-icons/bi"

/***
 * シフト作成進捗ナビゲーション
 */

type Props = {
  currentPath: string
}

export const ProgressNav = ({ currentPath }: Props) => {
  const progresses = [
    { label: "年月選択", rootPath: "/create/date" },
    { label: "各項目確認", rootPath: "/create/confirm" },
    { label: "自動生成", rootPath: "/create/automation" },
    { label: "シフト作成完了", rootPath: "" }
  ]

  return (
    <div className="flex items-baseline">
      {progresses.map(({ label, rootPath }, i) => (
        <div key={i} className="flex items-center">
          {rootPath === currentPath ? (
            <h1 className="font-semibold text-primary-text">{label}</h1>
          ) : (
            <h2 className="text-xs text-[#666]">{label}</h2>
          )}
          {i !== 3 && <BiChevronRight size={18} color="#666" />}
        </div>
      ))}
    </div>
  )
}
