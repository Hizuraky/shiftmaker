import { TabNav } from "app/components/layouts/TabNav"
import { Header } from "app/components/layouts/Header"
import { Footer } from "app/components/layouts/Footer"
import { useLocation } from "@remix-run/react"
import { useUserRecoil } from "app/hooks/useRecoil"

/***
 * 共通レイアウト
 */

export const DefaultLayout = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation()
  const { recoilUser } = useUserRecoil()

  return (
    <>
      {recoilUser ? (
        <div className="bg-[#f0f7f6] text-sm min-h-[100vh] flex flex-col justify-between sm:text-xs">
          <div>
            <Header />
            <div className="flex flex-col p-5 sm:p-2 sm:mt-12 sm:overflow-x-hidden">
              <div className="sm:hidden">
                <TabNav />
              </div>
              <div className={`${pathname !== "/mypage" && "bg-white rounded-md p-5 sm:px-2 sm:py-4"}`}>{children}</div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div className="bg-[#f0f7f6] text-sm min-h-[100vh] sm:min-h-[80vh] flex flex-col justify-between sm:text-xs">
          <div>
            <Header />
            <div className="flex flex-col p-5 sm:p-2 sm:mt-12 sm:overflow-x-hidden">
              <div
                className={`${
                  !["/login", "/register"].includes(pathname) && "bg-white rounded-md p-5 sm:px-2 sm:py-4"
                } flex justify-center rounded-md p-5 sm:px-2 sm:py-4`}
              >
                {children}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  )
}
