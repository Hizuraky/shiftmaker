import { useNavigate } from "@remix-run/react"
import Slider from "react-slick"
import { useState, useRef, useEffect } from "react"
import { Button } from "app/components/common"
import { useGetElementProperty } from "app/hooks/useGetElementProperty"
import type { ShiftDate, Shift } from "app/utils/types"

/***
 * シフト画面シフトスライダー
 */

type Props = {
  latestShift: { path: string; shifts?: ShiftDate; shift?: Shift }
  currentMonthShift: { path: string; shifts?: ShiftDate; shift?: Shift }
  temporarilyShift: { path: string; shifts?: ShiftDate; shift?: Shift }
}

export const ShiftsSlider = ({ latestShift, currentMonthShift, temporarilyShift }: Props) => {
  const navigate = useNavigate()
  const { windowDimensions } = useGetElementProperty<HTMLDivElement>()
  const [sliderIndex, setSliderIndex] = useState(0)
  const [disableSlideButton, setDisableSlideButton] = useState(false)
  useEffect(() => {
    disableSlideButton &&
      setTimeout(() => {
        setDisableSlideButton(false)
      }, 900)
  }, [disableSlideButton])

  const array = [
    {
      label: "シフト新規作成",
      onClick: () => navigate("/create/date"),
      content: `シフトの新規作成はこちらから。 \n 作成したシフトは確認・編集でき、作成途中のシフトは一時保存できます。 \n `,
      buttonText: "作成",
      styles: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8)), url(https://ks-icons.s3.ap-northeast-1.amazonaws.com/create.png)`,
        backgroundSize: "cover"
      }
    },
    {
      label: "作成途中",
      onClick: () =>
        temporarilyShift.shift
          ? navigate(temporarilyShift.path, { state: { shifts: temporarilyShift?.shifts, shift: temporarilyShift?.shift } })
          : navigate("/create/date"),
      content: "一時保存で最後に編集していたシフトを表示します。 \n シフトは一時保存時点の途中から作成できます。",
      buttonText: "確認",
      styles: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8)),url(https://ks-icons.s3.ap-northeast-1.amazonaws.com/calendar3.jpg)`,
        backgroundSize: "cover"
      }
    },
    {
      label: "最新シフト",
      onClick: () =>
        latestShift.shift
          ? navigate(latestShift.path, { state: { shifts: latestShift?.shifts, shift: latestShift?.shift } })
          : navigate("/create/date"),
      content: "最後に作成・編集したシフトを確認します。 \n シフトが存在しない場合には作成画面へ遷移します。",
      buttonText: "確認",
      styles: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8)),url(https://ks-icons.s3.ap-northeast-1.amazonaws.com/calendar2.jpg)`,
        backgroundSize: "cover"
      }
    },
    {
      label: "今月のシフト",
      onClick: () =>
        currentMonthShift.shift
          ? navigate(currentMonthShift.path, { state: { shifts: currentMonthShift?.shifts, shift: currentMonthShift?.shift } })
          : navigate("/create/date"),
      content: "作成した今月のシフトを確認します。 \n シフトが存在しない場合はシフト作成画面へ遷移します。",
      buttonText: "確認",
      styles: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8)),url(https://ks-icons.s3.ap-northeast-1.amazonaws.com/calendar1.jpg)`,
        backgroundSize: "cover"
      }
    },
    {
      label: "従業員編集",
      onClick: () => navigate("/workingTime"),
      content:
        "従業員と勤務時間帯をあらかじめ保存しておくことできます。 \n 保存しておくとシフト作成時にご利用できます。 \n 従業員・勤務時間帯の編集はシフトの作成途中でも行えます。",
      buttonText: "編集",
      styles: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8)),url(https://ks-icons.s3.ap-northeast-1.amazonaws.com/employees.jpg)`,
        backgroundSize: "cover"
      }
    },
    {
      label: "操作説明",
      onClick: () => navigate("/manual"),
      content: "当サービスの操作説明を確認できます。",
      buttonText: "確認",
      styles: {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.8)),url(https://ks-icons.s3.ap-northeast-1.amazonaws.com/tutorial.jpg)`,
        backgroundSize: "cover"
      }
    }
  ]

  const sliderRef = useRef(null)

  const slideNext = () => {
    // @ts-ignore
    sliderRef?.current?.slickNext()
    setDisableSlideButton(true)
  }

  const slidePrev = () => {
    // @ts-ignore
    sliderRef?.current?.slickPrev()
    setDisableSlideButton(true)
  }

  return (
    <div className="shadow-bottom h-[220px] relative bg-gradient-to-t from-[#f5f5f5] ml-[-20px] w-[calc(100%+40px)] pt-[10px]">
      <Slider
        infinite={true}
        speed={400}
        slidesToShow={3}
        slidesToScroll={1}
        centerMode={true}
        autoplay
        afterChange={(i: number) => setSliderIndex(i)}
        ref={sliderRef}
        arrows={false}
      >
        {array.map((v, i) => {
          let styles = {}
          const leftStyle = (styles = { opacity: 0.4, width: "80%", marginLeft: "-20%" })
          const rightStyle = { opacity: 0.4, width: "80%", marginLeft: "40%" }

          if (sliderIndex === i) {
            styles = { width: "160%", marginLeft: "-30%", zIndex: 20, height: "200px", marginRight: "-100%" }
          } else if (sliderIndex === 0) {
            styles = i === 4 || i === 5 ? leftStyle : rightStyle
          } else if (sliderIndex === 1) {
            styles = i === 5 || i === 0 ? leftStyle : rightStyle
          } else {
            styles = i === sliderIndex - 1 || i === sliderIndex - 2 ? leftStyle : rightStyle
          }

          sliderIndex < 3
            ? sliderIndex + 3 === i && (styles = { display: "none" })
            : sliderIndex - 3 === i && (styles = { display: "none" })

          return (
            <div className="mb-10 flex items-center justify-center" key={i}>
              <div
                className="trans30 h-[100px] p-2 rounded-md border flex flex-col justify-between cursor-grab shadow-md"
                style={{ ...styles, ...v.styles }}
                onClick={() => sliderIndex === i && windowDimensions.width < 640 && v.onClick()}
              >
                <div className="p-2 bg-[rgba(255,255,255,0.8)] rounded-sm">
                  <p className={`text-lg ${sliderIndex !== i && "sm:text-xs"} font-bold text-primary-text`}>{v.label}</p>
                  {sliderIndex === i && (
                    <div className="m-1 max-h-[100px] sm:max-h-[130px] overflow-scroll hidden-scrollbar">
                      {v.content.split("\n").map((l) => (
                        <p key={l}>{l}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`${sliderIndex === i ? "self-end" : "self-start"} `}>
                  {sliderIndex === i && windowDimensions.width >= 640 && (
                    <Button text={v.buttonText!} onClick={v.onClick} color="secondary" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </Slider>
      <div className="absolute bottom-[10px] right-[20px]">
        <Button
          width="sm"
          text=">"
          color="white"
          onClick={slideNext}
          disabled={disableSlideButton}
          variant="contained"
          textColor="text-gray-400"
        />
      </div>
      <div className="absolute bottom-[10px] left-[20px]">
        <Button
          width="sm"
          text="<"
          color="white"
          onClick={slidePrev}
          disabled={disableSlideButton}
          variant="contained"
          textColor="text-gray-400"
        />
      </div>
    </div>
  )
}
