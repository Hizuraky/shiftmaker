import { Outlet, useParams, useLocation, useNavigate } from "@remix-run/react"
import { Title } from "app/components/Title"
import { ShiftsSlider } from "app/components/ShiftsSlider"
import { Button } from "app/components/common"
import { useQuery } from "app/hooks/useApollo"
import type { ShiftDate, Shift } from "app/utils/types"
import { shiftsQuery } from "app/graphql/query"

/***
 * シフト一覧共通部
 */

export default function Index() {
  const { pathname } = useLocation()
  const { date } = useParams()
  const navigate = useNavigate()
  const { data }: { data: { shiftDate: ShiftDate[] } | undefined } = useQuery(shiftsQuery)

  // 最後に作成 or 更新したシフト
  const latestShift =
    data &&
    JSON.parse(JSON.stringify(data))
      .shiftDate.flatMap(({ shifts }: any) => shifts)
      .sort((a: any, b: any) => {
        const aTime = a.updatedAt ?? a.createdAt
        const bTime = b.updatedAt ?? b.createdAt
        return aTime < bTime ? 1 : -1
      })[0]
  const latestShiftDate = latestShift && data.shiftDate.find((shiftDate) => shiftDate.shifts.find((shift) => shift.id === latestShift.id))
  const latestShiftPathname = `/${latestShiftDate?.year}.${latestShiftDate?.month}/${latestShift?.id}/show`

  // 今月 + 最後に作成 or 更新したシフト
  const currentMonthShiftDate =
    data &&
    JSON.parse(JSON.stringify(data)).shiftDate.find(
      (shiftDate: ShiftDate) => shiftDate.year === new Date().getFullYear() && shiftDate.month === new Date().getMonth() + 1
    )
  const currentMonthShift = currentMonthShiftDate?.shifts.sort((a: any, b: any) => {
    const aTime = a.updatedAt ?? a.createdAt
    const bTime = b.updatedAt ?? b.createdAt
    return aTime < bTime ? 1 : -1
  })[0]
  const currentMonthShiftPathname = `/${new Date().getFullYear()}.${new Date().getMonth() + 1}/${currentMonthShift?.id}/show`

  // 一時保存の最終更新データ
  const temporarilyShift =
    data &&
    JSON.parse(JSON.stringify(data))
      .shiftDate.flatMap(({ shifts }: any) => shifts)
      .filter((shift: Shift) => !shift.isCompleted)
      .sort((a: any, b: any) => {
        const aTime = a.updatedAt ?? a.createdAt
        const bTime = b.updatedAt ?? b.createdAt
        return aTime < bTime ? 1 : -1
      })[0]

  const temporarilyShiftDate =
    temporarilyShift && data.shiftDate.find((shiftDate) => shiftDate.shifts.find((shift) => shift.id === temporarilyShift.id))
  const temporarilyShiftDatePathname = `/${temporarilyShiftDate?.year}.${temporarilyShiftDate?.month}/${temporarilyShift?.id}/show`

  return (
    <div className="w-full">
      <Title currentText="シフト作成 " />
      <ShiftsSlider
        latestShift={{ path: latestShiftPathname, shifts: latestShiftDate, shift: latestShift }}
        currentMonthShift={{ path: currentMonthShiftPathname, shifts: currentMonthShiftDate, shift: currentMonthShift }}
        temporarilyShift={{ path: temporarilyShiftDatePathname, shifts: temporarilyShiftDate, shift: temporarilyShift }}
      />
      <div className="w-full border-2 rounded-md p-4 my-4">
        <div className="flex items-center justify-between">
          <Title
            currentText={date ? `${date?.split(".")[0]}年${date?.split(".")[1]}月` : "作成シフト一覧"}
            previous={pathname !== "/shift" ? [{ text: "作成シフト一覧", rootPath: "/shift" }] : []}
          />
          <div className="flex sm:flex-col">
            <div className="sm:hidden mr-4">
              <Button text="従業員編集" width="md" onClick={() => navigate("/workingTime")} color="primary-light" />
            </div>
            <Button text="シフト作成" width="md" color="primary" onClick={() => navigate("/create/date")} />
          </div>
        </div>
        <Outlet context={{ data }} />
      </div>
    </div>
  )
}
