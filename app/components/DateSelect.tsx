import Select from "react-select"
import { setMonthOptions, set3YearOptions } from "app/utils/Options"

/***
 * 年月選択フォームコンポーネント
 */

type Props = {
  selectedYear: number
  setYear: React.Dispatch<React.SetStateAction<number>>
  selectedMonth: number
  setMonth: React.Dispatch<React.SetStateAction<number>>
}

export const DateSelect = ({ selectedYear, setYear, selectedMonth, setMonth }: Props) => (
  <div className="flex items-center w-full justify-between sm:flex-col sm:items-start">
    <div className="flex w-[45%] sm:w-full rounded-sm border  h-[40px] border-[#999] sm:mb-4">
      <div className="w-[40%]  justify-center flex bg-primary-pale h-[38px] items-center border-r border-[#999]">年</div>
      <div className="w-[60%] flex justify-center pl-4">
        <Select
          instanceId="select"
          value={{ value: selectedYear, label: `${selectedYear}年` }}
          onChange={(e) => setYear && setYear(e!.value)}
          options={set3YearOptions()}
          styles={{
            container: (base: any) => ({ ...base, border: 0, padding: 0 }),
            control: (base: any) => ({ ...base, border: 0, padding: 0, boxShadow: "none" }),
            valueContainer: (base: any) => ({ ...base, border: 0, padding: 0, width: "5em" }),
            menu: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999, fontSize: "12px" }),
            menuPortal: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999 })
          }}
          isSearchable={false}
          menuPortalTarget={typeof window === "object" ? document?.body : undefined}
        />
      </div>
    </div>

    <div className="flex w-[45%] sm:w-full rounded-sm border h-[40px] border-[#999]">
      <div className="w-[40%]  justify-center flex bg-primary-pale h-[38px] items-center border-r border-[#999]">月</div>
      <div className="w-[60%] flex justify-center pl-4">
        <Select
          instanceId="select"
          value={{ value: selectedMonth, label: `${selectedMonth}月` }}
          onChange={(e) => setMonth && setMonth(e!.value)}
          options={setMonthOptions()}
          styles={{
            container: (base: any) => ({ ...base, border: 0, padding: 0 }),
            control: (base: any) => ({ ...base, border: 0, padding: 0, boxShadow: "none" }),
            valueContainer: (base: any) => ({ ...base, border: 0, padding: 0, width: "5em" }),
            menu: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999, fontSize: "12px" }),
            menuPortal: (base: any) => ({ ...base, width: `100px`, margin: 0, zIndex: 9999 })
          }}
          isSearchable={false}
          menuPortalTarget={typeof window === "object" ? document?.body : undefined}
        />
      </div>
    </div>
  </div>
)
