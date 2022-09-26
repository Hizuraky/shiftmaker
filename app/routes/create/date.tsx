import { useNavigate, useLocation } from "@remix-run/react"
import { DateSelect } from "app/components/DateSelect"
import { Button, Modal } from "app/components/common"
import { useState, useEffect } from "react"
import { useUserRecoil, useShiftCreateRecoil } from "app/hooks/useRecoil"
import { useQuery } from "app/hooks/useApollo"
import type { ShiftDate } from "app/utils/types"
import { shiftDateQuery } from "app/graphql/query"
import { useGetElementProperty } from "app/hooks/useGetElementProperty"

/***
 * シフト作成 > 年月選択画面
 */

export default function Index() {
  const navigate = useNavigate()
  const navState = useLocation().state as { notOpenModal?: boolean }
  const {
    recoilShiftDate,
    setRecoilShiftDate,
    resetCreate,
    setRecoilCreateUpdateId,
    recoilNotCompleted,
    setRecoilNotCompleted,
    recoilCreateState
  } = useShiftCreateRecoil()
  const { recoilUser } = useUserRecoil()
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false)
  const userId = recoilUser?.uid
  const [selectedYear, setYear] = useState(recoilShiftDate?.year ?? new Date().getFullYear())
  const [selectedMonth, setMonth] = useState(recoilShiftDate?.month ?? new Date().getMonth() + 1)
  const [isOpen, setOpen] = useState(false)
  const { windowDimensions } = useGetElementProperty<HTMLDivElement>()
  const { data, loading }: { data: { shiftDate: ShiftDate[] } | undefined; loading: boolean } = useQuery(
    shiftDateQuery(selectedYear, selectedMonth, userId)
  )
  const navigateConfirm = async ({ isUpdate }: { isUpdate?: boolean }) => {
    await setRecoilShiftDate({ year: selectedYear, month: selectedMonth })
    isUpdate ? setRecoilCreateUpdateId({ shiftDateId: data?.shiftDate[0].id }) : setRecoilCreateUpdateId(undefined)
    navigate("/create/confirm")
  }

  // 未保存シフトフラグが立っていれば確認モーダル表示
  useEffect(() => {
    recoilNotCompleted && !navState?.notOpenModal && setConfirmModalOpen(true)
  }, [])

  // 未保存シフト削除
  const trashTemporarilyShift = () => {
    resetCreate()
    setConfirmModalOpen(false)
    setOpen(false)
  }

  return (
    <div>
      <p className="m-2 text-[#555]">作成するシフトの年月を選択し、「各項目確認」ボタンをクリックしてください。</p>
      <DateSelect selectedYear={selectedYear} setYear={setYear} selectedMonth={selectedMonth} setMonth={setMonth} />
      <div className="w-full flex justify-end mt-5">
        {loading ? (
          <Button text="データ取得中" disabled />
        ) : (
          <Button
            text="各項目確認"
            onClick={() => (data && data.shiftDate.length > 0 ? setOpen(true) : navigateConfirm({ isUpdate: false }))}
          />
        )}
      </div>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <div>
          <h1 className="font-bold text-lg mb-2">選択した年月のシフトは既に作成されていますがよろしいですか？</h1>
          <p>作成済のシフトを編集・複製して編集することも可能です</p>

          <div className="mt-6 mb-2 flex justify-around">
            {windowDimensions?.width < 640 ? (
              <>
                <Button text="作成済シフト確認" onClick={() => navigate(`/shift/${selectedYear}.${selectedMonth}`)} customWidth="120px" />
                <Button text="シフト新規作成" onClick={() => navigateConfirm({ isUpdate: true })} color="secondary" customWidth="120px" />
              </>
            ) : (
              <>
                <Button text="作成済シフト確認" onClick={() => navigate(`/shift/${selectedYear}.${selectedMonth}`)} />
                <Button text="シフト新規作成" onClick={() => navigateConfirm({ isUpdate: true })} color="secondary" />
              </>
            )}
          </div>
        </div>
      </Modal>
      <Modal isOpen={isConfirmModalOpen} setOpen={setConfirmModalOpen} onCloseFunc={trashTemporarilyShift}>
        <div className="w-full justify-center flex flex-col items-center">
          <h1 className="font-bold text-lg mb-2">作成途中のシフトがあります。</h1>
          <p>作成作業を再開しますか？</p>
          <div className="w-full flex justify-around mt-2">
            <Button text="新規作成" variant="outlined" onClick={trashTemporarilyShift} />
            <Button
              text="作成再開"
              onClick={() => {
                setRecoilNotCompleted(false)
                navigate("/create/automation", { state: { ...recoilCreateState } })
                setOpen(false)
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
