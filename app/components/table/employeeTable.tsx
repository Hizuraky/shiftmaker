import { Controller } from "react-hook-form"
import { FaTrashAlt } from "react-icons/fa"
import { CheckBox, Input } from "app/components/common"
import { labels } from "app/utils/labels"
import type { WorkingTime, Employee } from "app/utils/types"
import type { Control, UseFormRegister } from "react-hook-form"

/***
 * 従業員編集テーブル
 */

type Props = {
  employees: Employee[]
  register: UseFormRegister<any>
  errors: any
  workingTimes: WorkingTime[]
  control: Control<
    {
      workingTimes: WorkingTime[]
      employees: Employee[]
    },
    object
  >
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  setOpenDeleteEmployeeModal: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteCategory: React.Dispatch<React.SetStateAction<"employee" | "workingTime">>
}

export const EmployeeTable = ({
  setSelectedIndex,
  setOpenDeleteEmployeeModal,
  employees,
  register,
  errors,
  workingTimes,
  control,
  setDeleteCategory
}: Props) => {
  return (
    <table className="flex items-center flex-col rounded-md shadow-md overflow-scroll hidden-scrollbar evenColor">
      <thead className="w-full">
        <tr className="w-full flex">
          {labels.employee.map((label, i) => (
            <p
              key={i}
              className={`bg-primary p-1 text-white text-center border ${label.w}`}
              style={label.label === "勤務可能時間帯" ? { minWidth: `${workingTimes?.length * 100}px` } : {}}
            >
              {label.label}
            </p>
          ))}
        </tr>
      </thead>
      <tbody className="w-full">
        {employees?.map((employee: any, i: number) => (
          <tr key={i} className="flex text-center">
            <td className={"w-[3%] border p-1 min-w-[30px] flex items-center justify-center"}>{i + 1}</td>
            <td className={"w-[21%] border p-1 min-w-[140px] flex flex-col items-center justify-center"}>
              <Input register={register} key={i} schema={`employees[${i}].name`} required label="従業員名" maxLength={10} />
              <p className="text-[#ef5a5a] text-xs">{errors?.employees && errors?.employees[i]?.name?.message}</p>
            </td>
            <td
              className={"w-[71%] border p-1 flex items-center justify-around"}
              key={i}
              style={{ minWidth: `${workingTimes && workingTimes.length * 100}px` }}
            >
              {workingTimes?.map((workingTime: any) => (
                <Controller
                  key={`${employee.id}${workingTime.id}`}
                  control={control}
                  name={`employees.${i}.canWorkingIds`}
                  render={({ field: { onChange, value } }) => {
                    const checked = value.includes(workingTime.id)
                    return (
                      <>
                        <CheckBox
                          value={`${employee.id}${workingTime.id}`}
                          onChange={() =>
                            onChange(checked ? [...value.filter((v: any) => v !== workingTime.id)] : [...value, workingTime.id])
                          }
                          checked={checked}
                          label={workingTime.timeName}
                        />
                        <div style={workingTimes.length - 1 !== i ? { marginLeft: "5px" } : {}} />
                      </>
                    )
                  }}
                />
              ))}
            </td>
            <td className={"w-[5%] border p-1 flex items-center justify-around min-w-[40px]"}>
              <FaTrashAlt
                size={20}
                className="text-[#666] hover:text-[#aaa] cursor-pointer"
                onClick={() => {
                  setSelectedIndex(i)
                  setOpenDeleteEmployeeModal(true)
                  setDeleteCategory("employee")
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
