import { useNavigate } from "@remix-run/react"
import { WorkingTimesConfirmTable } from "~/components/table/WorkingTimesConfirmTable"
import { EmployeesConfirmTable } from "app/components/table/EmployeesConfirmTable"
import { Spinner } from "app/components/Spinner"
import { employeesAndWorkingTimesQuery } from "app/graphql/query"
import { useQuery } from "app/hooks/useApollo"
import { Button, Accordion } from "app/components/common"
import { useShiftCreateRecoil } from "app/hooks/useRecoil"
import { useEffect, useState } from "react"
import type { WorkingTime, Employee } from "app/utils/types"

/***
 * シフト作成 > 各種確認画面
 */

export default function Index() {
  const navigate = useNavigate()
  const { data: queryData } = useQuery(employeesAndWorkingTimesQuery)
  const { resetShifts, recoilEmployeeWorkingTime, setRecoilEmployeeWorkingTime } = useShiftCreateRecoil()
  const [data, setDataState] = useState<{
    employees: Employee[]
    workingTimes: WorkingTime[]
    deleteEmployeeIds?: (number | undefined)[]
    deleteWorkingTimeIds?: (number | undefined)[]
  }>()

  // 従業員情報・勤務時間帯をフェッチし、Recoilに値があればそれを表示。なければフェッチした情報を表示。
  useEffect(() => {
    if (recoilEmployeeWorkingTime) {
      setDataState(recoilEmployeeWorkingTime)
    } else if (queryData) {
      setDataState({ workingTimes: queryData.workingTime, employees: queryData.employee })
      setRecoilEmployeeWorkingTime({ workingTimes: queryData.workingTime, employees: queryData.employee })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData])

  // 作成途中のシフトがRecoilに残っている場合はリセットして画面遷移
  const navigateAutomation = () => {
    resetShifts()
    navigate("/create/automation")
  }

  return (
    <div>
      <Spinner isLoad={!data} />
      <div className="text[#555] mb-2">
        <Accordion label="操作手順">
          <div className="mb-2">
            <p>下記の勤務時間帯・従業員情報でシフトを作成します。</p>
            <p>よろしければ「自動生成へ」ボタンをクリックしてください。</p>
            <p>勤務時間帯、従業員を編集する場合は「各種編集」をクリックしてください。</p>
          </div>
        </Accordion>
      </div>
      <h1 className="text-base font-bold">勤務時間帯</h1>
      {data && data.workingTimes?.length > 0 ? (
        <WorkingTimesConfirmTable workingTimes={data?.workingTimes} />
      ) : (
        <div>
          <p>表示できる勤務時間帯情報がありません。</p>
          <p>[各種編集]ボタンより登録してください。</p>
        </div>
      )}
      <div className="my-4" />
      <h1 className="text-base font-bold">従業員</h1>
      {data && data.employees?.length > 0 ? (
        <EmployeesConfirmTable employees={data?.employees} workingTimes={data?.workingTimes} />
      ) : (
        <div>
          <p>表示できる従業員情報がありません。</p>
          <p>[各種編集]ボタンより登録してください。</p>
        </div>
      )}
      <div className="w-full flex my-2 justify-end">
        <Button
          text="各種編集"
          onClick={() => {
            navigate("/workingTime", { state: { inCreate: true } })
          }}
          color="secondary-light"
          width="sm"
        />
      </div>
      <div className="w-full flex justify-end mt-4">
        <Button
          text="自動生成へ"
          onClick={navigateAutomation}
          disabled={(data && !data.employees?.length) || (data && !data.workingTimes?.length)}
        />
      </div>
    </div>
  )
}
