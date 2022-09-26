import { useRef, useEffect, useState } from "react"
import { useGetElementProperty } from "app/hooks/useGetElementProperty"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import type { Employee, WorkingTime } from "app/utils/types"

/***
 * シフト確認テーブル
 */

type Props = {
  tableSize: number
  shifts?: { employee: number | undefined; workIds: (number | undefined)[] }[]
  employees?: Employee[]
  workingTimes?: WorkingTime[]
  year?: number
  month?: number
}

export const ShiftsConfirmTable = ({ year = 2022, month = 1, tableSize = 15, shifts, employees, workingTimes }: Props) => {
  const targetRef = useRef(null)
  const { getElementProperty, windowDimensions } = useGetElementProperty<HTMLDivElement>(targetRef)
  const [tdWidth, setWidth] = useState<number | undefined>()
  const [isOpenTotalWorkArea, setOpenTotalWorkArea] = useState(false)
  const [isDelayOpen, setDelayOpen] = useState(false)

  // 合計エリアのアニメーションが終了してからwidthの幅を取得するために遅延させる
  useEffect(() => {
    setTimeout(() => {
      setOpenTotalWorkArea(isDelayOpen)
    }, 300)
  }, [isDelayOpen])

  // 拡大・縮小・合計エリアの開閉でテーブルの幅を再計算
  useEffect(() => {
    if (windowDimensions?.width >= 640) {
      setWidth(getElementProperty("width") / tableSize)
    } else if (employees && workingTimes) {
      setWidth((getElementProperty("width") - 50) / (employees.length + workingTimes.length))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getElementProperty, tableSize, isOpenTotalWorkArea, windowDimensions])

  // 曜日取得
  const WeekDay = ({ day }: { day: number }) => {
    const currentDay = ["日", "月", "火", "水", "木", "金", "土"][new Date(year, month - 1, day).getDay()]
    return <p className={`${currentDay === "土" ? "text-[#3190FF]" : currentDay === "日" && "text-[#FF7070]"}`}>{currentDay}</p>
  }

  // 選択肢の生成。固定選択肢（休日など）を追加
  const options = workingTimes
    ? [
        ...workingTimes.map((v) => {
          return { value: v.id, label: v.timeName }
        }),
        { value: 91, label: "明休" },
        { value: 92, label: "休" },
        { value: 93, label: "希望休" },
        { value: 94, label: "有給" }
      ]
    : []

  // 各勤務時間帯の1日あたりの出勤日数
  const DayCountEmployee = ({ workingTime, day }: { workingTime: WorkingTime; day: number }) => {
    let employeeNum = 0
    shifts?.forEach((employee) => employee.workIds.forEach((v, i) => i === day && v === workingTime.id && employeeNum++))
    let textColor = employeeNum < workingTime.minEmployee ? "text-[#FF7070]" : employeeNum > workingTime.maxEmployee ? "text-[#3190FF]" : ""
    return <p className={textColor}>{employeeNum}</p>
  }

  // 各従業員の月の勤務時間帯合計出勤数
  const TotalCountWork = ({ workingTimeId, employee }: { workingTimeId: number | undefined; employee: Employee }) => {
    let workNum = 0
    const employeeShift = shifts?.find((shiftEmployee) => shiftEmployee.employee === employee.id)
    employeeShift?.workIds.forEach((v) => v === workingTimeId && workNum++)
    return <p>{workNum}</p>
  }

  // 勤務時間帯に休みを追加
  const addDayoffWorkingTimes = workingTimes && [
    ...workingTimes,
    { id: 91, timeName: "明休" },
    { id: 92, timeName: "休" },
    { id: 93, timeName: "希望休" },
    { id: 94, timeName: "有給" }
  ]

  return (
    <div className="flex items-start w-full flex-col rounded-md">
      {windowDimensions?.width >= 640 ? (
        <div className="flex w-full  text-white">
          <div className="flex flex-col">
            <div className={"border items-center flex w-[150px] justify-center h-[60px] bg-primary border-r-[#999]"}>
              {year} 年 {month} 月
            </div>
            {employees?.map((employee, i) => (
              <div
                key={i}
                className={`text-black flex items-center justify-center h-10 border border-r-[#999] ${i % 2 && "bg-primary-pale"} ${
                  employees.length - 1 === i && "border-b-[#999]"
                }`}
              >
                <p>{employee.name}</p>
              </div>
            ))}
            {workingTimes?.map((workingTime, i) => (
              <div
                key={i}
                className={`text-black flex items-center justify-center h-10 border border-r-[#999] ${i % 2 && "bg-secondary-pale"}`}
              >
                <p>{workingTime.timeName}</p>
              </div>
            ))}
          </div>
          <div className="flex overflow-x-scroll w-full" ref={targetRef}>
            <div className="flex">
              {shifts &&
                [...Array(new Date(year, month, 0).getDate())].map((_, i) => (
                  <div className="flex flex-col text-center trans30" key={i} style={{ width: `${tdWidth}px` }}>
                    <p key={i} className="p-1 border bg-primary">
                      {i + 1}
                    </p>
                    <p key={i} className="bg-[#b4d2cb] p-1 border">
                      <WeekDay day={i + 1} />
                    </p>
                    {employees?.map((_, ii) => (
                      <p
                        key={i}
                        className={`text-black flex items-center justify-center h-10 border ${ii % 2 && "bg-primary-pale"} ${
                          employees.length - 1 === ii && "border-b-[#999]"
                        }`}
                        style={{
                          backgroundColor: workingTimes?.find((workingTime) => workingTime.id === shifts[ii].workIds[i])?.color,
                          width: tdWidth
                        }}
                      >
                        <p className="truncate">
                          {addDayoffWorkingTimes?.find((workingTime) => workingTime.id === shifts[ii].workIds[i])?.timeName}
                        </p>
                      </p>
                    ))}
                    {workingTimes?.map((workingTime, ii) => (
                      <div key={i} className={`text-black flex items-center justify-center h-10 border ${ii % 2 && "bg-secondary-pale"}`}>
                        <DayCountEmployee workingTime={workingTime} day={i} />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          <div>
            <div className="flex">
              {options.map((workingTime, i) => (
                <div
                  key={i}
                  className={`${
                    i === 0 && "border-l-[#999] "
                  } justify-center border items-center flex h-[60px] bg-primary text-vertical trans30 px-1 leading-3	`}
                  style={isDelayOpen ? { width: "35px" } : { width: "0px", border: 0, padding: 0 }}
                >
                  {isDelayOpen && workingTime.label}
                </div>
              ))}
              <div className={"justify-center border items-center flex  w-[35px] h-[60px] bg-primary text-vertical"}>合計</div>
            </div>
            <div className="flex">
              {options.map((workingTime, i) => (
                <div key={i}>
                  {employees?.map((employee, ii) => (
                    <div
                      key={ii}
                      className={`text-black flex flex-col items-center justify-center h-10 border trans30 ${i % 2 && "bg-primary-pale"} ${
                        i === 0 && "border-l-[#999]"
                      }`}
                      style={isDelayOpen ? { width: "35px" } : { width: "0px", border: 0 }}
                    >
                      {isDelayOpen && <TotalCountWork workingTimeId={workingTime.value} employee={employee} />}
                    </div>
                  ))}
                </div>
              ))}
              <div
                className="border text-black flex justify-center items-center flex-col border-b-[#999] w-[35px] hover:bg-[rgba(250,250,250)] cursor-pointer"
                style={employees ? { height: `${employees.length * 40}px` } : {}}
                onClick={() => setDelayOpen(!isDelayOpen)}
              >
                <p className="text-vertical" style={employees?.length === 1 ? { display: "none" } : {}}>
                  {isDelayOpen ? "閉じる" : "開く"}
                </p>{" "}
                {isDelayOpen ? (
                  <BsChevronRight size={employees?.length === 1 ? 20 : 25} className="mt-1" />
                ) : (
                  <BsChevronLeft size={employees?.length === 1 ? 20 : 25} className="mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#888]">画面全体をスクロールする場合は右の青いバーをスクロールしてください。</p>
          <div className="flex smartTable" ref={targetRef}>
            <div className="max-h-[84vh] overflow-auto hidden-scrollbar">
              <table className="text-white max-w-full">
                <tr>
                  <th style={{ maxWidth: tdWidth, minWidth: "50px" }} className="z-50 text-black h-10 w-[50px] bg-primary p-0">
                    <div className="border h-full w-full border-[#999] flex justify-center items-center text-white">{month} 月</div>
                  </th>
                  {employees?.map((employee, i) => (
                    <th
                      key={i}
                      style={{ width: tdWidth, minWidth: "70px" }}
                      className={`text-black h-10 p-0 ${i % 2 ? "bg-primary-pale" : "bg-white"}`}
                    >
                      <div
                        className={`border h-full w-full border-b-[#999] border-t-[#999] flex justify-center items-center ${
                          employees.length - 1 === i && "border-r-[#999]"
                        }`}
                      >
                        {employee.name}
                      </div>
                    </th>
                  ))}
                  {workingTimes?.map((workingTime, i) => (
                    <th
                      key={i}
                      style={{ width: tdWidth, minWidth: "50px" }}
                      className={`text-black h-10 p-0 z-40 ${i % 2 ? "bg-secondary-pale" : "bg-white"}`}
                    >
                      <div
                        className={`border h-full w-full border-b-[#999] border-t-[#999] flex justify-center items-center ${
                          workingTimes.length - 1 === i && "border-r-[#999]"
                        }`}
                      >
                        {workingTime.timeName}
                      </div>
                    </th>
                  ))}
                </tr>
                {shifts &&
                  [...Array(new Date(year, month, 0).getDate())].map((_, i) => (
                    <tr key={i}>
                      <th className="h-[40px] p-0 z-40 ">
                        <div className="flex h-[40px]">
                          <p
                            className={`flex justify-center items-center border bg-primary min-w-[25px] border-l-[#999] ${
                              shifts[0].workIds?.length - 1 === i && "border-b-[#999]"
                            }`}
                          >
                            {i + 1}
                          </p>
                          <p
                            className={`flex justify-center items-center bg-[#b4d2cb] border min-w-[25px] border-r-[#999] ${
                              [...Array(new Date(year, month, 0).getDate())]?.length - 1 === i && "border-b-[#999]"
                            }`}
                          >
                            <WeekDay day={i + 1} />
                          </p>
                        </div>
                      </th>
                      {employees?.map((_, ii) => (
                        <td
                          key={ii}
                          className={`text-black border h-10 p-0 text-center z-30 ${ii % 2 ? "bg-primary-pale" : "bg-white"}  ${
                            employees.length - 1 === ii && "border-r-[#999]"
                          } ${shifts[0].workIds?.length - 1 === i && "border-b-[#999]"}`}
                          style={{
                            backgroundColor: workingTimes?.find((workingTime) => workingTime.id === shifts[ii].workIds[i])?.color
                          }}
                        >
                          {addDayoffWorkingTimes?.find((workingTime) => workingTime.id === shifts[ii].workIds[i])?.timeName}
                        </td>
                      ))}
                      {workingTimes?.map((workingTime, ii) => (
                        <td
                          key={i}
                          className={`text-black h-10 border text-center z-30 ${workingTimes.length - 1 === ii && "border-r-[#999]"} ${
                            ii % 2 && "bg-secondary-pale"
                          } ${shifts[0].workIds?.length - 1 === i && "border-b-[#999]"}`}
                        >
                          <DayCountEmployee workingTime={workingTime} day={i} />
                        </td>
                      ))}
                    </tr>
                  ))}
                {options.map((workingTime, i) => (
                  <tr key={i}>
                    <th className="h-[40px] p-0">
                      <div className="justify-center border items-center flex w-full bg-primary border-r-[#999] h-[40px]">
                        {workingTime.label}
                      </div>
                    </th>
                    {employees?.map((employee, ii) => (
                      <td
                        key={ii}
                        className={`text-black border h-10 p-0 text-center ${ii % 2 ? "bg-primary-pale" : "bg-white"}  ${
                          employees.length - 1 === ii && "border-r-[#999]"
                        } ${shifts && shifts[0].workIds?.length - 1 === i && "border-b-[#999]"}`}
                      >
                        {<TotalCountWork workingTimeId={workingTime.value} employee={employee} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </table>
            </div>
            <div className="ml-1 w-6 max-h-[84vh] bg-blue-400 rounded-md" />
          </div>
        </>
      )}
    </div>
  )
}
