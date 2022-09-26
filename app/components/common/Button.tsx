/***
 * 共通ボタン
 */

type Props = {
  text: string | JSX.Element
  onClick?: any
  color?: "primary" | "primary-light" | "secondary" | "secondary-light" | "white"
  colorCode?: string
  textColor?: "text-white" | "text-black" | "text-gray-400"
  width?: "sm" | "md" | "lg"
  textSize?: "text-xs" | "text-sm" | "text-base"
  type?: "button" | "submit" | "reset"
  variant?: "contained" | "outlined" | "text"
  customWidth?: string
  customHeight?: string
  disabled?: boolean
}

export const Button = ({
  text,
  onClick,
  color = "primary",
  textColor = "text-white",
  width = "md",
  textSize = "text-sm",
  type = "button",
  variant = "contained",
  customWidth,
  customHeight,
  disabled = false
}: Props) => {
  let bgColorClass = ""
  let outlineBorderClass = ""
  let outlinedText = ""
  if (disabled) {
    bgColorClass = "bg-gray-300"
    outlineBorderClass = "border-gray-300"
    outlinedText = "text-gray-300"
  } else if (color === "primary") {
    bgColorClass = "bg-primary"
    outlineBorderClass = "border-primary"
    outlinedText = "text-primary"
  } else if (color === "primary-light") {
    bgColorClass = "bg-primary-light"
    outlineBorderClass = "border-primary-light"
    outlinedText = "text-primary-light"
  } else if (color === "secondary") {
    bgColorClass = "bg-secondary"
    outlineBorderClass = "border-secondary"
    outlinedText = "text-secondary"
  } else if (color === "secondary-light") {
    bgColorClass = "bg-secondary-light"
    outlineBorderClass = "border-secondary-light"
    outlinedText = "text-secondary-light"
  } else if (color === "white") {
    bgColorClass = "bg-white"
    outlineBorderClass = "border-white"
    outlinedText = "text-white"
  }

  const widthClass =
    width === "sm" ? "w-24 h-8 sm:w-16 sm:h-6" : width === "md" ? "w-32 h-8 sm:w-24 sm:h-6" : width === "lg" && "w-44 h-9 sm:w-32 sm:h-6"
  const containedClass = `${
    !disabled && "hover:opacity-80 active:translate-y-[1px]"
  } ${bgColorClass} relative overflow-hidden rounded-lg shadow-md sm:rounded-[5px] ${widthClass}`
  const outlinedClass = `${
    !disabled && "hover:opacity-80 active:translate-y-[1px]"
  } ${outlineBorderClass} border-4 sm:border-2 relative overflow-hidden rounded-lg shadow-md sm:rounded-[5px] ${widthClass}`
  const textColorClass = variant === "contained" ? textColor : outlinedText
  const textButtonClass = `${!disabled && "hover:opacity-80 active:translate-y-[1px]"} relative overflow-hidden`

  return (
    <button
      className={variant === "contained" ? containedClass : variant === "outlined" ? outlinedClass : textButtonClass}
      onClick={onClick}
      type={type}
      style={{ width: customWidth, height: customHeight }}
      disabled={disabled}
    >
      <p className={`${textSize} ${textColorClass} ${variant === "text" && "underline"} flex items-center justify-center`}>{text}</p>
    </button>
  )
}
