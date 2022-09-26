import { Title } from "app/components/Title"
import { useUserRecoil, useLoadRecoil } from "app/hooks/useRecoil"
import { useLogout } from "app/hooks/useLogout"
import { Modal, Button, CheckBox } from "app/components/common"
import { useState, useEffect } from "react"
import { getAuth, deleteUser } from "firebase/auth"
import { useNavigate } from "@remix-run/react"
import { toast } from "react-hot-toast"
import { useMutation } from "@apollo/client"
import { deleteUser as mutation } from "app/graphql/mutation"

/***
 * マイページ画面
 */

const ModalContent = ({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const auth = getAuth()
  const { recoilUser, setRecoilUser } = useUserRecoil()
  const [checkedExit, setCheck] = useState(false)
  const navigate = useNavigate()
  const { setRecoilLoad } = useLoadRecoil()
  const [deleteHasuraUser] = useMutation(mutation)

  const handleDeleteUser = async () => {
    setOpen(false)
    setRecoilLoad(true)
    await deleteUser(auth.currentUser!)
      .then(async () => {
        deleteHasuraUser({ variables: { uuid: recoilUser?.uid } })
        toast.success("退会しました。")
        setRecoilUser(undefined)
        navigate("/login")
      })
      .catch((e) => {
        console.log(e)
        toast.error("退会に失敗しました。")
      })
    setRecoilLoad(false)
  }

  return (
    <div className="flex w-full flex-col items-center text-[#555]">
      <h1 className="text-lg font-bold text-black">退会しますがよろしいですか？</h1>
      <div className="my-6 flex items-center justify-between w-full">
        <p className="flex mt-3">退会する場合はチェックボックスにチェックの上、 破棄ボタンをクリックしてください</p>
        <div className="flex flex-col items-center ml-4">
          <CheckBox
            checked={checkedExit}
            onChange={(e: any) => (e.target.id === "退会する" && e.target.checked ? setCheck(true) : setCheck(false))}
            label="退会する"
            className="mb-2"
          />
          <Button text="退会" onClick={handleDeleteUser} color="secondary" disabled={!checkedExit} />
        </div>
      </div>
    </div>
  )
}

export default function Index() {
  const { recoilUser } = useUserRecoil()
  const { ConfirmModal, openLogoutModal } = useLogout()
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="w-full flex flex-col items-center justify-around max-w-[800px] bg-white rounded-md p-5 sm:px-2 sm:py-4">
      <Title currentText="マイページ" />
      <div className="border w-full flex p-2 flex-col rounded-r-md text-base mt-2">
        <h2 className="text-lg text-[#555] mb-2">基本情報</h2>
        <div className="w-full flex items-baseline border-b border-dashed border-primary-dark mb-4">
          <p className="w-[40%] text-sm text-[#777]">メールアドレス</p>
          <p className="w-[60%] text-primary-text">{recoilUser?.email}</p>
        </div>
        <div className="w-full flex items-baseline border-b border-dashed border-primary-dark mb-4">
          <p className="w-[40%] text-sm text-[#777]">ユーザー名</p>
          <p className="w-[60%] text-primary-text">{recoilUser?.name}</p>
        </div>
        <div className="w-full flex items-baseline border-b border-dashed border-primary-dark mb-4">
          <p className="w-[40%] text-sm text-[#777]">登録日</p>
          <p className="w-[60%] text-primary-text">
            {recoilUser?.createdAt && new Date(recoilUser?.createdAt).toLocaleString().split(" ")[0]}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-end w-full flex-col">
        <p className="mr-4 text-[#888] underline hover:opacity-80 cursor-pointer mt-2" onClick={openLogoutModal}>
          ログアウト {">"}
        </p>
        <p className="mr-4 text-[#888] underline hover:opacity-80 cursor-pointer mt-2 mb-2" onClick={() => setOpen(true)}>
          退会する場合はこちらから {">"}
        </p>
      </div>
      <ConfirmModal />
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <ModalContent setOpen={setOpen} />
      </Modal>
    </div>
  )
}
