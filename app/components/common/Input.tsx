/**
 * 共通入力フォーム
 *
 * memo: iPhoneでの拡大を防ぐために16px,transform:0.75で調節
 */

type Props = {
  onChange?: any
  register?: any
  schema?: string
  required?: boolean
  maxLength?: number
  regex?: RegExp
  regMessage?: string
  validate?: any
  label: string
  value?: string
  isPassword?: boolean
}

export const Input = ({
  onChange,
  register,
  schema,
  required,
  maxLength,
  regex,
  regMessage,
  label,
  value,
  isPassword,
  validate
}: Props) => {
  return (
    <div className="w-full rounded-sm h-full border border-[#eee] bg-[#fefefe] text-[#444] focus-within:border-primary focus-within:bg-[#fcfcfc] text-center focus-within:border-2 flex justify-center items-center">
      {register ? (
        <input
          type={isPassword ? "password" : "text"}
          {...register(schema, {
            required: required ? `${label}は必須項目です` : false,
            maxLength: { value: maxLength, message: `${maxLength}文字以内で入力してください` },
            pattern: {
              value: regex,
              message: regMessage
            },
            validate: validate
          })}
          className="w-full h-8 text-[#444] outline-none"
          placeholder={`${label}を入力してください`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="w-full h-8 text-[#444] text-center outline-none"
          placeholder={`${label}を入力してください`}
        />
      )}
    </div>
  )
}
