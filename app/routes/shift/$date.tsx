import { useLocation, useParams, useOutletContext } from "@remix-run/react"
import { CheckBox } from "app/components/common"
import { useState } from "react"
import { useNavigate } from "@remix-run/react"
import { PartSpinner } from "app/components/Spinner"
import type { Shift, ShiftDate } from "app/utils/types"

/***
 * シフト一覧 > 該当の年月一覧画面
 */

export default function Index() {
  const navState = useLocation().state as { shift: Shift[]; shifts: ShiftDate }
  const { date } = useParams()
  const year = Number(date?.split(".")[0])
  const month = Number(date?.split(".")[1])
  const props = useOutletContext<{ data: { shiftDate: ShiftDate[] }; error: any } | undefined>()
  const shifts = navState?.shift ?? props?.data?.shiftDate.find((shifts) => shifts.year === year && shifts.month === month)?.shifts
  const shiftDate = navState?.shifts ?? props?.data?.shiftDate.find((shifts) => shifts.year === year && shifts.month === month)
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState({ isOrderByOld: false, isCompleted: false, isTemporarily: false })

  // チェックボックスチェック処理
  const handleChange = (e: any) => {
    if (e.target.id === "isCompleted" && e.target.checked && checkedItems.isTemporarily) {
      setCheckedItems({
        ...checkedItems,
        [e.target.id]: e.target.checked,
        isTemporarily: false
      })
    } else if (e.target.id === "isTemporarily" && e.target.checked && checkedItems.isCompleted) {
      setCheckedItems({
        ...checkedItems,
        [e.target.id]: e.target.checked,
        isCompleted: false
      })
    } else {
      setCheckedItems({
        ...checkedItems,
        [e.target.id]: e.target.checked
      })
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center p-2">
        <CheckBox value={"isCompleted"} onChange={handleChange} label="作成済のみ表示" checked={checkedItems.isCompleted} />
        <div className="ml-10" />
        <CheckBox value={"isTemporarily"} onChange={handleChange} label="一時保存のみ表示" checked={checkedItems.isTemporarily} />
      </div>
      <PartSpinner isLoad={!navState?.shift && !props?.data} isError={props?.error}>
        <>
          {shifts?.map((shift: Shift, i: number) => {
            const List = () => (
              <div
                className="flex items-baseline hover:opacity-70 cursor-pointer border-b my-3 mx-4 sm:flex-col"
                onClick={() => navigate(`/${date}/${shift.id}/show`, { state: { shift, shifts: shiftDate } })}
                key={i}
              >
                <div className="flex w-[35%] items-baseline sm:w-full">
                  <p className="mr-5 font-semibold text-gray-700 w-[10%] sm:mr-1">No.{i + 1}</p>
                  <h1 className="text-[#385F5F] font-bold text-xl w-[90%] truncate">{shift.shiftName}</h1>
                </div>
                <div className="flex items-baseline text-gray-500 w-[13%] sm:w-full sm:ml-2 sm:text-[0.6rem]">
                  状態： <p className="text-base text-primary-text sm:text-xs">{shift.isCompleted ? "作成済" : "一時保存"}</p>
                </div>
                <div className="flex items-baseline text-gray-500 w-[26%] sm:w-full sm:ml-2 sm:text-[0.6rem]">
                  作成： <p className="text-lg text-primary-text sm:text-sm">{new Date(shift.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-baseline text-gray-500 w-[26%] sm:w-full sm:ml-2 sm:text-[0.6rem]">
                  更新：
                  <p className={`${shift.updatedAt ? "text-lg sm:text-sm" : "text-base sm:text-xs"} text-primary-text`}>
                    {shift.updatedAt ? new Date(shift.updatedAt).toLocaleString() : "未更新"}
                  </p>
                </div>
              </div>
            )

            if (checkedItems.isCompleted) {
              return shift.isCompleted && <List />
            } else if (checkedItems.isTemporarily) {
              return !shift.isCompleted && <List />
            } else {
              return <List />
            }
          })}
        </>
      </PartSpinner>
    </div>
  )
}
