import { CheckBox } from "app/components/common/CheckBox"
import { labels } from "app/utils/labels"
import type { WorkingTime } from "app/utils/types"

/***
 * 勤務時間帯確認テーブル
 */

export const WorkingTimesConfirmTable = ({ workingTimes }: { workingTimes?: WorkingTime[] }) => {
  return (
    <table className="flex items-center w-full flex-col rounded-md shadow-md overflow-x-auto evenColor hidden-scrollbar">
      <thead className="w-full">
        <tr className="w-full flex">
          {labels.workingTimeConfirm.map((label, i) => (
            <p key={i} className={`bg-primary p-1 text-white text-center border ${label.w}`}>
              {label.label}
            </p>
          ))}
        </tr>
      </thead>
      <tbody className="w-full ">
        {workingTimes?.map((workingTime, i) => (
          <tr key={i} className="w-full flex text-center h-10">
            <td className={"w-[15%] min-w-[120px] border h-full flex justify-center items-center"}>{workingTime.timeName}</td>
            <td className={"w-[38%] min-w-[180px] border h-full flex justify-center items-center"}>
              <p className="flex">
                <p className="flex">
                  <p className="w-6">{workingTime.startHour}</p>
                  <p className="w-3">:</p>
                  <p className="w-6">{workingTime.startMinute < 10 ? `0${workingTime.startMinute}` : workingTime.startMinute}</p>
                </p>
              </p>
              <p className="w-10">~</p>
              <p className="flex">
                <p className="flex">
                  <p className="w-6">{workingTime.endHour}</p>
                  <p className="w-3">:</p>
                  <p className="w-6">{workingTime.endMinute < 10 ? `0${workingTime.endMinute}` : workingTime.endMinute}</p>
                </p>
              </p>
            </td>
            <td className={"w-[32%] min-w-[180px] border h-full flex justify-center items-center"}>
              <p className="flex items-baseline">
                <p className="w-10">{workingTime.minEmployee}</p>
                <p className="w-3">~</p>
                <p className="w-10">{workingTime.maxEmployee}</p>
                <p className="w-3 text-xs">人</p>
              </p>
            </td>
            <td className={"w-[8%] min-w-[66px] border h-full flex justify-center items-center"}>
              <CheckBox checked={workingTime.isNextDayoff} disabled />
            </td>
            <td className={"w-[7%] min-w-[60px] border h-full flex justify-center items-center"}>
              <div className="w-6 h-6 border-gray-200 rounded-sm border-2" style={{ backgroundColor: workingTime.color }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
