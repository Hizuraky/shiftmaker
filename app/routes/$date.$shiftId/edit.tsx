import { useParams, useLocation } from "@remix-run/react"
import { useState, useEffect } from "react"
import { ShiftsTable } from "app/components/table/ShiftsTable"
import { Title } from "app/components/Title"
import { Button, Input, Modal } from "app/components/common"
import { PartSpinner } from "app/components/Spinner"
import { useForm } from "react-hook-form"
import { useMutationShift } from "app/hooks/useMutationShift"
import { useCreateShifts } from "app/hooks/useCreateShifts"
import { TableSizeButtons } from "app/components/TableSizeButtons"
import { useShiftEditRecoil } from "app/hooks/useRecoil"
import type { Shift } from "app/utils/types"

/***
 * シフト編集画面
 */

export default function Index() {
  const navState = useLocation().state as { shift: Shift; isCopy?: boolean }
  const { date, shiftId } = useParams()
  const [tableSize, setTableSize] = useState(new Date(Number(date?.split(".")[0]), Number(date?.split(".")[1]), 0).getDate())
  const [isResetModalOpen, setResetModalOpen] = useState(false)
  const [isAutoModalOpen, setAutoModalOpen] = useState(false)
  const [isFilledShifts, setFilledShifts] = useState(false)
  const { setRecoilEditUpdateId } = useShiftEditRecoil()

  const year = Number(date?.split(".")[0])
  const month = Number(date?.split(".")[1])

  const [shifts, setShifts] = useState<{ employee: number | undefined; workIds: (number | undefined)[] }[]>([])

  useEffect(() => {
    setRecoilEditUpdateId({ shiftDateId: navState?.shift.shiftDateId, shiftId: navState?.shift.id })
    shifts.length === 0 &&
      setShifts(
        navState?.shift.shiftEmployees!.map((employee) => {
          return { employee: employee.id, workIds: [...employee.workIds!.map((v: any) => Number(v))] }
        })
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState])

  const { initializeShift, createAutoShift, fillBlankShift } = useCreateShifts({
    employees: navState?.shift.shiftEmployees!,
    setShifts: setShifts,
    shifts: shifts!,
    workingTimes: navState?.shift.shiftWorkingTimes!,
    setFilledShifts: setFilledShifts,
    isEdit: true,
    date: { year: year, month: month }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: { shiftName: navState?.shift.shiftName! }
  })

  const mutationShift = useMutationShift({
    shifts: shifts,
    employees: navState?.shift.shiftEmployees,
    workingTimes: navState?.shift.shiftWorkingTimes,
    shiftInfo: {
      isCompleted: true,
      isEdit: !navState?.isCopy,
      shiftName: watch("shiftName"),
      createdAt: navState?.isCopy ? new Date() : navState?.shift.createdAt!,
      updatedAt: new Date()
    }
  })

  const onAutoShift = async () => {
    await initializeShift()
    createAutoShift()
    setAutoModalOpen(false)
  }

  const resetShift = () => {
    initializeShift()
    setResetModalOpen(false)
  }

  type Props = { width: "sm"; variant?: "outlined"; textSize: "text-xs"; text: string; color?: "secondary-light" | "primary" }
  const olProps: Props = { width: "sm", variant: "outlined", textSize: "text-xs", text: "<　戻る", color: "secondary-light" }
  const ctProps: Props = { width: "sm", textSize: "text-xs", text: "次へ　>", color: "secondary-light" }

  return (
    <>
      <Title
        currentText={navState?.isCopy ? "複製編集" : "編集"}
        previous={[
          { text: "作成シフト一覧", rootPath: "/shift" },
          { text: `${year}年${month}月`, rootPath: `/shift/${date}` },
          { text: navState?.shift.shiftName!, rootPath: `/${date}/${shiftId}/show`, state: { shift: navState?.shift } }
        ]}
      />
      <div className="flex items-center border border-gray-300 rounded-sm max-w-[800px] mb-2">
        <div className="w-1/3 bg-primary-pale h-8 flex items-center justify-center">シフト名</div>
        <div className="w-2/3">
          <Input label="シフト名" register={register} schema="shiftName" required />
        </div>
      </div>
      <p className="text-xs text-[#ff3535]">{errors?.shiftName?.message}</p>
      <PartSpinner isLoad={shifts?.length === 0}>
        <div className="p-2 rounded-md shadow-md border">
          <div className="flex items-center w-full justify-between mb-2">
            <div className="sm:hidden">
              <TableSizeButtons tableSize={tableSize} setTableSize={setTableSize} date={{ year: year, month: month }} />
            </div>
            <div>
              <div className="flex items-center">
                <Button {...olProps} onClick={() => setResetModalOpen(true)} text="リセット" color="primary" />
                <div className="mr-4 sm:mr-2" />
                <Button {...ctProps} onClick={() => setAutoModalOpen(true)} text="自動生成" color="primary" />
                <div className="mr-4 sm:mr-2" />
                <Button {...ctProps} onClick={fillBlankShift} text="空欄休暇埋め" color="primary" disabled={isFilledShifts} width="md" />
                <div className="mr-4 sm:mr-2" />
                <Button {...ctProps} onClick={handleSubmit(mutationShift)} text="編集確定" disabled={!isFilledShifts} />
              </div>
            </div>
          </div>
          <ShiftsTable
            tableSize={tableSize}
            shifts={shifts}
            setShifts={setShifts}
            employees={navState?.shift.shiftEmployees}
            workingTimes={navState?.shift.shiftWorkingTimes}
            isEdit
          />
        </div>
      </PartSpinner>
      <Modal isOpen={isResetModalOpen} setOpen={setResetModalOpen}>
        <div className="flex flex-col">
          <h1 className="text-base font-bold">入力されているシフトをリセットしますか？</h1>
          <div className="w-full flex justify-center mt-4">
            <Button text="OK" onClick={resetShift} variant="outlined" />
          </div>
        </div>
      </Modal>
      <Modal isOpen={isAutoModalOpen} setOpen={setAutoModalOpen}>
        <div className="flex flex-col">
          <h1 className="text-base font-bold">自動生成するとシフトが全てリセットされますがよろしいでしょうか？</h1>
          <h1 className="text-sm ml-1">※「編集確定」を押さない限り既存のシフトが更新されることはありません</h1>
          <div className="w-full flex justify-center mt-4">
            <Button text="OK" onClick={onAutoShift} variant="outlined" />
          </div>
        </div>
      </Modal>
    </>
  )
}
