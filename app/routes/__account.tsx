import { Outlet } from "@remix-run/react"

/***
 * 新規アカウント登録,ログイン画面共通部
 */

export default function Index() {
  return (
    <div className="bg-white w-[800px] self-center flex flex-col p-4 rounded-md items-center">
      <div className="mb-4 flex justify-center">
        <img src="https://ks-icons.s3.ap-northeast-1.amazonaws.com/Logo.png" alt="Shift maker" className="w-[50%] mr-[8%]" />
      </div>
      <Outlet />
    </div>
  )
}
