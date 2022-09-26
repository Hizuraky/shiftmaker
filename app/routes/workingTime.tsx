import toast from "react-hot-toast"
import { useNavigate, useLocation } from "@remix-run/react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, CheckBox, Modal } from "app/components/common"
import { colors, smartphoneColors } from "app/utils/colors"
import { mutationWorkingTimesAndEmployees } from "app/graphql/mutation"
import { useMutation, useQuery } from "app/hooks/useApollo"
import { Spinner } from "app/components/Spinner"
import { employeesAndWorkingTimesQuery } from "app/graphql/query"
import { EmployeeTable } from "~/components/table/employeeTable"
import { WorkingTimeTable } from "app/components/table/workingTimeTable"
import { useGetElementProperty } from "app/hooks/useGetElementProperty"
import { useUserRecoil, useShiftCreateRecoil } from "app/hooks/useRecoil"
import type { WorkingTime, Employee } from "app/utils/types"

/***
 * 勤務時間帯,従業員編集画面
 *
 *  -----------------memo-----------------
 *
 *  従業員編集ボタンもしくはスライダーより遷移
 *    表示 => DBデータ
 *    保存 => DB
 *
 *  シフト作成中遷移
 *    表示 => Recoil なければ DB
 *    保存 => Recoil + (DB)
 *
 *  Recoil
 *    set => シフト作成中 + 当画面で保存時 / 各種確認画面初期表示時 / 一時保存シフトの作成再開時
 *    delete => logout / 作成完了時 / 一時保存時
 *
 *  -----------------memo-----------------
 */

export default function Index() {
  const navigate = useNavigate()
  const navState = useLocation().state as { inCreate: boolean }
  const { recoilUser } = useUserRecoil()
  const [isOpen, setOpen] = useState(false)
  const [isOpenDeleteEmployeeModal, setOpenDeleteEmployeeModal] = useState(false)
  const [isOpenMutationConfirmModal, setOpenMutationConfirmModal] = useState(false)
  const [deleteCategory, setDeleteCategory] = useState<"employee" | "workingTime">("employee")
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const { windowDimensions } = useGetElementProperty<HTMLDivElement>()
  const { data: queryData } = useQuery(employeesAndWorkingTimesQuery)
  const { recoilEmployeeWorkingTime, setRecoilEmployeeWorkingTime } = useShiftCreateRecoil()

  // シフト作成途中 + RecoilにデータがあればRecoil, なければフェッチしたデータをHookFormのデフォルトにする
  const formatQueryData = { workingTimes: queryData?.workingTime, employees: queryData?.employee }
  const data = navState?.inCreate ? recoilEmployeeWorkingTime ?? formatQueryData : formatQueryData

  // 型付け
  const workingTimesData: WorkingTime[] = data?.workingTimes
  const employeesData: Employee[] = data?.employees

  const mutation = useMutation({ mutation: mutationWorkingTimesAndEmployees, successMessage: "入力情報を保存しました", isBackNav: true })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    watch,
    setError,
    clearErrors
  } = useForm({
    defaultValues: { workingTimes: workingTimesData, employees: employeesData }
  })
  const workingTimes = watch("workingTimes")
  const employees = watch("employees")

  // DBのデータを取得完了時にHookFormにセットする
  useEffect(() => {
    !workingTimes && setValue("workingTimes", workingTimesData)
    !employees && setValue("employees", employeesData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryData])

  // Recoilに保存処理
  const setRecoil = () => {
    const deleteWorkingTimeIds = [...workingTimesData.filter((v) => !workingTimes.map((v) => v.id).includes(v.id)).map((v) => v.id)]
    const deleteEmployeeIds = [...employeesData.filter((v) => !employees.map((v) => v.id).includes(v.id)).map((v) => v.id)]
    setRecoilEmployeeWorkingTime({
      workingTimes: [
        ...workingTimes!.map((v) => {
          delete v.__typename
          return {
            ...v,
            userId: recoilUser?.uid
          }
        })
      ],
      employees: [
        ...employees.map((v) => {
          delete v.__typename
          return {
            ...v,
            userId: recoilUser?.uid
          }
        })
      ],
      deleteWorkingTimeIds: recoilEmployeeWorkingTime?.deleteWorkingTimeIds
        ? deleteWorkingTimeIds.concat(recoilEmployeeWorkingTime?.deleteWorkingTimeIds)
        : deleteWorkingTimeIds,
      deleteEmployeeIds: recoilEmployeeWorkingTime?.deleteEmployeeIds
        ? deleteEmployeeIds.concat(recoilEmployeeWorkingTime?.deleteEmployeeIds)
        : deleteEmployeeIds
    })
  }

  // テンプレとして保存 -> setRecoil + mutation / 今回だけ使用 -> setRecoil
  const submitWorkingTimes = () => {
    setOpenMutationConfirmModal(false)
    const deleteWorkingTimeIds = [...workingTimesData.filter((v) => !workingTimes.map((v) => v.id).includes(v.id)).map((v) => v.id)]
    const deleteEmployeeIds = [...employeesData.filter((v) => !employees.map((v) => v.id).includes(v.id)).map((v) => v.id)]
    navState?.inCreate && setRecoil()
    mutation({
      variables: {
        workingTimes: [
          ...workingTimes!.map((v) => {
            delete v.__typename
            return {
              ...v,
              userId: recoilUser?.uid
            }
          })
        ],
        employees: [
          ...employees.map((employee) => {
            return {
              userId: recoilUser?.uid,
              id: employee.id,
              name: employee.name,
              canWorkingIds: ((array) => `{${array.join(",")}}`)(employee.canWorkingIds)
            }
          })
        ],
        deleteWorkingTimeIds: recoilEmployeeWorkingTime?.deleteWorkingTimeIds
          ? deleteEmployeeIds.concat(recoilEmployeeWorkingTime?.deleteWorkingTimeIds)
          : deleteWorkingTimeIds,
        deleteEmployeeIds: recoilEmployeeWorkingTime?.deleteEmployeeIds
          ? deleteEmployeeIds.concat(recoilEmployeeWorkingTime?.deleteEmployeeIds)
          : deleteEmployeeIds
      }
    })
  }

  // 勤務時間帯追加
  const addWorkingTime = () => {
    setValue("workingTimes", [
      ...getValues("workingTimes"),
      {
        id: workingTimes.length > 0 ? Number(workingTimes[workingTimes.length - 1]?.id) + 1 : 1,
        timeName: `勤務時間${workingTimes.length > 0 ? Number(workingTimes[workingTimes.length - 1]?.id) + 1 : 1}`,
        color: "",
        startHour: 9,
        startMinute: 0,
        endHour: 18,
        endMinute: 0,
        isNextDayoff: false,
        maxEmployee: 1,
        minEmployee: 1
      }
    ])
  }

  // 勤務時間帯削除
  const deleteWorkingTime = () => {
    setValue("employees", [
      ...employees.map((employee) => {
        return {
          ...employee,
          canWorkingIds: [...employee.canWorkingIds.filter((workId) => workId !== workingTimes[selectedIndex].id)]
        }
      })
    ])
    setValue("workingTimes", [...workingTimes!.filter((_, i: any) => selectedIndex !== i)])
    setOpenDeleteEmployeeModal(false)
  }

  // 従業員追加
  const addEmployee = () => {
    setValue("employees", [
      ...getValues("employees"),
      {
        id: employees.length > 0 ? Number(employees[employees.length - 1]?.id) + 1 : 1,
        name: "",
        canWorkingIds: [],
        isNewEmployee: true
      }
    ])
  }
  // 従業員削除
  const deleteEmployee = () => {
    setValue("employees", [...employees.filter((_, i: any) => selectedIndex !== i)])
    setOpenDeleteEmployeeModal(false)
  }

  // 従業員と勤務時間帯がない場合（新規ユーザー）はそれぞれ追加する
  useEffect(() => {
    employees?.length === 0 && addEmployee()
    workingTimes?.length === 0 && addWorkingTime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, workingTimes])

  return (
    <div>
      <Spinner isLoad={!queryData} />
      <h1 className="mb-1 font-semibold text-lg">勤務時間帯</h1>
      <h2 className="my-2">下記の表に必要情報を入力してください。</h2>
      <WorkingTimeTable
        setOpenDeleteEmployeeModal={setOpenDeleteEmployeeModal}
        setSelectedIndex={setSelectedIndex}
        setOpen={setOpen}
        employees={employees}
        register={register}
        errors={errors}
        workingTimes={workingTimes}
        control={control}
        setValue={setValue}
        getValues={getValues}
        setDeleteCategory={setDeleteCategory}
        setError={setError}
        clearErrors={clearErrors}
      />
      <div className="mt-2" />
      <Button
        text="+ 追加"
        onClick={addWorkingTime}
        color="secondary-light"
        disabled={workingTimes && workingTimes?.length > 50}
        width="sm"
      />
      <h1 className="mb-1 font-semibold text-lg mt-10">従業員</h1>
      <h2 className="my-2">下記の表に必要情報を入力してください。</h2>
      <EmployeeTable
        setOpenDeleteEmployeeModal={setOpenDeleteEmployeeModal}
        setSelectedIndex={setSelectedIndex}
        employees={employees}
        register={register}
        errors={errors}
        workingTimes={workingTimes}
        control={control}
        setDeleteCategory={setDeleteCategory}
      />
      <div className="mt-2" />
      <Button text="+ 追加" onClick={addEmployee} color="secondary-light" disabled={employees?.length > 50} width="sm" />
      <div className="w-full flex justify-between mt-4">
        <Button text="戻る" variant="outlined" onClick={() => navigate(-1)} />
        <Button
          text="完了"
          onClick={handleSubmit(navState?.inCreate ? () => setOpenMutationConfirmModal(true) : submitWorkingTimes)}
          disabled={Object.keys(errors).length > 0}
        />
      </div>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <div className="flex flex-col items-center">
          <h1 className="text-black flex items-baseline mb-2">
            <p className="text-lg font-bold mr-1">{getValues(`workingTimes.${selectedIndex}.timeName`) ?? "選択した勤務時間"}</p>
            の色を選択してください。
          </h1>
          <CheckBox
            onChange={() => {
              setValue(`workingTimes.${selectedIndex}.color`, "")
              setOpen(false)
            }}
            checked={watch(`workingTimes.${selectedIndex}.color`) === ""}
            label="背景色なし"
            className="mb-2"
          />
          {windowDimensions?.width >= 640 ? (
            <div className="flex">
              {colors.map((v, i) => (
                <div key={i}>
                  {v.map((vv) => (
                    <div
                      className="w-10 h-10 border-[#444]"
                      key={vv}
                      style={{ backgroundColor: vv, borderWidth: getValues(`workingTimes.${selectedIndex}.color`) === vv ? "2px" : 0 }}
                      onClick={() => {
                        setValue(`workingTimes.${selectedIndex}.color`, vv)
                        setOpen(false)
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="">
              {smartphoneColors.map((colors, key) => (
                <div className="flex" key={key}>
                  {colors.map((v, i) => (
                    <div key={i}>
                      {v.map((vv) => (
                        <div
                          className="w-10 h-10 border-[#444]"
                          key={vv}
                          style={{ backgroundColor: vv, borderWidth: getValues(`workingTimes.${selectedIndex}.color`) === vv ? "2px" : 0 }}
                          onClick={() => {
                            setValue(`workingTimes.${selectedIndex}.color`, vv)
                            setOpen(false)
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <p className="my-2">色を設定するとシフト作成で該当の勤務時間を選択した際に背景色として適用されます。</p>
        </div>
      </Modal>
      <Modal isOpen={isOpenDeleteEmployeeModal} setOpen={setOpenDeleteEmployeeModal}>
        <div className="flex flex-col items-center">
          <h1 className="text-black flex items-baseline mb-4">
            <p className="text-lg font-bold mr-1">
              {deleteCategory === "employee"
                ? getValues(`employees.${selectedIndex}.name`) === ""
                  ? "選択した従業員"
                  : getValues(`employees.${selectedIndex}.name`)
                : deleteCategory === "workingTime" &&
                  (getValues(`workingTimes.${selectedIndex}.timeName`) === ""
                    ? "選択した勤務時間"
                    : getValues(`workingTimes.${selectedIndex}.timeName`))}
            </p>
            を削除しますか？
          </h1>
          <Button text="削除" color="secondary" onClick={deleteCategory === "employee" ? deleteEmployee : deleteWorkingTime} />
        </div>
      </Modal>
      <Modal isOpen={isOpenMutationConfirmModal} setOpen={setOpenMutationConfirmModal}>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold mb-4">今回入力した内容を次回以降作成シフトでも利用できるように保存しますか？</h1>
          <div className="flex w-full justify-around">
            <Button
              text="今回だけ使用"
              color="secondary"
              onClick={() => {
                toast.success("入力を反映しました。")
                navigate(-1)
                setRecoil()
              }}
              variant="outlined"
              customWidth="140px"
            />
            <Button text="次回以降でも使用" color="secondary" onClick={submitWorkingTimes} customWidth="140px" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
