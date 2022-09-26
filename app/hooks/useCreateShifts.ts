import { useEffect, useState } from "react"
import { useShiftCreateRecoil } from "app/hooks/useRecoil"
import type { Employee, WorkingTime } from "app/utils/types"

/***
 * シフト作成Hooks
 */

type Props = {
  employees: Employee[]
  setShifts: React.Dispatch<
    React.SetStateAction<
      {
        employee: number | undefined
        workIds: (number | undefined)[]
      }[]
    >
  >
  shifts: {
    employee: number | undefined
    workIds: (number | undefined)[]
  }[]
  workingTimes: WorkingTime[]
  setStep?: React.Dispatch<React.SetStateAction<number>>
  setFilledShifts: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
  date?: { year: number; month: number }
}

export const useCreateShifts = ({ employees, setShifts, shifts, workingTimes, setStep, setFilledShifts, isEdit, date }: Props) => {
  const { recoilShiftDate, setRecoilStep1Shifts, recoilStep1Shifts, setRecoilStep2Shifts, recoilStep2Shifts } = useShiftCreateRecoil()
  const [autoShiftFlag, setAutoShiftFlag] = useState(false)
  const createAutoShift = () => setAutoShiftFlag(true)

  // シフト初期化
  const initializeShift = () => {
    let currentShifts: { employee: number | undefined; workIds: (number | undefined)[] }[] = []
    employees?.forEach((employee) => {
      let employeeShifts: (number | undefined)[] = []
      ;[...Array(new Date(date ? date.year : recoilShiftDate!.year, date ? date.month : recoilShiftDate!.month, 0).getDate())].forEach(
        (_, day) => {
          employeeShifts[day] = undefined
        }
      )
      currentShifts.push({ employee: employee.id, workIds: [...employeeShifts] })
    })
    setShifts([...currentShifts])
    setRecoilStep1Shifts(undefined)
    setRecoilStep2Shifts(undefined)
  }

  // 自動生成部のみリセット
  const resetStep2Shift = () => {
    let newArray: { employee: number | undefined; workIds: (number | undefined)[] }[] = []
    recoilStep1Shifts?.map((employeeShift) => {
      let mutableWorkIds: (number | undefined)[] = []
      employeeShift.workIds.forEach((workId) => {
        mutableWorkIds.push(workId)
      })
      newArray.push({ employee: employeeShift.employee, workIds: mutableWorkIds })
    })
    setShifts([...newArray!])
    setRecoilStep2Shifts(undefined)
  }

  // 手動入力部のみリセット
  const resetStep3Shift = () => {
    let newArray: { employee: number | undefined; workIds: (number | undefined)[] }[] = []
    recoilStep2Shifts?.forEach((employeeShift) => {
      let mutableWorkIds: (number | undefined)[] = []
      employeeShift.workIds?.forEach((workId) => {
        mutableWorkIds.push(workId)
      })
      newArray.push({ employee: employeeShift.employee, workIds: mutableWorkIds })
    })
    setShifts([...newArray!])
  }

  // シフト自動生成
  const autoShift = () => {
    const shuffle = (arrays: any) => {
      const array = arrays.slice()
      for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[randomIndex]] = [array[randomIndex], array[i]]
      }
      return array
    }

    // シフトの集計用連想配列を作成
    let currentShifts = [...shifts]

    // 従業員に勤務日数、indexを追加して集計用連想配列を作成
    let currentEmployee = [
      ...employees.map((employee, i) => {
        return { employee: employee, workNum: 0, employeeIndex: i }
      })
    ]

    // 勤務時間帯に勤務従業員数を追加して集計用連想配列を作成
    let currentWorkingTimes = [
      ...workingTimes.map((workingTime) => {
        return { workingTime: workingTime, employeeNum: 0 }
      })
    ]

    // 既存の入力シフトを集計用に反映する
    employees.forEach((employee) => {
      employee.canWorkingIds.forEach((workingTimeId) => {
        currentWorkingTimes.forEach((workingTime) => workingTime.workingTime.id === workingTimeId && workingTime.employeeNum++)
      })
    })

    // 1日に最低必要な従業員数を算出
    let mustDayEmployee = 0
    workingTimes.forEach((workingTime) => (mustDayEmployee += workingTime.minEmployee))

    // 1週間に2回休日を代入(3日に1回・4日に1回ランダムに休日を設定し、1日の最低従業員数を下回らないようにする)
    currentShifts.forEach((employee, i) => {
      ;[...Array(4)].forEach((_, week) => {
        let isDayoff = 0

        // 手動入力の希望休と休日をカウントする
        for (let ii = week * 7; ii < week * 7 + 7; ii++) {
          if (employee.workIds[ii] === 92 || employee.workIds[ii] === 93) {
            isDayoff++
          }
        }

        // 該当の週で既に2日希望休がある場合は休日を設定しない
        if (isDayoff > 1) return

        let firstDayoff = Math.floor(Math.random() * 3 + week * 7)
        let firstDayoffEmployee = 0
        currentShifts.forEach((currentShiftsEmployee) => currentShiftsEmployee.workIds[firstDayoff] && firstDayoffEmployee++)
        if (
          (employees.length - firstDayoffEmployee > mustDayEmployee || mustDayEmployee >= employees.length) &&
          !currentShifts[i].workIds[firstDayoff]
        ) {
          currentShifts[i].workIds[firstDayoff] = 92
        } else {
          let nextFirstDayoff = firstDayoff % 7 < 2 ? firstDayoff + 1 : firstDayoff - 1
          firstDayoffEmployee = 0
          currentShifts.forEach((currentShiftsEmployee) => currentShiftsEmployee.workIds[nextFirstDayoff] && firstDayoffEmployee++)
          if (
            (employees.length - firstDayoffEmployee > mustDayEmployee || mustDayEmployee >= employees.length) &&
            !currentShifts[i].workIds[nextFirstDayoff]
          ) {
            currentShifts[i].workIds[nextFirstDayoff] = 92
          } else {
            nextFirstDayoff = firstDayoff % 7 === 0 ? 1 : 0
            firstDayoffEmployee = 0
            currentShifts.forEach((currentShiftsEmployee) => currentShiftsEmployee.workIds[nextFirstDayoff] && firstDayoffEmployee++)
            if (
              (employees.length - firstDayoffEmployee > mustDayEmployee || mustDayEmployee >= employees.length) &&
              !currentShifts[i].workIds[firstDayoff]
            ) {
              currentShifts[i].workIds[nextFirstDayoff] = 92
            }
          }
        }

        // 該当の週で既に1日希望休がある場合は2日目の休日を設定しない
        if (isDayoff > 0) return

        let secondDayoff = Math.floor(Math.random() * 4 + 3 + week * 7)
        let secondDayoffEmployee = 0
        currentShifts.forEach((currentShiftsEmployee) => currentShiftsEmployee.workIds[secondDayoff] && secondDayoffEmployee++)
        if (
          (employees.length - secondDayoffEmployee > mustDayEmployee || mustDayEmployee >= employees.length) &&
          !currentShifts[i].workIds[secondDayoff]
        ) {
          currentShifts[i].workIds[secondDayoff] = 92
        } else {
          let nextSecondDayoff = secondDayoff % 7 < 5 ? secondDayoff + 1 : secondDayoff - 1
          secondDayoffEmployee = 0
          currentShifts.forEach((currentShiftsEmployee) => currentShiftsEmployee.workIds[nextSecondDayoff] && secondDayoffEmployee++)
          if (
            (employees.length - secondDayoffEmployee > mustDayEmployee || mustDayEmployee >= employees.length) &&
            !currentShifts[i].workIds[nextSecondDayoff]
          ) {
            currentShifts[i].workIds[nextSecondDayoff] = 92
          } else {
            nextSecondDayoff--
            secondDayoffEmployee = 0
            currentShifts.forEach((currentShiftsEmployee) => currentShiftsEmployee.workIds[nextSecondDayoff] && secondDayoffEmployee++)
            if (
              (employees.length - secondDayoffEmployee > mustDayEmployee || mustDayEmployee >= employees.length) &&
              !currentShifts[i].workIds[nextSecondDayoff]
            ) {
              currentShifts[i].workIds[nextSecondDayoff] = 92
            }
          }
        }
      })
    })

    // 月の最初を起点として1日ずつ判定・代入していく
    ;[...Array(new Date(date ? date.year : recoilShiftDate!.year, date ? date.month : recoilShiftDate!.month, 0).getDate())].forEach(
      (_, day) => {
        // 従業員の出勤日数が少ない順にソートする（出勤日数の偏り防止のため）
        currentEmployee.sort((a, b) => a.workNum - b.workNum)

        // 規則的すぎないようにするため毎回勤務時間配列をシャッフルする
        currentWorkingTimes = shuffle(currentWorkingTimes)

        currentWorkingTimes.forEach(({ workingTime }) => {
          // 各勤務時間帯あたりの勤務従業員を算出
          let employeeNum = 0
          currentShifts?.forEach((employee) => employee.workIds.forEach((v, ii) => ii === day && v === workingTime.id && employeeNum++))

          currentEmployee.forEach((employee) => {
            const setShift = () => {
              currentShifts[employee.employeeIndex].workIds[day] = workingTime.id
              employee.workNum++
              employeeNum++
            }

            if (
              // 該当勤務時間の最低人数を下回っているか
              workingTime.minEmployee > employeeNum &&
              // 該当の従業員が該当の時間帯で勤務可能か
              employee.employee.canWorkingIds.includes(workingTime.id!) &&
              // 該当の従業員がまだシフトを割り当てられていないか
              !currentShifts[employee.employeeIndex].workIds[day]
            ) {
              // 翌日休暇の勤務時間帯(夜勤など)であれば翌日に休暇を同時にセット
              const lastDay =
                day + 1 >= new Date(date ? date.year : recoilShiftDate!.year, date ? date.month : recoilShiftDate!.month, 0).getDate()
              if (workingTime.isNextDayoff) {
                if (!lastDay && !currentShifts[employee.employeeIndex].workIds[day + 1]) {
                  currentShifts[employee.employeeIndex].workIds[day + 1] = 91
                  employee.workNum++
                } else if (!lastDay) {
                  return
                }
              }
              setShift()
            }
          })
        })
      }
    )

    // シフト確定
    setShifts([...currentShifts])
  }

  // 空欄を休暇で埋める処理
  const fillBlankShift = () => {
    let currentShifts = [...shifts]
    currentShifts.forEach((employee) => {
      employee.workIds.forEach((workId, i) => {
        if (!workId) {
          employee.workIds[i] = 92
        }
      })
    })
    setShifts([...currentShifts])
  }

  // STEP2のシフトが残っていればセット、なければSTEP1のシフトがあればセット。なければ初期化。(リロード時など)
  useEffect(() => {
    if (isEdit) return
    if (recoilStep2Shifts) {
      setStep && setStep(3)
      resetStep3Shift()
    } else if (recoilStep1Shifts) {
      setStep && setStep(2)
      resetStep2Shift()
    } else {
      initializeShift()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoilStep1Shifts, recoilStep2Shifts])

  // 自動生成フラグが立っている場合は自動生成関数を処理してフラグをfalseにする
  useEffect(() => {
    if (autoShiftFlag) {
      autoShift()
      setAutoShiftFlag(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoShiftFlag])

  // シフトが全て埋まっているかの確認
  useEffect(() => {
    if (!shifts) {
      return
    }

    let isBlank = false
    shifts.forEach((employee) => {
      employee.workIds.forEach((workId) => {
        if (!workId) {
          setFilledShifts(false)
          isBlank = true
        }
      })
    })
    !isBlank && setFilledShifts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts])

  return { resetStep2Shift, resetStep3Shift, initializeShift, createAutoShift, fillBlankShift }
}
