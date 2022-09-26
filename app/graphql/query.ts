import { gql } from "@apollo/client"

// シフト一覧取得
export const shiftsQuery = gql`
  query shifts {
    shiftDate(order_by: { year: desc, month: desc }) {
      id
      month
      year
      shifts(order_by: { createdAt: asc }) {
        id
        shiftDateId
        shiftName
        isCompleted
        createdAt
        updatedAt
        shiftEmployees {
          id
          name
          canWorkingIds
          workIds
        }
        shiftWorkingTimes {
          id
          timeName
          color
          startHour
          startMinute
          endHour
          endMinute
          isNextDayoff
          maxEmployee
          minEmployee
        }
      }
    }
  }
`

// 選択年月のシフト取得
export const shiftDateQuery = (year: number, month: number, userId?: string) => gql`
  query shifts {
    shiftDate(where: { userId: { _eq: ${userId} },year: { _eq: ${year} } ,month: { _eq: ${month} }  }) {
      id
    }
  }
`

// シフト詳細取得
export const shiftDetailQuery = (shiftId: number) => gql`
    query shiftDetail {
      shift(where: {id: {_eq: ${shiftId}}}){
        id
        shiftDateId
        shiftName
        isCompleted
        createdAt
        updatedAt
        shiftEmployees {
          id
          name
          canWorkingIds
          workIds
        }
        shiftWorkingTimes {
          id
          timeName
          color
          startHour
          startMinute
          endHour
          endMinute
          isNextDayoff
          maxEmployee
          minEmployee
        }
      }      
    }
  `

// 勤務時間帯 + 従業員取得
export const employeesAndWorkingTimesQuery = gql`
  query employeesAndWorkingTimes {
    employee {
      id
      userId
      name
      canWorkingIds
    }
    workingTime {
      color
      isNextDayoff
      id
      maxEmployee
      minEmployee
      startHour
      startMinute
      endHour
      endMinute
      timeName
    }
  }
`
