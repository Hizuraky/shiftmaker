import type { ReactNode } from "react"
import { useState, useEffect } from "react"

/***
 * 共通アコーディオン
 */

type Props = {
  label: string
  children: ReactNode
  onAccordionClose?: boolean
  isFront?: boolean
}
export const Accordion = ({ label, children, onAccordionClose = false, isFront = false }: Props) => {
  const [setActive, setActiveState] = useState(false)

  useEffect(() => {
    onAccordionClose && setActiveState(false)
  }, [onAccordionClose])

  const toggleAccordion = () => {
    setActiveState(!setActive ? true : false)
  }

  return (
    <div className="flex flex-col border rounded-sm">
      <div
        className="cursor-pointer h-10 outline-none flex items-center justify-start sm:h-6 pl-2 bg-primary-pale"
        onClick={toggleAccordion}
      >
        {label}
        <p style={setActive ? { transform: "rotate(180deg)" } : {}} className="trans30 ml-2">
          ▲
        </p>
      </div>
      <div
        className="trans30 overflow-auto px-2"
        style={setActive ? { maxHeight: "800px", borderTopWidth: 1, paddingTop: "8px" } : { maxHeight: "0px" }}
      >
        {children}
      </div>
    </div>
  )
}
