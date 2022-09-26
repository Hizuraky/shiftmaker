import type { Employee, WorkingTime } from "app/utils/types"

export const workingTimesData: WorkingTime[] = [
  {
    id: 1,
    timeName: "早1",
    startHour: 9,
    startMinute: 0,
    endHour: 15,
    endMinute: 0,
    isNextDayoff: false,
    minEmployee: 1,
    maxEmployee: 1,
    color: "#d3fff5"
  },
  {
    id: 2,
    timeName: "早2",
    startHour: 9,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    isNextDayoff: false,
    minEmployee: 1,
    maxEmployee: 1,
    color: "#d3ffdf"
  },
  {
    id: 3,
    timeName: "日勤",
    startHour: 9,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
    isNextDayoff: false,
    minEmployee: 2,
    maxEmployee: 3,
    color: "#d3ffdf"
  },
  {
    id: 4,
    timeName: "遅1",
    startHour: 10,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    isNextDayoff: false,
    minEmployee: 1,
    maxEmployee: 1,
    color: "#fff3d3"
  },
  {
    id: 5,
    timeName: "遅2",
    startHour: 11,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    isNextDayoff: false,
    minEmployee: 1,
    maxEmployee: 1,
    color: "#d3e1ff"
  },
  {
    id: 6,
    timeName: "夜勤",
    startHour: 16,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    isNextDayoff: true,
    minEmployee: 1,
    maxEmployee: 1,
    color: "#ffd3f6"
  }
]

export const employeesData: Employee[] = [
  { id: 1, name: "従業員　1郎", canWorkingIds: [1, 2, 3] },
  { id: 2, name: "従業員　2郎", canWorkingIds: [2, 3] },
  { id: 3, name: "従業員　3郎", canWorkingIds: [1, 2] },
  { id: 4, name: "従業員　4郎", canWorkingIds: [2, 3, 4, 5, 6] },
  { id: 5, name: "従業員　5郎", canWorkingIds: [4, 5, 6] },
  { id: 6, name: "従業員　6郎", canWorkingIds: [4, 5, 6] },
  { id: 7, name: "従業員　7郎", canWorkingIds: [2, 3, 4] },
  { id: 8, name: "従業員　8郎", canWorkingIds: [1, 2, 3, 4] },
  { id: 9, name: "従業員　9郎", canWorkingIds: [4, 5, 6] }
]
