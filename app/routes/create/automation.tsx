import { useOutletContext, useLocation } from "@remix-run/react"
import { useState, useEffect } from "react"
import { ShiftsTable } from "app/components/table/ShiftsTable"
import { useShiftCreateRecoil } from "app/hooks/useRecoil"
import { useCreateShifts } from "app/hooks/useCreateShifts"
import { Button, Input, Modal, Accordion } from "app/components/common"
import { TableSizeButtons } from "app/components/TableSizeButtons"
import { useMutationShift } from "app/hooks/useMutationShift"
import { useForm } from "react-hook-form"
import { useConfirm } from "app/hooks/useConfirm"
import type { Shift } from "app/utils/types"

/***
 * シフト作成 > 自動生成画面
 */

type Props = {
  shifts: { employee: number | undefined; workIds: (number | undefined)[] }[]
  setShifts: React.Dispatch<
    React.SetStateAction<
      {
        employee: number | undefined
        workIds: (number | undefined)[]
      }[]
    >
  >
}

export default function Index() {
  const { recoilEmployeeWorkingTime, recoilShiftDate, setRecoilStep1Shifts, setRecoilStep2Shifts, recoilCreateShiftId } =
    useShiftCreateRecoil()
  const navState = useLocation().state as { shifts: Shift[]; isTemporarily: boolean }
  const { shifts, setShifts } = useOutletContext<Props>()
  const [tableSize, setTableSize] = useState(new Date(recoilShiftDate?.year ?? 2000, recoilShiftDate?.month ?? 1, 0).getDate())
  const [step, setStep] = useState(1)
  const [isOpen, setOpen] = useState(false)
  const [isFilledShifts, setFilledShifts] = useState(false)
  const [updateFlag, setUpdateFlag] = useState(false)
  const [resetFlag, setResetFlag] = useState(false)
  const { resetStep2Shift, resetStep3Shift, initializeShift, createAutoShift, fillBlankShift } = useCreateShifts({
    employees: recoilEmployeeWorkingTime?.employees!,
    workingTimes: recoilEmployeeWorkingTime?.workingTimes!,
    shifts: shifts,
    setShifts: setShifts,
    setStep: setStep,
    setFilledShifts: setFilledShifts
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()
  useConfirm()

  // 一時保存のReadOnlyシフトをコピー
  useEffect(() => {
    if (navState?.shifts) {
      let currentShift: any = []
      navState.shifts.forEach((shift: any) => {
        currentShift.push({
          employee: shift?.employee,
          workIds: [...shift?.workIds?.map((id: number) => (id === 0 ? undefined : id))]
        })
      })
      setShifts([...currentShift])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState])

  // シフト保存処理
  const mutationShift = useMutationShift({
    shifts: shifts,
    shiftInfo: {
      isCompleted: true,
      shiftName: watch("shiftName"),
      isFirstDateShift: !recoilCreateShiftId?.shiftDateId,
      isEdit: navState?.shifts ? true : false,
      isTemporarily: navState?.isTemporarily,
      updatedAt: null
    }
  })

  // 操作手順テキストコンポーネント
  const ExplanationTexts = () => {
    const texts = [
      "STEP1: \n「有給・希望休」や確定しているシフトを手動入力し、「次へ」ボタンをクリックしてください。\n 「一括リセット」ボタンを押すとSTEP1で入力したシフトがリセットされます。",
      "STEP2: \n 自動生成をクリックしてください。自動生成はランダムなためリセット⇄自動生成で別パターンのシフトが生成されます。 \n 自動生成したシフトを確認し問題なければ「次へ」ボタンを押してください。",
      "STEP3: \n シフトを手動で調整し、完了したら「作成完了」ボタンをクリックしてください。\n 「空欄休暇埋め」をクリックすると未入力の欄に「休」が選択されます。\n 「リセット」ボタンをクリックするとSTEP3で入力したシフトのみがリセットされます。"
    ]
    return (
      <div className="flex flex-col ml-4 mb-3 sm:ml-0">
        {texts.map((text, i) => (
          <div key={i} className={`my-2 ${i + 1 === step ? "text-primary-text font-bold" : "text-[#888]"}`}>
            {text.split("\n").map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        ))}
      </div>
    )
  }

  const backSTEP1 = () => {
    resetStep2Shift()
    setStep(1)
    setOpen(false)
    let empty = true
    shifts.forEach((employee) => employee.workIds.forEach((v) => v && (empty = false)))
    !empty && setUpdateFlag(true)
  }
  const backSTEP2 = () => {
    resetStep3Shift()
    setStep(2)
    setOpen(false)
    let empty = true
    shifts.forEach((employee) => employee.workIds.forEach((v) => v && (empty = false)))
    !empty && setUpdateFlag(true)
  }
  const goSTEP2 = () => {
    setRecoilStep1Shifts([...shifts])
    setStep(2)
    setUpdateFlag(false)
  }
  const goSTEP3 = () => {
    setRecoilStep2Shifts([...shifts])
    setStep(3)
    setUpdateFlag(false)
  }
  const onAutoShift = async () => {
    await resetStep2Shift()
    createAutoShift()
    setUpdateFlag(true)
  }
  const resetStep3 = () => {
    resetStep3Shift()
    setOpen(false)
    setResetFlag(false)
    setUpdateFlag(false)
  }
  const openResetStep3Modal = () => {
    setResetFlag(true)
    setOpen(true)
  }

  const StepModal = () => {
    const handleOK = () => {
      if (step === 1) {
        initializeShift()
        setOpen(false)
      } else if (step === 2) {
        backSTEP1()
      } else if (step === 3) {
        resetFlag ? resetStep3() : backSTEP2()
      }
    }

    !updateFlag && isOpen && handleOK()

    return (
      <Modal isOpen={isOpen} setOpen={setOpen}>
        {step === 1 && (
          <>
            <h1 className="text-base font-bold">手動入力したシフトが全てリセットされますがよろしいでしょうか？</h1>
            <div className="w-full flex justify-center mt-4">
              <Button text="OK" onClick={handleOK} variant="outlined" />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-base font-bold">STEP1へ戻ると自動生成がリセットされますがよろしいでしょうか？</h1>
            <div className="w-full flex justify-center mt-4">
              <Button text="OK" onClick={handleOK} variant="outlined" />
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-base font-bold">
              {!resetFlag && "STEP2へ戻ると"}STEP3で手動入力したシフトがリセットされますがよろしいでしょうか？
            </h1>
            <div className="w-full flex justify-center mt-4">
              <Button text="OK" onClick={handleOK} variant="outlined" />
            </div>
          </>
        )}
      </Modal>
    )
  }

  const StepButtons = () => {
    type Props = { width: "sm"; variant?: "outlined"; textSize: "text-xs"; text: string; color?: "secondary-light" | "primary" }
    const olProps: Props = { width: "sm", variant: "outlined", textSize: "text-xs", text: "<　戻る", color: "secondary-light" }
    const ctProps: Props = { width: "sm", textSize: "text-xs", text: "次へ　>", color: "secondary-light" }

    if (step === 1) {
      return (
        <div className="flex items-center">
          <Button {...olProps} onClick={() => setOpen(true)} text="一括リセット" color="primary" width="md" />
          <div className="mr-4" />
          <Button {...olProps} disabled />
          <div className="mr-4" />
          <Button {...ctProps} onClick={goSTEP2} />
        </div>
      )
    }
    if (step === 2) {
      return (
        <div className="flex items-center">
          <Button {...ctProps} onClick={onAutoShift} text="自動生成" color="primary" />
          <div className="mr-4" />
          <Button {...olProps} onClick={() => setOpen(true)} />
          <div className="mr-4" />
          <Button {...ctProps} onClick={goSTEP3} />
        </div>
      )
    }
    if (step === 3) {
      return (
        <div className="flex items-center">
          <Button {...ctProps} onClick={fillBlankShift} text="空欄休暇埋め" color="primary" disabled={isFilledShifts} width="md" />
          <div className="mr-4" />
          <Button {...olProps} onClick={openResetStep3Modal} color="primary" text="リセット" />
          <div className="mr-4" />
          <Button {...olProps} onClick={() => setOpen(true)} color="secondary-light" />
          <div className="mr-4" />
          <Button {...ctProps} onClick={handleSubmit(mutationShift)} text="作成完了" disabled={!isFilledShifts} />
        </div>
      )
    }
    return <></>
  }

  return (
    <div>
      <Accordion label="操作手順">
        <ExplanationTexts />
      </Accordion>

      <div className="flex items-center border border-gray-300 rounded-sm max-w-[800px] mt-2">
        <div className="w-1/3 bg-primary-pale h-8 flex items-center justify-center">シフト名</div>
        <div className="w-2/3">
          <Input label="シフト名" register={register} schema="shiftName" required />
        </div>
      </div>
      <p className="text-xs text-[#ff3535]">{errors?.shiftName?.message}</p>
      <div className="mb-2" />
      {shifts.length > 0 && recoilEmployeeWorkingTime && recoilShiftDate && (
        <>
          <div className="p-2 rounded-md shadow-md border sm:max-h-screen">
            <div className="flex items-center w-full justify-between mb-4">
              <div className="sm:hidden">
                <TableSizeButtons tableSize={tableSize} setTableSize={setTableSize} date={recoilShiftDate!} />
              </div>
              <StepButtons />
            </div>
            <ShiftsTable
              tableSize={tableSize}
              shifts={shifts}
              setShifts={setShifts}
              employees={recoilEmployeeWorkingTime?.employees}
              workingTimes={recoilEmployeeWorkingTime?.workingTimes}
              disabled={step === 2}
              setUpdateFlag={setUpdateFlag}
            />
          </div>
          <StepModal />
        </>
      )}
    </div>
  )
}
