import toast from "react-hot-toast"
import { useNavigate } from "@remix-run/react"
import { Button, Input } from "app/components/common"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { Title } from "app/components/Title"
import type { SubmitHandler } from "react-hook-form"

/***
 * 新規アカウント登録画面
 */

type SubmitValue = { email: string; password: string; confirm: string; name: string }
export default function Index() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [isHiddenPassword, setHiddenPassword] = useState(true)
  const [isHiddenConfirm, setHiddenConfirm] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SubmitValue>()

  // 登録処理
  const submitRegister: SubmitHandler<SubmitValue> = async ({ email, password, name }) => {
    setLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        updateProfile(res.user, { displayName: name })
        toast.success("アカウントを登録しました。")
        navigate("/shift")
      })
      .catch((error) => {
        setErrorMessage(
          error.code === "auth/email-already-in-use" ? "入力したメールアドレスは既に登録されています。" : "アカウント作成に失敗しました。"
        )
        setLoading(false)
      })
  }

  return (
    <>
      <div className="flex flex-col items-start w-full max-w-[600px]">
        <Title currentText="新規アカウント登録" />
        {errorMessage && <p className="text-[#ef5a5a] text-sm mb-2">{errorMessage}</p>}
        <p className="text-[#555] mb-2 sm:hidden">登録するアカウントのユーザー名、メールアドレス、パスワードを入力してください</p>
        <p className="text-[#555] hidden sm:block">登録するアカウントのユーザー名、</p>
        <p className="text-[#555] hidden sm:block sm:mb-2">メールアドレス、パスワードを入力してください</p>
      </div>
      <div className="flex rounded-sm border h-[40px] border-[#999] max-w-[600px] w-full">
        <div className="w-[30%] justify-center flex bg-primary-pale h-[38px] items-center border-r border-[#999] min-w-[100px]">
          ユーザー名
        </div>
        <div className="w-[70%] flex justify-center">
          <Input register={register} schema="name" required label="ユーザー名" maxLength={20} />
        </div>
      </div>
      <p className="text-[#ef5a5a] text-xs">{errors?.name?.message}</p>

      <div className="flex rounded-sm border h-[40px] border-[#999] max-w-[600px] w-full mt-4">
        <div className="w-[30%] justify-center flex bg-primary-pale h-[38px] items-center border-r border-[#999] min-w-[100px]">
          メールアドレス
        </div>
        <div className="w-[70%] flex justify-center">
          <Input
            register={register}
            schema="email"
            required
            label="メールアドレス"
            regex={/^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/}
            regMessage="メールアドレスの形式が正しくありません"
          />
        </div>
      </div>
      <p className="text-[#ef5a5a] text-xs">{errors?.email?.message}</p>
      <div className="flex rounded-sm border  h-[40px] border-[#999] max-w-[600px] w-full mt-4">
        <div className="w-[30%] justify-center flex bg-primary-pale h-[38px] items-center border-r border-[#999] min-w-[100px]">
          パスワード
        </div>
        <div className="w-[70%] flex relative items-center">
          <Input
            register={register}
            schema="password"
            required
            label="パスワード"
            isPassword={isHiddenPassword}
            regex={/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9.@?/+*¥^!-_]{8,24}$/}
            regMessage="アルファベットと数字を含めた8-24文字で設定してください"
          />
          <div className="absolute right-3 cursor-pointer" onClick={() => setHiddenPassword(!isHiddenPassword)}>
            {isHiddenPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
          </div>
        </div>
      </div>
      <p className="text-[#ef5a5a] text-xs">{errors?.password?.message}</p>
      <div className="flex rounded-sm border  h-[40px] border-[#999] max-w-[600px] w-full mt-4">
        <div className="w-[30%] justify-center flex bg-primary-pale h-[38px] items-center border-r border-[#999] min-w-[100px]">
          パスワード(確認)
        </div>
        <div className="w-[70%] flex relative items-center">
          <Input
            register={register}
            schema="confirm"
            required
            label="パスワード(確認)"
            isPassword={isHiddenConfirm}
            regex={/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9.@?/+*¥^!-_]{8,24}$/}
            regMessage="アルファベットと数字を含めた8-24文字で設定してください"
            validate={(value: any) => value === watch("password") || "パスワードが一致していません"}
          />
          <div className="absolute right-3 cursor-pointer" onClick={() => setHiddenConfirm(!isHiddenConfirm)}>
            {isHiddenConfirm ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
          </div>
        </div>
      </div>
      <p className="text-[#ef5a5a] text-xs">{errors?.confirm?.message}</p>

      <div className="mt-4 w-full max-w-[600px]">
        <Button text="アカウント登録" onClick={handleSubmit(submitRegister)} customWidth="100%" customHeight="32px" disabled={loading} />
      </div>
      <div className="mt-4 flex flex-col items-start w-full max-w-[600px]">
        <Button text="< ログイン画面へ戻る" onClick={() => navigate("/login")} variant="text" />
      </div>
    </>
  )
}
