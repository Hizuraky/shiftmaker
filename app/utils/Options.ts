// 選択フォームの選択肢

export const set5YearOptions = () =>
  [...Array(5)].map((_, i) => ({
    value: new Date().getFullYear() + 1 - i,
    label: `${new Date().getFullYear() + 1 - i}年`
  }))

export const set3YearOptions = () =>
  [...Array(3)].map((_, i) => ({
    value: new Date().getFullYear() + 1 - i,
    label: `${new Date().getFullYear() + 1 - i}年`
  }))

export const setMonthOptions = () =>
  [...Array(12)].map((_, i) => ({
    value: i + 1,
    label: `${i + 1}月`
  }))

export const setStartHoursOptions = () =>
  [...Array(24)].map((_, i) => ({
    value: i,
    label: i
  }))
export const setFinishHoursOptions = () =>
  [...Array(41)].map((_, i) => ({
    value: i,
    label: i
  }))
export const setMinutesOptions = () =>
  [...Array(60)].map((_, i) => ({
    value: i,
    label: i < 10 ? `0${i}` : i
  }))
