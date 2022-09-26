import { CheckBox } from "app/components/common/CheckBox"
import type { WorkingTime, Employee } from "app/utils/types"
import { labels } from "app/utils/labels"

/***
 * 従業員確認テーブル
 */

export const EmployeesConfirmTable = ({ employees, workingTimes }: { employees?: Employee[]; workingTimes?: WorkingTime[] }) => {
  return (
    <table className="flex items-center w-full flex-col rounded-md shadow-md overflow-x-auto evenColor hidden-scrollbar">
      <thead className="w-full">
        <tr className="w-full flex">
          {labels.employeeConfirm.map((label, i) => (
            <p
              key={i}
              className={`bg-primary p-1 text-white text-center border ${label.w}`}
              style={{ minWidth: i == 1 ? `${workingTimes && workingTimes.length * 100}px` : "" }}
            >
              {label.label}
            </p>
          ))}
        </tr>
      </thead>
      <tbody className="w-full">
        {employees?.map((employee, i) => (
          <tr key={i} className="w-full flex text-center h-10 items-center">
            <td className={"w-[30%] border min-w-[130px] h-full flex items-center justify-center"}>{employee.name}</td>
            <td
              className="w-[70%] border p-1 flex items-center justify-around h-full"
              style={{ minWidth: `${workingTimes && workingTimes.length * 100}px` }}
            >
              {workingTimes?.map((workingTime, i) => (
                <>
                  <CheckBox checked={employee.canWorkingIds.includes(workingTime.id)} disabled key={i} label={workingTime.timeName} />
                  <div style={workingTimes.length - 1 !== i ? { marginLeft: "5px" } : {}} />
                </>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
