import { useRecoilState } from "recoil"
import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"
import type { WorkingTime, Employee } from "app/utils/types"

const { persistAtom } = recoilPersist()

/***
 * シフト作成 ~ 完了/中断までのデータを保持
 *  recoilStep1Shifts -> 自動生成画面STEP1のシフト
 *  recoilStep2Shifts -> 自動生成画面STEP2のシフト
 *  recoilCreateShiftId -> 作成中シフトのshiftDateId
 *  recoilNotCompleted -> 未保存フラグ（タブナビゲーションで遷移した際に未保存があれば立てる)
 *  recoilCreateState -> シフト作成画面で開いている画面のnavigationState(タブナビゲーションで遷移した際に保持)
 *  recoilEmployeeWorkingTime -> シフト作成時の従業員・勤務時間情報
 *  recoilShiftDate -> 作成シフトの年月
 */
export const useShiftCreateRecoil = () => {
  type shiftsProps = {
    employee: number | undefined
    workIds: (number | undefined)[]
    canWorkingIds?: (number | undefined)[]
  }[]
  const [recoilStep1Shifts, setRecoilStep1Shifts] = useRecoilState(
    atom<shiftsProps | undefined>({
      key: "useStep1ShiftRecoil",
      default: undefined,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const [recoilStep2Shifts, setRecoilStep2Shifts] = useRecoilState(
    atom<shiftsProps | undefined>({
      key: "useStep2ShiftRecoil",
      default: undefined,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const [recoilCreateShiftId, setRecoilCreateUpdateId] = useRecoilState(
    atom<{ shiftDateId?: number; shiftId?: number } | undefined>({
      key: "updateCreateShiftRecoil",
      default: undefined,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const [recoilNotCompleted, setRecoilNotCompleted] = useRecoilState(
    atom<boolean>({
      key: "useCompletedRecoil",
      default: false,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const [recoilCreateState, setRecoilCreateState] = useRecoilState(
    atom<any>({
      key: "useCreateStateRecoil",
      default: false,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const [recoilEmployeeWorkingTime, setRecoilEmployeeWorkingTime] = useRecoilState(
    atom<
      | {
          employees: Employee[]
          workingTimes: WorkingTime[]
          deleteEmployeeIds?: (number | undefined)[]
          deleteWorkingTimeIds?: (number | undefined)[]
        }
      | undefined
    >({
      key: "data",
      default: undefined,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const [recoilShiftDate, setRecoilShiftDate] = useRecoilState(
    atom<
      | {
          year: number
          month: number
        }
      | undefined
    >({
      key: "date",
      default: undefined,
      effects_UNSTABLE: [persistAtom]
    })
  )
  const resetShifts = () => {
    setRecoilStep1Shifts(undefined)
    setRecoilStep2Shifts(undefined)
  }
  const resetCreate = () => {
    setRecoilStep1Shifts(undefined)
    setRecoilStep2Shifts(undefined)
    setRecoilCreateUpdateId(undefined)
    setRecoilNotCompleted(false)
    setRecoilEmployeeWorkingTime(undefined)
    setRecoilCreateState(undefined)
    setRecoilShiftDate(undefined)
  }
  return {
    recoilStep1Shifts,
    setRecoilStep1Shifts,
    recoilStep2Shifts,
    setRecoilStep2Shifts,
    recoilCreateShiftId,
    setRecoilCreateUpdateId,
    recoilNotCompleted,
    setRecoilNotCompleted,
    recoilCreateState,
    setRecoilCreateState,
    recoilEmployeeWorkingTime,
    setRecoilEmployeeWorkingTime,
    recoilShiftDate,
    setRecoilShiftDate,
    resetShifts,
    resetCreate
  }
}

// シフト編集ID
export const useShiftEditRecoil = () => {
  const [recoilEditShiftId, setRecoilEditUpdateId] = useRecoilState(
    atom<{ shiftDateId?: number; shiftId?: number } | undefined>({
      key: "updateEditShiftRecoil",
      default: undefined,
      effects_UNSTABLE: [persistAtom]
    })
  )
  return { recoilEditShiftId, setRecoilEditUpdateId }
}

// Loading状態
export const useLoadRecoil = () => {
  const [recoilIsLoad, setRecoilLoad] = useRecoilState(
    atom<boolean>({
      key: "useLoadRecoil",
      default: false
    })
  )
  return { recoilIsLoad, setRecoilLoad }
}

// ユーザー情報
export const useUserRecoil = () => {
  const [recoilUser, setRecoilUser] = useRecoilState(
    atom<{ uid: string; name: string | null; email: string | null; createdAt?: string } | undefined>({
      key: "useUserRecoil",
      default: undefined
    })
  )
  return { recoilUser, setRecoilUser }
}

// GraphQL error
export const useGQLErrorRecoil = () => {
  const [recoilGQLerror, setRecoilGQLError] = useRecoilState(
    atom<string | undefined>({
      key: "useGQLErrorRecoil",
      default: undefined
    })
  )
  return { recoilGQLerror, setRecoilGQLError }
}
