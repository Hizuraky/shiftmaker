import { Title } from "app/components/Title"
import { Accordion } from "app/components/common"
import AnchorLink from "react-anchor-link-smooth-scroll"
import { tableOfContents, manuals } from "app/utils/manuals"
import { useRef } from "react"
import { ToTopButton } from "app/components/ToTopButton"

/***
 * 操作説明画面
 */

export default function Index() {
  const scrollRef = useRef(null)

  const CardSection = ({ i, title, text, src }: { i: number; title: string; text: string[]; src: string[] }) => (
    <div className="cardSection" id={title}>
      <p className="cardNumber">{i}</p>
      <h2 className="font-semibold text-primary-text mb-1">{title}</h2>
      {text.map((v, i) => (
        <>
          <p className={`${i > 0 && "mt-4"} text-[555] mb-1 sm:text-sm`} key={i}>
            {v.split("\n").map((l) => (
              <p key={l}>{l}</p>
            ))}
          </p>
          <div className="flex sm:hidden">
            {src[i * 2 + 1] && (
              <img src={src[i * 2 + 1]} alt={`SP説明画像${i}`} className="sm:w-full w-[22%] object-contain rounded-md border-2" />
            )}
            {src[i * 2] && (
              <img
                src={src[i * 2]}
                alt={`PC説明画像${i}`}
                className={`sm:w-full w-[78%] object-contain rounded-md border-2 ${!src[i * 2 + 1] && "w-[100%]"}`}
              />
            )}
          </div>
          <div className="hidden sm:block">
            {src[i * 2 + 1] && (
              <Accordion label="スマートフォン">
                <img src={src[i * 2 + 1]} alt={`SP説明画像${i}`} className="sm:w-full w-[22%] object-contain rounded-md border-2" />
              </Accordion>
            )}
            <div className="m-1" />
            {src[i * 2] && (
              <Accordion label="パソコン">
                <img src={src[i * 2]} alt={`PC説明画像${i}`} className="sm:w-full w-[78%] object-contain rounded-md border-2" />
              </Accordion>
            )}
          </div>
        </>
      ))}
    </div>
  )

  return (
    <div className="w-full flex flex-col items-center justify-around p-2 sm:p-1">
      <div className="w-full flex flex-col items-start text-primary-text text-base sm:text-xs" id="top" ref={scrollRef}>
        <Title currentText="操作説明" />
        <div className="mt-2 p-4 border-2 rounded-md w-full flex mb-3 justify-around sm:p-1">
          {tableOfContents.map((tableOfContent, i) => (
            <div className="p-4 underline sm:p-2 shadow-md w-1/3 mx-1 sm:mx-0" key={i}>
              <h2 className="font-semibold text-lg sm:text-sm">
                <AnchorLink href={`#${tableOfContent.title}`}>{tableOfContent.title}</AnchorLink>
              </h2>
              <div className="w-full border-b-2 border-dashed border-primary-dark" />
              <div className="pl-2 flex flex-col text-[#888]">
                {tableOfContent.contents.map((content) => (
                  <div className="mt-2 sm:mt-1" key={content}>
                    <AnchorLink href={`#${content}`}>{content}</AnchorLink>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {manuals.map((manual) => (
        <div id={manual.title} className="cardContainer" key={manual.title}>
          <h1 className="cardTitle">{manual.title}</h1>
          {manual.contents.map((manual, i) => (
            <CardSection i={i + 1} title={manual.title} text={manual.text} src={manual.src} key={i} />
          ))}
        </div>
      ))}
      <ToTopButton scrollToElementRef={scrollRef} />
    </div>
  )
}
