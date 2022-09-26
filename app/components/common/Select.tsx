import type { ActionMeta, OptionsOrGroups, GroupBase } from "react-select"
import ReactSelect from "react-select"

/***
 * 共通選択フォーム
 */

type Props = {
  value: any
  onChange: (newValue: any, actionMeta: ActionMeta<any>) => void
  options: OptionsOrGroups<any, GroupBase<any>>
}

export const Select = ({ value, onChange, options }: Props) => (
  <ReactSelect
    instanceId="select"
    value={value}
    onChange={onChange}
    options={options}
    styles={{
      container: (base: any) => ({ ...base, padding: 0, width: "100%" }),
      control: (base: any) => ({ ...base, padding: 0 }),
      valueContainer: (base: any) => ({ ...base, border: 0, padding: 0, width: "5em" }),
      dropdownIndicator: () => ({ display: "none" }),
      indicatorSeparator: () => ({ display: "none" }),
      menuPortal: (base: any) => ({ ...base, width: `50px`, margin: 0, zIndex: 9999 }),
      menu: (base: any) => ({ ...base, zIndex: 9999, fontSize: "12px" })
    }}
    isSearchable={false}
    menuShouldBlockScroll
    menuPortalTarget={document.body}
  />
)
