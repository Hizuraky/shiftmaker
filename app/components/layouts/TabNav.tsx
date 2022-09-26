import { FaUsers } from "react-icons/fa"
import { ImProfile, ImCalendar } from "react-icons/im"
import { useNavigate, useLocation } from "@remix-run/react"
import { useState, useEffect } from "react"
import { useShiftCreateRecoil } from "app/hooks/useRecoil"

/***
 * 共通タブ(PC)
 */

export const TabNav = () => {
  const { pathname, state }: any = useLocation()
  const { setRecoilNotCompleted } = useShiftCreateRecoil()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<"create" | "shifts" | "mypage">("create")
  const [createPath, setCreatePath] = useState("/create/date")
  const [shiftPath, setShiftsPath] = useState("/shift")
  const [shiftState, setShiftsState] = useState<object | undefined>(undefined)
  const [createState, setCreateState] = useState<object | undefined>(undefined)

  // pathnameでタブのselected状態を分岐
  useEffect(() => {
    if (pathname.startsWith("/create")) {
      setSelectedTab("create")
    } else if (pathname === "/mypage") {
      setSelectedTab("mypage")
    } else {
      setSelectedTab("shifts")
    }
  }, [pathname])

  const handleSelectTab = ({ selectTab }: { selectTab: "create" | "shifts" | "mypage" }) => {
    if (selectTab === selectedTab) return
    // 現在のタブの分岐
    if (selectedTab === "create") {
      setCreateState(state)
      setCreatePath(pathname)
      pathname === "/create/automation" && setRecoilNotCompleted(true)
    } else if (selectedTab === "shifts") {
      setShiftsState(state)
      setShiftsPath(pathname)
    }

    // クリックしたタブの分岐
    if (selectTab === "create") {
      navigate(createPath, { state: { notOpenModal: true, ...createState } })
    } else if (selectTab === "shifts") {
      navigate(shiftPath, { state: { ...shiftState } })
    } else if (selectTab === "mypage") {
      navigate("/mypage")
    }
  }

  const baseClassName = "px-4 py-2 rounded-md w-[150px] flex justify-center mr-5 items-center"
  const selectedClassName = "bg-white cursor-not-allowed"
  const unSelectedClassName =
    "bg-[#fbfbfb] border-2 border-[#73A6AF] text-[#888] shadow-inner hover:bg-[#f8f8f8] hover:text-[#aaa] cursor-pointer"

  return (
    <div className="flex pl-5 mb-[-5px]">
      <div
        className={`${baseClassName} ${selectedTab === "shifts" ? selectedClassName : unSelectedClassName}`}
        onClick={() => handleSelectTab({ selectTab: "shifts" })}
      >
        <ImProfile className="mr-2" size={20} />
        <p>シフト一覧</p>
      </div>
      <div
        className={`${baseClassName} ${selectedTab === "create" ? selectedClassName : unSelectedClassName}`}
        onClick={() => handleSelectTab({ selectTab: "create" })}
      >
        <ImCalendar className="mr-2" size={20} />
        <p>シフト作成</p>
      </div>
      <div
        className={`${baseClassName} ${selectedTab === "mypage" ? selectedClassName : unSelectedClassName}`}
        onClick={() => handleSelectTab({ selectTab: "mypage" })}
      >
        <FaUsers className="mr-2" size={20} />
        <p>マイページ</p>
      </div>
    </div>
  )
}
