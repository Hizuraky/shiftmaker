import { CheckBox } from "app/components/common"
import { useState, useEffect } from "react"
import { useOutletContext } from "@remix-run/react"
import type { ShiftDate } from "app/utils/types"
import { PartSpinner } from "app/components/Spinner"
import { useNavigate } from "@remix-run/react"

/***
 * シフト一覧画面
 */

type Props = { workedDay?: number; shiftsNum?: number; year: number; month: number; shifts?: ShiftDate }
export default function Index() {
  const navigate = useNavigate()
  const [isSortByOld, setSortByOld] = useState(false)
  const [animTimeout, setAnimTimeout] = useState(false)
  const props = useOutletContext<{ data: { shiftDate: ShiftDate[] }; error: any } | undefined>()
  const data = props?.data?.shiftDate && [...props?.data?.shiftDate]

  useEffect(() => {
    setTimeout(() => {
      setAnimTimeout(isSortByOld)
    }, 200)
  }, [isSortByOld])

  const ShiftList = ({ workedDay, shiftsNum, year, month, shifts }: Props) => {
    const onClickList = () => {
      navigate(`/shift/${year}.${month}`, { state: { shift: shifts?.shifts, shifts: shifts } })
    }
    return (
      <div className="flex items-baseline hover:opacity-70 cursor-pointer border-b my-3 mx-4 trans5" onClick={onClickList}>
        <h1 className="text-[#385F5F] font-bold text-xl w-32">{`${year}年${month}月`}</h1>
        {workedDay && (
          <div className="flex items-baseline ml-[5%] w-32">
            出勤日数： <p className="text-base">{workedDay}</p>
          </div>
        )}
        {shiftsNum && (
          <div className="flex items-baseline ml-[5%] w-32">
            保存シフト数： <p className="text-base">{shiftsNum}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {data?.length === 0 ? (
        <p>表示できるシフトはありません。</p>
      ) : (
        <PartSpinner isLoad={!props?.data} isError={props?.error}>
          <>
            <div className="flex items-center p-2">
              <CheckBox
                value={"isSortByOld"}
                onChange={(e: any) => setSortByOld(e.target.checked)}
                label="古い順に表示"
                checked={isSortByOld}
              />
            </div>
            {animTimeout
              ? data?.reverse().map((v, i) => (
                  <div
                    key={i}
                    style={isSortByOld ? { opacity: 1, marginLeft: "0px" } : { opacity: 0, marginLeft: `50px` }}
                    className="trans30"
                  >
                    <ShiftList shiftsNum={v.shifts.length} key={i} shifts={v} year={v.year} month={v.month} />
                  </div>
                ))
              : data?.map((v, i) => (
                  <div
                    key={i}
                    style={isSortByOld ? { opacity: 0, marginLeft: `50px` } : { opacity: 1, marginLeft: "0px" }}
                    className="trans30"
                  >
                    <ShiftList shiftsNum={v.shifts.length} key={i} shifts={v} year={v.year} month={v.month} />
                  </div>
                ))}
          </>
        </PartSpinner>
      )}
    </div>
  )
}
