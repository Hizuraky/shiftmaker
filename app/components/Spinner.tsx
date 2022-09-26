import { useLoadRecoil } from "app/hooks/useRecoil"
import { BallTriangle } from "react-loader-spinner"

/***
 * ローディングスピナー
 */

export const RootSpinner = () => {
  const { recoilIsLoad } = useLoadRecoil()

  if (recoilIsLoad) {
    return (
      <>
        <div className="w-screen h-screen fixed bg-white opacity-70 z-50" />
        <div className="w-screen h-screen flex fixed items-center justify-center z-50 flex-col">
          <BallTriangle height="80" width="80" color="#385F5F" ariaLabel="three-dots-loading" />
          <p className="text-primary-text mt-4 pl-2">データ送信中...</p>
        </div>
      </>
    )
  }

  return <></>
}

export const Spinner = ({ isLoad }: { isLoad: boolean }) => {
  if (isLoad) {
    return (
      <>
        <div className="w-screen h-screen fixed bg-white opacity-70 z-50 top-0 left-0" />
        <div className="w-screen h-screen flex fixed items-center justify-center z-50 flex-col  top-0 left-0">
          <BallTriangle height="80" width="80" color="#385F5F" ariaLabel="three-dots-loading" />
          <p className="text-primary-text mt-4 pl-2">データ取得中...</p>
        </div>
      </>
    )
  }

  return <></>
}

export const PartSpinner = ({ isLoad, isError, children }: { isLoad: boolean; isError?: any; children: JSX.Element }) => {
  if (isLoad) {
    return (
      <div className="w-full flex  items-center justify-center flex-col">
        <BallTriangle height="80" width="80" color="#385F5F" ariaLabel="three-dots-loading" />
        <p className="text-primary-text mt-4 pl-2">データ取得中...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full flex  items-center justify-center flex-col">
        <p className="text-primary-text mt-4 pl-2">データの取得に失敗しました。</p>
      </div>
    )
  }

  return children
}
