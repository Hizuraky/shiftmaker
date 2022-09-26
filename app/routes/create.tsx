import { useLocation, Outlet, useNavigate } from "@remix-run/react"
import { Title } from "app/components/Title"
import { ProgressNav } from "app/components/ProgressNav"
import { Button } from "app/components/common"
import { useExitCreateShift } from "~/hooks/useExitCreateShift"
import { useState, useEffect } from "react"
import { useShiftCreateRecoil, useShiftEditRecoil } from "app/hooks/useRecoil"
import { useMutationShift } from "app/hooks/useMutationShift"

/***
 * シフト作成画面共通部
 */

export default function Index() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [shifts, setShifts] = useState<{ employee: number | undefined; workIds: (number | undefined)[] }[]>([])
  const { recoilShiftDate, recoilEmployeeWorkingTime, recoilCreateShiftId } = useShiftCreateRecoil()
  const { recoilEditShiftId } = useShiftEditRecoil()

  const mutationShift = useMutationShift({
    shifts: shifts,
    shiftInfo: {
      shiftName: "一時保存シフト",
      isCompleted: false,
      isFirstDateShift: !recoilCreateShiftId?.shiftDateId,
      isEdit: recoilEditShiftId?.shiftId ? true : false,
      isTemporarily: true
    }
  })
  const { ConfirmModal, setOpen } = useExitCreateShift({ shifts: shifts, mutation: mutationShift })

  useEffect(() => {
    // recoilに年月情報がなければ年月画面へ遷移
    if (!recoilShiftDate) {
      navigate("/create/date")
      // recoilに従業員情報がなければ各情報確認画面へ遷移
    } else if (!recoilEmployeeWorkingTime) {
      navigate("/create/confirm")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const basePrevious = { text: "作成シフト一覧", rootPath: "/shift" }
  const datePrevious = { text: "", rootPath: "/create/date", isHidden: true }
  const confirmPrevious = { text: "", rootPath: "/create/confirm", isHidden: true }

  const previous =
    pathname === "/create/automation"
      ? [basePrevious, datePrevious, confirmPrevious]
      : pathname === "/create/confirm"
      ? [basePrevious, datePrevious]
      : [basePrevious]

  return (
    <div>
      <div className="flex justify-between relative">
        <div>
          <Title currentText="シフト作成" previous={previous} />
          <div className="m-2 sm:m-1" />
          <ProgressNav currentPath={pathname} />
        </div>
        <div className="absolute right-0 top-0">
          <Button text={pathname === "/create/automation" ? "中断 / 一時保存" : "中断"} onClick={setOpen} color="secondary" width="md" />
        </div>
      </div>
      <div className="m-3 sm:m-1" />
      <Outlet context={{ shifts, setShifts }} />
      <ConfirmModal />
    </div>
  )
}
