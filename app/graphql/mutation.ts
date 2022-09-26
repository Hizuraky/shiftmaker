import { gql } from "@apollo/client"

// ユーザー削除
export const deleteUser = gql`
  mutation deleteUser($uuid: String!) {
    delete_user(where: { uuid: { _eq: $uuid } }) {
      affected_rows
    }
  }
`

// シフト年月 + シフト作成
export const mutationShiftDate = gql`
  mutation insertShiftDate($shiftDate: [shiftDate_insert_input!]!) {
    insert_shiftDate(objects: $shiftDate) {
      returning {
        id
      }
    }
  }
`

// シフト作成
export const mutationShift = gql`
  mutation insertShift($shift: [shift_insert_input!]!) {
    insert_shift(objects: $shift) {
      returning {
        id
      }
    }
  }
`

// シフト編集（削除 + 新規）
export const updateShift = gql`
  mutation updateShift($shift: [shift_insert_input!]!, $shiftId: Int!) {
    delete_shift(where: { id: { _eq: $shiftId } }) {
      affected_rows
    }
    insert_shift(objects: $shift) {
      returning {
        id
      }
    }
  }
`

// シフト削除
export const deleteShift = gql`
  mutation deleteShift($shiftId: Int!) {
    delete_shift(where: { id: { _eq: $shiftId } }) {
      affected_rows
    }
  }
`

// シフト年月削除
export const deleteShiftDate = gql`
  mutation deleteShiftDate($shiftDateId: Int!) {
    delete_shiftDate(where: { id: { _eq: $shiftDateId } }) {
      affected_rows
    }
  }
`

// 従業員 + 勤務時間帯の更新 + 作成 + 削除
export const mutationWorkingTimesAndEmployees = gql`
  mutation upsertWorkingTimes(
    $workingTimes: [workingTime_insert_input!]!
    $employees: [employee_insert_input!]!
    $deleteEmployeeIds: [Int]!
    $deleteWorkingTimeIds: [Int]!
  ) {
    insert_workingTime(
      objects: $workingTimes
      on_conflict: {
        constraint: workingTime_pkey
        update_columns: [timeName, color, startHour, startMinute, endHour, endMinute, isNextDayoff, maxEmployee, minEmployee]
      }
    ) {
      returning {
        color
        isNextDayoff
        maxEmployee
        minEmployee
        timeName
      }
    }
    insert_employee(objects: $employees, on_conflict: { constraint: employee_pkey, update_columns: [userId, name, canWorkingIds] }) {
      returning {
        name
        canWorkingIds
      }
    }
    delete_workingTime(where: { id: { _in: $deleteWorkingTimeIds } }) {
      affected_rows
    }
    delete_employee(where: { id: { _in: $deleteEmployeeIds } }) {
      affected_rows
    }
  }
`
