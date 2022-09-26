import { useState } from "react"
import { useNavigate, useLocation } from "@remix-run/react"
import { Button } from "app/components/common/Button"
import { CheckBox } from "~/components/common/CheckBox"
import { Modal } from "app/components/common/Modal"
import { useShiftCreateRecoil } from "app/hooks/useRecoil"

/***
 * シフト中断・一時保存Hooks
 */

type Props = {
  shifts: { employee: number | undefined; workIds: (number | undefined)[] }[]
  mutation: () => void
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContent = ({ mutation, setOpen }: Props) => {
  const [checkedExit, setCheck] = useState(false)
  const navigate = useNavigate()
  const { resetCreate } = useShiftCreateRecoil()
  const { pathname } = useLocation()

  const handleExit = () => {
    resetCreate()
    setOpen && setOpen(false)
    navigate("/")
  }

  return (
    <div className="flex w-full flex-col items-center text-[#555]">
      <h1 className="text-lg font-bold text-black">作成中のシフトを中断しますがよろしいですか？</h1>
      {pathname === "/create/automation" ? (
        <>
          <div className="my-6 flex items-center justify-between w-full">
            <p className="flex-col flex mt-3">
              破棄する場合はチェックボックスにチェックの上、
              <br />
              破棄ボタンをクリックしてください
            </p>
            <div className="flex flex-col items-center ml-4">
              <CheckBox
                checked={checkedExit}
                onChange={(e: any) => (e.target.id === "シフト破棄" && e.target.checked ? setCheck(true) : setCheck(false))}
                label="シフト破棄"
                className="mb-2"
              />
              <Button text="破棄" onClick={handleExit} color="secondary" disabled={!checkedExit} />
            </div>
          </div>
          <div className="flex justify-between w-full items-center">
            <p className="mr-4">一時保存すると現在の内容のまま作業を再開できます。</p>
            <div className="">
              <Button
                text="一時保存"
                onClick={() => {
                  setOpen && setOpen(false)
                  mutation()
                }}
                color="primary"
                width="md"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-2">
          <Button text="OK" onClick={handleExit} color="secondary" />
        </div>
      )}
    </div>
  )
}

export const useExitCreateShift = ({ shifts, mutation }: Props) => {
  const [isOpen, setOpen] = useState(false)
  const ConfirmModal = () => (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <ModalContent shifts={shifts} mutation={mutation} setOpen={setOpen} />
    </Modal>
  )
  return { ConfirmModal, setOpen }
}
