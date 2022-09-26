import data from "app/utils/policy.json"
import { ToTopButton } from "app/components/ToTopButton"
import { useRef } from "react"

/***
 * プライバシーポリシー画面
 */

export default function Index() {
  const scrollRef = useRef(null)

  return (
    <div className="w-full flex flex-col items-center justify-around p-2">
      <h1 className="text-base font-bold" ref={scrollRef}>
        プライバシーポリシー
      </h1>
      <p>
        shift
        maker管理者（以下，「管理者」といいます。）は，本ウェブサイト上で提供するサービス（以下,「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
      </p>
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-start justify-start w-full">
          {item.type === "title" ? (
            <h3 className="mt-5 mb-2 font-semibold">{item.text}</h3>
          ) : (
            <div className="flex mb-2 items-center">
              <p className="mr-1">・</p>
              <p>{item.text}</p>
            </div>
          )}
        </div>
      ))}
      <ToTopButton scrollToElementRef={scrollRef} />
    </div>
  )
}
