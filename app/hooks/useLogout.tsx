import toast from "react-hot-toast"
import { signOut, getAuth } from "firebase/auth"
import { useUserRecoil, useShiftEditRecoil, useShiftCreateRecoil } from "app/hooks/useRecoil"
import { useNavigate } from "@remix-run/react"
import { Modal, Button } from "app/components/common"
import { useState } from "react"

/***
 * ログアウトHooks
 */

export const useLogout = () => {
  const { setRecoilEditUpdateId } = useShiftEditRecoil()
  const { resetCreate } = useShiftCreateRecoil()
  const { setRecoilUser } = useUserRecoil()
  const auth = getAuth()
  const navigate = useNavigate()

  const logout = () => {
    setRecoilEditUpdateId(undefined)
    setRecoilUser(undefined)
    resetCreate()
    toast.success("ログアウトしました。")
    signOut(auth)
    navigate("/login")
  }

  const openLogoutModal = () => setOpen(true)

  const [isOpen, setOpen] = useState(false)
  const ConfirmModal = () => (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="w-full justify-center flex flex-col items-center">
        <h1 className="font-bold text-lg mb-2">ログアウトしますがよろしいですか？</h1>
        <div className="w-full flex justify-around mt-2">
          <Button text="キャンセル" variant="outlined" onClick={() => setOpen(false)} />
          <Button text="ログアウト" onClick={logout} />
        </div>
      </div>
    </Modal>
  )
  return { ConfirmModal, openLogoutModal }
}
