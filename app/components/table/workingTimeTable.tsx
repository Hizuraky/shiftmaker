import { Controller } from "react-hook-form"
import { FaTrashAlt } from "react-icons/fa"
import { IoIosArrowDown } from "react-icons/io"
import { CheckBox, Input, Select } from "app/components/common"
import { setStartHoursOptions, setFinishHoursOptions, setMinutesOptions } from "app/utils/Options"
import { labels } from "app/utils/labels"
import type { Control, UseFormRegister, UseFormSetValue, UseFormClearErrors, UseFormSetError, UseFormGetValues } from "react-hook-form"
import type { WorkingTime, Employee } from "app/utils/types"

/***
 * 勤務時間帯編集テーブル
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
  setValue: UseFormSetValue<any>
  getValues: UseFormGetValues<{
    workingTimes: WorkingTime[]
    employees: Employee[]
  }>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
  setOpenDeleteEmployeeModal: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteCategory: React.Dispatch<React.SetStateAction<"employee" | "workingTime">>
  setError: UseFormSetError<{
    workingTimes: WorkingTime[]
    employees: Employee[]
  }>
  clearErrors: UseFormClearErrors<{
    workingTimes: WorkingTime[]
    employees: Employee[]
  }>
}

export const WorkingTimeTable = ({
  setOpenDeleteEmployeeModal,
  setOpen,
  setSelectedIndex,
  getValues,
  register,
  errors,
  workingTimes,
  control,
  setValue,
  setDeleteCategory,
  setError,
  clearErrors
}: Props) => {
  const NumButton = ({ type, onClick, disabled }: { type: "minus" | "plus"; onClick: any; disabled?: boolean }) => (
    <div
      className={`flex items-center justify-center bg-primary w-6 h-6 rounded-sm text-lg ${
        type === "minus" ? "ml-[-10px]" : "mr-[-10px]"
      } ${disabled ? "bg-[#aaa]" : "cursor-pointer hover:opacity-80"}`}
      onClick={onClick}
    >
      {type === "minus" ? "-" : "+"}
    </div>
  )
  return (
    <table className="flex items-center w-full flex-col rounded-md shadow-md overflow-x-scroll hidden-scrollbar evenColor">
      <thead className="w-full">
        <tr className="w-full flex">
          {labels.workTime.map((label, i) => (
            <p key={i} className={`bg-primary p-1 text-white text-center border ${label.w}`}>
              {label.label}
            </p>
          ))}
        </tr>
      </thead>
      <tbody className="w-full">
        {workingTimes?.map((workingTime, i) => (
          <tr key={i} className="w-full flex text-center">
            <td className={"w-[3%] border p-1 min-w-[30px] flex items-center justify-center"}>{i + 1}</td>
            {/* 勤務時間帯名 */}
            <td className={"w-[15%] border p-1 flex flex-col items-center justify-center min-w-[100px]"}>
              <Input register={register} key={i} schema={`workingTimes.${i}.timeName`} required label="勤務時間帯名" maxLength={8} />
              <p className="text-[#ef5a5a] text-xs">{errors?.workingTimes && errors.workingTimes[i]?.timeName?.message}</p>
            </td>

            {/* 勤務時間 */}
            <td className={"w-[33%] border p-1 flex items-center justify-around min-w-[180px] flex-col"}>
              <div className="w-full flex items-center justify-center">
                <div className="flex w-[45%] items-center justify-around">
                  <div className="w-[48%] max-w-[70px]">
                    <Controller
                      key={`workingTime${workingTime.id}StartHour`}
                      control={control}
                      name={`workingTimes.${i}.startHour`}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={value.hasOwnProperty("value") ? value : { value: value, label: value }}
                          onChange={(e) => {
                            if (
                              e.value > getValues(`workingTimes.${i}.endHour`) ||
                              (e.value === getValues(`workingTimes.${i}.endHour`) &&
                                getValues(`workingTimes.${i}.startMinute`) >= getValues(`workingTimes.${i}.endMinute`))
                            ) {
                              setError(`workingTimes.${i}.startHour`, { message: "開始時間 < 終了時間 で設定してください" })
                            } else {
                              clearErrors(`workingTimes.${i}.startHour`)
                            }
                            onChange(e.value)
                          }}
                          options={setStartHoursOptions()}
                        />
                      )}
                    />
                  </div>
                  :
                  <div className="w-[48%] max-w-[70px]">
                    <Controller
                      key={`workingTime${workingTime.id}StartMinute`}
                      control={control}
                      name={`workingTimes.${i}.startMinute`}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={value.hasOwnProperty("value") ? value : { value: value, label: value < 10 ? `0${value}` : value }}
                          onChange={(e) => {
                            if (
                              getValues(`workingTimes.${i}.startHour`) > getValues(`workingTimes.${i}.endHour`) ||
                              (getValues(`workingTimes.${i}.startHour`) === getValues(`workingTimes.${i}.endHour`) &&
                                e.value >= getValues(`workingTimes.${i}.endMinute`))
                            ) {
                              setError(`workingTimes.${i}.startHour`, { message: "開始時間 < 終了時間 で設定してください" })
                            } else {
                              clearErrors(`workingTimes.${i}.startHour`)
                            }
                            onChange(e.value)
                          }}
                          options={setMinutesOptions()}
                        />
                      )}
                    />
                  </div>
                </div>
                〜
                <div className="flex w-[45%] items-center justify-around">
                  <div className="w-[48%] max-w-[70px]">
                    <Controller
                      key={`workingTime${workingTime.id}FinishHour`}
                      control={control}
                      name={`workingTimes.${i}.endHour`}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={value.hasOwnProperty("value") ? value : { value: value, label: value }}
                          onChange={(e) => {
                            if (
                              getValues(`workingTimes.${i}.startHour`) > e.value ||
                              (getValues(`workingTimes.${i}.startHour`) === e.value &&
                                getValues(`workingTimes.${i}.startMinute`) >= getValues(`workingTimes.${i}.endMinute`))
                            ) {
                              setError(`workingTimes.${i}.startHour`, { message: "開始時間 < 終了時間 で設定してください" })
                            } else {
                              clearErrors(`workingTimes.${i}.startHour`)
                            }
                            onChange(e.value)
                          }}
                          options={setFinishHoursOptions()}
                        />
                      )}
                    />
                  </div>
                  :
                  <div className="w-[48%] max-w-[70px]">
                    <Controller
                      key={`workingTime${workingTime.id}FinishMinute`}
                      control={control}
                      name={`workingTimes.${i}.endMinute`}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          value={value.hasOwnProperty("value") ? value : { value: value, label: value < 10 ? `0${value}` : value }}
                          onChange={(e) => {
                            if (
                              getValues(`workingTimes.${i}.startHour`) > getValues(`workingTimes.${i}.endHour`) ||
                              (getValues(`workingTimes.${i}.startHour`) === getValues(`workingTimes.${i}.endHour`) &&
                                getValues(`workingTimes.${i}.startMinute`) >= e.value)
                            ) {
                              setError(`workingTimes.${i}.startHour`, { message: "開始時間 < 終了時間 で設定してください" })
                            } else {
                              clearErrors(`workingTimes.${i}.startHour`)
                            }
                            onChange(e.value)
                          }}
                          options={setMinutesOptions()}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <p className="text-[#ef5a5a] text-xs">{errors?.workingTimes && errors.workingTimes[i]?.startHour?.message}</p>
            </td>

            {/* 必要人数 */}
            <td className={"w-[29%] border p-1 flex items-center justify-around text-white min-w-[180px]"}>
              <div className="flex items-center justify-between bg-gray-200 rounded-md w-[30%] h-full">
                <Controller
                  key={`workingTime${workingTime.id}MinEmployee`}
                  control={control}
                  name={`workingTimes.${i}.minEmployee`}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <NumButton type="minus" onClick={() => value > 0 && onChange(value - 1)} disabled={value === 0} />
                      <p className="text-black">{value}</p>
                      <NumButton
                        type="plus"
                        onClick={() => {
                          if (getValues(`workingTimes.${i}.maxEmployee`) === value) {
                            setValue(`workingTimes.${i}.maxEmployee`, value + 1)
                          }
                          onChange(value + 1)
                        }}
                      />
                    </>
                  )}
                />
              </div>
              <p className="text-black">〜</p>
              <div className="flex items-center justify-between bg-gray-200 rounded-md w-[30%] h-full ">
                <Controller
                  key={`workingTime${workingTime.id}MaxEmployee`}
                  control={control}
                  name={`workingTimes.${i}.maxEmployee`}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <NumButton
                        type="minus"
                        disabled={value <= 1}
                        onClick={() => {
                          if (value <= 1) return
                          if (getValues(`workingTimes.${i}.minEmployee`) === value) {
                            setValue(`workingTimes.${i}.minEmployee`, value - 1)
                          }
                          onChange(value - 1)
                        }}
                      />
                      <p className="text-black">{value}</p>
                      <NumButton type="plus" onClick={() => onChange(value + 1)} />
                    </>
                  )}
                />
              </div>
            </td>

            {/* 翌日休暇 */}
            <td className={"w-[8%] border p-1 flex items-center justify-around min-w-[66px]"}>
              <Controller
                key={`workingTime${workingTime.id}Next`}
                control={control}
                name={`workingTimes.${i}.isNextDayoff`}
                render={({ field: { onChange, value, name } }) => <CheckBox value={name} onChange={onChange} checked={value} />}
              />
            </td>

            {/* 色 */}
            <td className={"w-[7%] border p-1 flex items-center justify-around min-w-[60px]"}>
              <div
                className="flex items-center justify-around p-1 hover:text-[#888] cursor-pointer"
                onClick={() => {
                  setSelectedIndex(i)
                  setOpen(true)
                }}
              >
                <div
                  className="w-6 h-6 border-gray-200 rounded-sm border-2 mr-2"
                  style={{ backgroundColor: getValues(`workingTimes.${i}.color`) }}
                />
                <IoIosArrowDown className="" size={20} />
              </div>
            </td>

            {/* 削除 */}
            <td className={"w-[5%] border p-1 flex items-center justify-around min-w-[40px]"}>
              <FaTrashAlt
                size={20}
                className="text-[#666] hover:text-[#aaa] cursor-pointer"
                onClick={() => {
                  setSelectedIndex(i)
                  setOpenDeleteEmployeeModal(true)
                  setDeleteCategory("workingTime")
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
