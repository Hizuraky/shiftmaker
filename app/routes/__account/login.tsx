import { useState } from "react"
import { useNavigate } from "@remix-run/react"
import { Button, Input } from "app/components/common"
import { Title } from "app/components/Title"
import { useForm } from "react-hook-form"
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import toast from "react-hot-toast"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useUserRecoil } from "app/hooks/useRecoil"
import type { SubmitHandler } from "react-hook-form"

/***
 * ログイン画面
 */

type SubmitValue = { email: string; password: string }
export default function Index() {
  const navigate = useNavigate()
  const [isHiddenPassword, setHiddenPassword] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { setRecoilUser } = useUserRecoil()
  const auth = getAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SubmitValue>()

  // ログイン処理
  const submitLogin: SubmitHandler<SubmitValue> = ({ email, password }) => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        setRecoilUser({ uid: res.user.uid, name: res.user.displayName, email: res.user.email, createdAt: res.user.metadata.creationTime })
        toast.success("ログインしました。")
        navigate("/shift")
      })
      .catch((error) => {
        setErrorMessage(
          error.code === "auth/wrong-password" || error.code === "auth/user-not-found"
            ? "メールアドレスもしくはパスワードが正しくありません。"
            : error.code === "auth/too-many-requests"
            ? "ログインに失敗しました。時間を開けてお試しください。"
            : "ログインに失敗しました。"
        )
        console.log(error.code)
        setLoading(false)
      })
  }

  // Google連携処理
  const connectGoogleAuth = async () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then(() => {
      toast.success("Googleアカウントでログインしました。")
      navigate("/shift")
    })
  }

  return (
    <>
      <div className="flex flex-col items-start w-full max-w-[600px]">
        <Title currentText="ログイン" />
        {errorMessage && <p className="text-[#ef5a5a] text-sm mb-2">{errorMessage}</p>}
        <p className="text-[#555] mb-2 sm:hidden">ログインするアカウントのメールアドレスとパスワードを入力してください</p>
        <p className="text-[#555] hidden sm:block">ログインするアカウントの</p>
        <p className="text-[#555] hidden sm:block sm:mb-2">メールアドレスとパスワードを入力してください</p>
      </div>
      <div className="flex rounded-sm border  h-[40px] border-[#999] max-w-[600px] w-full ">
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
          <Input register={register} schema="password" required label="パスワード" isPassword={isHiddenPassword} />
          <div className="absolute right-3 cursor-pointer" onClick={() => setHiddenPassword(!isHiddenPassword)}>
            {isHiddenPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
          </div>
        </div>
      </div>
      <p className="text-[#ef5a5a] text-xs">{errors?.password?.message}</p>
      <div className="mt-4 w-full max-w-[600px]">
        <Button text="ログイン" onClick={handleSubmit(submitLogin)} customWidth="100%" customHeight="32px" disabled={loading} />
      </div>
      <div className="mt-2 flex flex-col items-start w-full max-w-[600px]">
        <Button text="アカウント作成はこちら >" onClick={() => navigate("/register")} variant="text" />
      </div>

      <div className="flex flex-col items-start w-full max-w-[600px] mt-6">
        <p className="text-[#555] mb-2 sm:hidden">
          会員登録せずにGoogleアカウントでログインする場合はこちらのボタンをクリックしてください。
        </p>
        <p className="text-[#555] hidden sm:block">会員登録せずにGoogleアカウントでログインする場合は</p>
        <p className="text-[#555] hidden sm:block">こちらのボタンをクリックしてください。</p>
      </div>
      <div className="mt-2 w-full max-w-[600px] mb-6">
        <Button
          text={
            <div className="flex items-center">
              <FcGoogle size={25} />
              <p className="ml-2">Googleログイン</p>
            </div>
          }
          onClick={connectGoogleAuth}
          customWidth="100%"
          customHeight="32px"
          disabled={loading}
        />
      </div>
    </>
  )
}
