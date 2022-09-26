import data from "app/utils/terms.json"
import { useRef } from "react"
import { ToTopButton } from "app/components/ToTopButton"

/***
 * 利用規約画面
 */

export default function Index() {
  const scrollRef = useRef(null)

  return (
    <div className="w-full flex flex-col items-center justify-around p-2">
      <h1 className="text-base font-bold" ref={scrollRef}>
        利用規約
      </h1>
      <p>
        この利用規約（以下，「本規約」といいます。）は，shift
        maker管理者（以下，「管理者」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
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
