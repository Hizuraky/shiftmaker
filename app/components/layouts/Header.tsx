import { useState } from "react"
import { useNavigate, useLocation } from "@remix-run/react"
import { useShiftCreateRecoil, useUserRecoil } from "app/hooks/useRecoil"
import { slide as Menu } from "react-burger-menu"
import { Sling as Hamburger } from "hamburger-react"
import { BsChevronRight } from "react-icons/bs"
import { MdOutlinePolicy, MdOutlineSpeakerNotes } from "react-icons/md"
import { GrNotes, GrDocumentUser } from "react-icons/gr"
import { RiLogoutBoxRLine } from "react-icons/ri"
import { ImProfile, ImCalendar } from "react-icons/im"
import { Modal, Button } from "app/components/common"
import { useLogout } from "~/hooks/useLogout"
import type { IconType } from "react-icons"

/***
 * 共通ヘッダー
 */

export const Header = () => {
  const navigate = useNavigate()
  const { recoilUser } = useUserRecoil()
  const [isOpen, setOpen] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [navigatePath, setNavigatePath] = useState("")
  const { pathname } = useLocation()
  const { resetCreate } = useShiftCreateRecoil()
  const { ConfirmModal, openLogoutModal } = useLogout()

  const exitCreate = () => {
    navigate(navigatePath)
    setModalOpen(false)
    resetCreate()
  }

  const handleNavigate = (page: string) => {
    const path = page === "/create" ? "/create/date" : page
    setOpen(false)
    if (pathname === "/create/automation") {
      setModalOpen(true)
      setNavigatePath(path)
    } else {
      navigate(path)
    }
  }

  const MenuList = ({ path, Icon, text }: { path: string; Icon: IconType; text: string }) => (
    <div
      className={`flex justify-between border-t p-3 items-center border-gray-200 ${pathname.indexOf(path) > -1 && "bg-[#eee]"}`}
      onClick={() => (pathname.indexOf(path) > -1 ? setOpen(false) : handleNavigate(path))}
    >
      <div className="flex items-center">
        <Icon />
        <p className="ml-2">{text}</p>
      </div>
      <BsChevronRight />
    </div>
  )

  return (
    <div className="h-12 w-full shadow-md bg-white sm:fixed z-[9999]">
      <img
        src="https://ks-icons.s3.ap-northeast-1.amazonaws.com/Logo.png"
        alt="Shift maker"
        className="h-12 cursor-pointer"
        onClick={() => handleNavigate(recoilUser ? "/shift" : "/login")}
      />
      <div className="hidden sm:block m-0 p-0">
        {/* スマホ ハンバーガーメニュー */}
        <Menu
          width={"300px"}
          right
          styles={hamburgerStyles}
          customBurgerIcon={<Hamburger toggled={isOpen} size={25} />}
          isOpen={isOpen}
          onStateChange={(state) => setOpen(state.isOpen)}
        >
          <div className="p-3 font-semibold text-primary-text text-base w-[300px] truncate">
            ユーザー：{recoilUser?.name ?? "ゲストユーザー"}
          </div>
          <div className="flex items-center text-gray-600  justify-center w-full sm:flex-col text-sm">
            {recoilUser ? (
              <>
                <MenuList path="/shift" Icon={() => <ImProfile />} text="シフト一覧" />
                <MenuList path="/create" Icon={() => <ImCalendar />} text="シフト作成" />
                <MenuList path="/mypage" Icon={() => <GrDocumentUser />} text="マイページ" />
              </>
            ) : (
              <>
                <MenuList path="/login" Icon={() => <GrDocumentUser />} text="ログイン" />
                <MenuList path="/register" Icon={() => <ImProfile />} text="新規登録" />
              </>
            )}
            <MenuList path="/terms" Icon={() => <MdOutlineSpeakerNotes />} text="利用規約" />
            <MenuList path="/policy" Icon={() => <MdOutlinePolicy />} text="プライバシーポリシー" />
            <MenuList path="/manual" Icon={() => <GrNotes />} text="操作説明" />
            {recoilUser && (
              <div className="flex justify-between border-t border-b p-3 items-center border-gray-200" onClick={openLogoutModal}>
                <div className="flex items-center">
                  <RiLogoutBoxRLine />
                  <p className="ml-2">ログアウト</p>
                </div>
                <BsChevronRight />
              </div>
            )}
          </div>
        </Menu>
      </div>
      <Modal isOpen={isModalOpen} setOpen={setModalOpen}>
        <div>
          <h1 className="text-base font-semibold">画面遷移すると現在作成中のシフトが破棄されますがよろしいですか？</h1>
          <p>一時保存する場合はシフト作成画面内の「中断/一時保存」をクリックしてください。</p>
          <div className="w-full justify-around flex mt-3">
            <Button text="キャンセル" variant="outlined" color="secondary" onClick={() => setModalOpen(false)} />
            <Button text="破棄" color="secondary" onClick={() => exitCreate()} />
          </div>
        </div>
      </Modal>
      <ConfirmModal />
    </div>
  )
}

// react-burger-menuのテンプレ
const hamburgerStyles = {
  bmBurgerButton: {
    position: "absolute",
    width: "48px",
    height: "48px",
    top: "0",
    right: "0"
  },
  bmMenu: {
    background: "white",
    fontSize: "12px"
  },
  bmItem: {
    display: "inline-block"
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.6)"
  }
}
