import { useNavigate } from "@remix-run/react"
import { useUserRecoil } from "app/hooks/useRecoil"

/**
 * 共通フッター
 */

export const Footer = () => {
  const navigate = useNavigate()
  const { recoilUser } = useUserRecoil()
  return (
    <div className="w-full bg-white  flex justify-center ">
      <div className="w-full max-w-[1000px] flex justify-center flex-col items-center pt-2 sm:hidden">
        <div className="flex w-full max-w-[1000px]">
          <img
            src="https://ks-icons.s3.ap-northeast-1.amazonaws.com/FooterLogo.png"
            alt="Shift maker"
            className="w-1/4 max-w-[250px] object-contain"
            onClick={() => navigate("/shift")}
          />
          <div className="flex items-center text-gray-600  underline justify-center w-full">
            {!recoilUser && (
              <p className="hover:text-gray-400 cursor-pointer mr-[10%] sm:mb-2" onClick={() => navigate("/login")}>
                ログイン
              </p>
            )}
            <p className="hover:text-gray-400 cursor-pointer mr-[10%] sm:mb-2" onClick={() => navigate("/terms")}>
              利用規約
            </p>
            <p className="hover:text-gray-400 cursor-pointer mr-[10%] sm:mb-2" onClick={() => navigate("/policy")}>
              プライバシーポリシー
            </p>
            <p className="hover:text-gray-400 cursor-pointer mr-[10%] sm:mb-2" onClick={() => navigate("/manual")}>
              操作説明
            </p>
          </div>
        </div>
        <p className="text-gray-400 mb-3">©️ shift maker . All Rights Reserved.</p>
      </div>
      <div className="hidden sm:flex justify-center items-center">
        <img
          src="https://ks-icons.s3.ap-northeast-1.amazonaws.com/FooterLogo.png"
          alt="Shift maker"
          className="w-1/4 object-contain"
          onClick={() => navigate("/shift")}
        />
        <p className="text-gray-400">©️ shift maker . All Rights Reserved.</p>
      </div>
    </div>
  )
}
