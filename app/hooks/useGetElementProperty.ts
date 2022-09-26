import type { RefObject } from "react"
import { useCallback, useState, useEffect } from "react"

/***
 * 画面幅、要素幅取得Hooks
 */

type DOMRectProperty = keyof Omit<DOMRect, "toJSON">
export const useGetElementProperty = <T extends HTMLElement>(elementRef?: RefObject<T>) => {
  const getElementProperty = useCallback(
    (targetProperty: DOMRectProperty): number => {
      const clientRect = elementRef?.current?.getBoundingClientRect()
      if (clientRect) {
        return clientRect[targetProperty]
      }
      return 0
    },
    [elementRef]
  )

  const getWindowDimensions = () => {
    if (typeof window !== "undefined") {
      const { innerWidth: width, innerHeight: height } = window
      return {
        width,
        height
      }
    } else {
      return {
        width: 0,
        height: 0
      }
    }
  }
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  useEffect(() => {
    const onResize = () => {
      setWindowDimensions(getWindowDimensions())
    }
    window?.addEventListener("resize", onResize)
    return () => window?.removeEventListener("resize", onResize)
  }, [])

  return {
    getElementProperty,
    windowDimensions
  }
}
