import { Button } from "app/components/common"
import { useNavigate } from "@remix-run/react"
import { Footer } from "app/components/layouts/Footer"

/***
 * 404コンポーネント
 */

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#f0f7f6] text-sm flex flex-col sm:text-xs min-h-screen justify-between">
      <div>
        <div className="h-12 w-full shadow-md bg-white">
          <img
            src="https://ks-icons.s3.ap-northeast-1.amazonaws.com/Logo.png"
            alt="Shift maker"
            className="h-12 cursor-pointer"
            onClick={() => navigate("/shift")}
          />
        </div>
        <div className="flex justify-center flex-col rounded-md p-5 bg-white items-center m-4">
          <h1 className="font-bold text-lg mb-4">ページが見つかりません。</h1>
          <p className="mb-4">お探しのページが見つかりません。下のボタンよりお進みください。</p>
          <Button text="トップページへ" onClick={() => navigate("/shift")} customWidth="300px" />
        </div>
      </div>
      <Footer />
    </div>
  )
}
