/***
 * 共通モーダル
 */

type Props = {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
  onCloseFunc?: () => void
}

export const Modal = ({ isOpen, setOpen, children, onCloseFunc }: Props) => {
  return (
    <>
      {isOpen && (
        <div
          className="flex justify-center overflow-auto fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] modal items-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onCloseFunc && onCloseFunc()
              setOpen(false)
            }
          }}
        >
          <div className="bg-white modal_contents rounded-md relative p-10 min-w-[400px] flex justify-center items-center">
            {children}
            <div
              className="absolute top-3 right-5 text-xl p-1 cursor-pointer hover:opacity-50"
              onClick={() => {
                onCloseFunc && onCloseFunc()
                setOpen(false)
              }}
            >
              ×
            </div>
          </div>
        </div>
      )}
    </>
  )
}
