import Select from "react-select"
import { useRef, useEffect, useState } from "react"
import { useGetElementProperty } from "app/hooks/useGetElementProperty"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { useShiftCreateRecoil } from "app/hooks/useRecoil"
import type { Employee, WorkingTime } from "app/utils/types"
import { useParams } from "@remix-run/react"

/***
 * シフト編集テーブル
 */

type Props = {
  tableSize?: number
  shifts: { employee: number | undefined; workIds: (number | undefined)[] }[]
  setShifts: React.Dispatch<React.SetStateAction<{ employee: number | undefined; workIds: (number | undefined)[] }[]>>
  employees?: Employee[]
  workingTimes?: WorkingTime[]
  disabled?: boolean
  setUpdateFlag?: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
}

export const ShiftsTable = ({ tableSize = 15, shifts, setShifts, employees, workingTimes, disabled, setUpdateFlag, isEdit }: Props) => {
  const { recoilShiftDate } = useShiftCreateRecoil()
  const { date: editShiftDate } = useParams()
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
    const currentDay = ["日", "月", "火", "水", "木", "金", "土"][
      new Date(
        isEdit ? Number(editShiftDate?.split(".")[0]) : recoilShiftDate?.year ?? 2000,
        isEdit ? Number(editShiftDate?.split(".")[1]) - 1 : Number(recoilShiftDate?.month) - 1 ?? 1,
        day
      ).getDay()
    ]
    return <p className={`${currentDay === "土" ? "text-[#3190FF]" : currentDay === "日" && "text-[#FF7070]"}`}>{currentDay}</p>
  }

  // 選択肢の生成。固定選択肢（休日など）を追加
  const options = workingTimes
    ? [
        { value: undefined, label: "未選択" },
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

  // 各従業員の合計勤務時間帯数
  const TotalCountWork = ({ workingTimeId, employee }: { workingTimeId: number | undefined; employee: Employee }) => {
    let workNum = 0
    const employeeShift = shifts?.find((shiftEmployee) => shiftEmployee.employee === employee.id)
    employeeShift?.workIds.forEach((v) => v === workingTimeId && workNum++)
    return <p>{workNum}</p>
  }

  const WorkingTimeSelect = ({
    day,
    index,
    workingTimeOptions
  }: {
    day: number
    index: number
    workingTimeOptions: { label: string; value: number | undefined }[]
  }) => (
    <Select
      instanceId="select"
      value={{
        value: shifts[index]?.workIds[day],
        label: shifts[index]?.workIds[day] && options.find((v) => v.value === shifts[index]?.workIds[day])?.label
      }}
      options={workingTimeOptions}
      onChange={(e) => {
        setUpdateFlag && setUpdateFlag(true)
        let currentShifts = [...shifts]
        currentShifts[index].workIds[day] = e!.value
        setShifts([...currentShifts])
      }}
      menuPlacement={"top"}
      menuPosition="fixed"
      styles={{
        control: (base: any) => ({ ...base, backgroundColor: "transparent", border: 0, padding: 0, zIndex: 9999 }),
        singleValue: (base: any) => ({ ...base, whiteSpace: windowDimensions?.width >= 640 ? "nowrap" : "normal" }),
        valueContainer: (base: any) => ({ ...base, padding: "0px", width: `${tdWidth}px` }),
        menu: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 60, fontSize: "12px" }),
        menuPortal: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999 }),
        indicatorsContainer: () => ({ display: "none" }),
        indicatorSeparator: () => ({ display: "none" }),
        placeholder: () => ({ display: "none" }),
        container: (base: any) => ({ ...base, zIndex: 20 })
      }}
      isDisabled={disabled}
      isSearchable={false}
      menuShouldBlockScroll
      menuPortalTarget={document.body}
    />
  )

  return (
    <div className="flex items-center w-full flex-col rounded-md">
      {windowDimensions?.width >= 640 ? (
        <div className="flex w-full  text-white">
          <div className="flex flex-col">
            <div className={"border items-center flex w-[150px] justify-center h-[60px] bg-primary border-r-[#999]"}>
              {isEdit ? editShiftDate?.split(".")[0] : recoilShiftDate?.year} 年{" "}
              {isEdit ? editShiftDate?.split(".")[1] : recoilShiftDate?.month} 月
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
              {shifts[0].workIds.map((_, i) => (
                <div className="flex flex-col text-center trans30" key={i} style={{ width: `${tdWidth}px` }}>
                  <div className="relative h-[60px] hover:opacity-70">
                    <Select
                      instanceId="select"
                      options={options}
                      onChange={(e) => {
                        setUpdateFlag && setUpdateFlag(true)
                        let currentShifts = [...shifts]
                        currentShifts.forEach((employee) => {
                          employee.workIds[i] = e!.value
                        })
                        setShifts([...currentShifts])
                      }}
                      menuPlacement={"top"}
                      menuPosition="fixed"
                      styles={{
                        control: (base: any) => ({
                          ...base,
                          backgroundColor: "transparent",
                          border: 0,
                          position: "absolute",
                          zIndex: 20,
                          width: tdWidth,
                          height: `${employees!.length * 40 + 60}px`
                        }),
                        valueContainer: (base: any) => ({ ...base, padding: 0, width: `50px`, color: "transparent" }),
                        menu: (base: any) => ({ ...base, width: `100px`, margin: 0, color: "#000", fontSize: "12px" }),
                        menuPortal: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999 }),
                        indicatorsContainer: () => ({ display: "none" }),
                        indicatorSeparator: () => ({ display: "none" }),
                        placeholder: () => ({ display: "none" }),
                        singleValue: () => ({ display: "none" })
                      }}
                      isDisabled={disabled}
                      isSearchable={false}
                      menuShouldBlockScroll
                      menuPortalTarget={document.body}
                    />
                    <p key={i} className="border bg-primary absolute flex justify-center items-center h-[30px] w-full">
                      {i + 1}
                    </p>
                    <p key={i} className="bg-[#b4d2cb] border absolute flex justify-center items-center h-[30px] top-[30px] w-full">
                      <WeekDay day={i + 1} />
                    </p>
                  </div>

                  {employees?.map((employee, ii) => {
                    const workingTimeOptions = [
                      ...options.filter((option) => option.value! > 90 || employee.canWorkingIds.includes(option.value!) || !option.value)
                    ]

                    return (
                      <div
                        key={i}
                        className={`text-black flex items-center justify-center h-10 border ${ii % 2 && "bg-primary-pale"} ${
                          employees.length - 1 === ii && "border-b-[#999]"
                        }`}
                        style={{
                          backgroundColor: workingTimes?.find((workingTime) => workingTime.id === shifts[ii].workIds[i])?.color
                        }}
                      >
                        <WorkingTimeSelect day={i} index={ii} workingTimeOptions={workingTimeOptions} />
                      </div>
                    )
                  })}
                  {workingTimes?.map((workingTime, ii) => (
                    <div key={ii} className={`text-black flex items-center justify-center h-10 border ${ii % 2 && "bg-secondary-pale"}`}>
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
                </p>
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
                  <th style={{ maxWidth: tdWidth, minWidth: "50px" }} className="z-[49] text-black h-10 w-[50px] bg-primary p-0">
                    <div className="border h-full w-full border-[#999] flex justify-center items-center text-white">
                      {isEdit ? editShiftDate?.split(".")[1] : recoilShiftDate?.month} 月
                    </div>
                  </th>
                  {employees?.map((employee, i) => (
                    <th
                      key={i}
                      style={{ width: tdWidth, minWidth: "70px" }}
                      className={`z-40 text-black h-10 p-0 ${i % 2 ? "bg-primary-pale" : "bg-white"}`}
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
                      className={`z-40 text-black h-10 p-0 ${i % 2 ? "bg-secondary-pale" : "bg-white"}`}
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
                {shifts[0].workIds.map((_, i) => (
                  <tr key={i}>
                    <th className="h-[40px] p-0 z-40">
                      <div className="flex h-[40px] relative">
                        <Select
                          instanceId="select"
                          options={options}
                          onChange={(e) => {
                            setUpdateFlag && setUpdateFlag(true)
                            let currentShifts = [...shifts]
                            currentShifts.forEach((employee) => {
                              employee.workIds[i] = e!.value
                            })
                            setShifts([...currentShifts])
                          }}
                          menuPlacement={"top"}
                          menuPosition="fixed"
                          styles={{
                            control: (base: any) => ({
                              ...base,
                              backgroundColor: "transparent",
                              border: 0,
                              position: "absolute",
                              zIndex: 9998,
                              ":hover": {
                                width: `${tdWidth && tdWidth > 70 ? tdWidth * employees!.length + 50 : 70 * employees!.length + 50}px`
                              }
                            }),
                            valueContainer: (base: any) => ({ ...base, padding: 0, width: `70px`, color: "transparent" }),
                            menu: (base: any) => ({ ...base, width: `100px`, margin: 0, color: "#000", fontSize: "12px" }),
                            menuPortal: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999 }),
                            indicatorsContainer: () => ({ display: "none" }),
                            indicatorSeparator: () => ({ display: "none" }),
                            placeholder: () => ({ display: "none" }),
                            singleValue: () => ({ display: "none" })
                          }}
                          isDisabled={disabled}
                          isSearchable={false}
                          menuShouldBlockScroll
                          menuPortalTarget={document.body}
                        />
                        <p
                          className={`flex justify-center items-center border bg-primary min-w-[25px] w-[25px] h-full border-l-[#999] absolute ${
                            shifts[0].workIds?.length - 1 === i && "border-b-[#999]"
                          }`}
                        >
                          {i + 1}
                        </p>
                        <p
                          className={`flex justify-center items-center bg-[#b4d2cb] border min-w-[25px] border-r-[#999] absolute w-[25px] left-[25px] h-full ${
                            shifts[0].workIds?.length - 1 === i && "border-b-[#999]"
                          }`}
                        >
                          <WeekDay day={i + 1} />
                        </p>
                      </div>
                    </th>
                    {employees?.map((employee, ii) => {
                      const workingTimeOptions = [
                        ...options.filter((option) => option.value! > 90 || employee.canWorkingIds.includes(option.value!) || !option.value)
                      ]
                      return (
                        <td
                          key={ii}
                          className={`z-[9999] text-black border h-10 p-0 text-center ${ii % 2 ? "bg-primary-pale" : "bg-white"}  ${
                            employees.length - 1 === ii && "border-r-[#999]"
                          } ${shifts[0].workIds?.length - 1 === i && "border-b-[#999]"}`}
                          style={{
                            backgroundColor: workingTimes?.find((workingTime) => workingTime.id === shifts[ii].workIds[i])?.color
                          }}
                        >
                          <WorkingTimeSelect day={i} index={ii} workingTimeOptions={workingTimeOptions} />
                        </td>
                      )
                    })}
                    {workingTimes?.map((workingTime, ii) => (
                      <td
                        key={i}
                        className={`text-black h-10 border text-center ${workingTimes.length - 1 === ii && "border-r-[#999]"} ${
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
                        } ${shifts[0].workIds?.length - 1 === i && "border-b-[#999]"}`}
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
