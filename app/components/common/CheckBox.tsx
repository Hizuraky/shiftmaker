import { BiCheck } from "react-icons/bi"

/***
 * 共通チェックボックス
 */

type Props = {
  label?: string
  checked?: boolean
  onChange?: React.Dispatch<React.SetStateAction<any>>
  value?: any
  disabled?: boolean
  className?: string | undefined
}

export const CheckBox = ({ label, checked = false, onChange, value, disabled = false, className }: Props) => {
  const inputValue = value ? value : label
  return (
    <div className={className}>
      <label
        htmlFor={inputValue}
        key={inputValue}
        className={`flex items-center text-[#385F5F] font-semibold ${!disabled && "hover:opacity-70 cursor-pointer"}`}
      >
        <div className="flex items-center">
          <div
            className={`w-5 h-5 relative rounded-sm border-2 border-primary-dark ${label && "mr-2"}`}
            style={checked ? { borderColor: "#689CA6" } : { borderColor: "#72B4C0" }}
          >
            <p
              className="absolute text-secondary top-[-12px] text-4xl skew-x-[-15deg] font-black trans30"
              style={checked ? { right: "-12px" } : { right: "-5px", opacity: 0 }}
            >
              <BiCheck />
            </p>
          </div>
        </div>
        <input
          id={inputValue}
          type="checkbox"
          name="inputNames"
          checked={checked}
          onChange={onChange}
          value={inputValue}
          className="hidden"
          disabled={disabled}
        />
        {label}
      </label>
    </div>
  )
}
