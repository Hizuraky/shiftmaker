import { useEffect } from "react"

/**
 * ページ更新確認hooks
 */

export const useConfirm: () => void = () => {
  const handleBeforeUnloadEvent = (event: BeforeUnloadEvent): void => {
    event.returnValue = ""
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnloadEvent)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
