/***
 * fetchデータのtypes
 */

// 社員マスタ
export type Employee = {
  id?: number
  userId?: string
  name: string
  canWorkingIds: (number | undefined)[]
  isNewEmployee?: boolean
  workIds?: (number | undefined)[]
  __typename?: string
}

// 勤務時間マスタ
export type WorkingTime = {
  id?: number
  userId?: string
  startHour: number | { value: number; label: number | string }
  startMinute: number | { value: number; label: number | string }
  endHour: number | { value: number; label: number | string }
  endMinute: number | { value: number; label: number | string }
  isNextDayoff: boolean
  timeName: string
  minEmployee: number
  maxEmployee: number
  color: string
  isNewWorkingTime?: boolean
  __typename?: string
}

// シフト
export type Shift = {
  id?: number
  shiftDateId?: number
  shiftName?: string
  isCompleted?: boolean
  shiftEmployees?: Employee[]
  shiftWorkingTimes?: WorkingTime[]
  createdAt: string
  updatedAt?: string
  __typename?: string
}

// シフト年月
export type ShiftDate = {
  id?: number
  month: number
  year: number
  userId: string
  shifts: Shift[]
  __typename?: string
}
