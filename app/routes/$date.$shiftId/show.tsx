import { useNavigate, useParams, useLocation } from "@remix-run/react"
import { useState } from "react"
import { ShiftsConfirmTable } from "app/components/table/ShiftsConfirmTable"
import { shiftDetailQuery } from "app/graphql/query"
import { Title } from "app/components/Title"
import { Button, Modal } from "app/components/common"
import { PartSpinner } from "app/components/Spinner"
import { TableSizeButtons } from "app/components/TableSizeButtons"
import { useMutation, useQuery } from "app/hooks/useApollo"
import { deleteShift, deleteShiftDate } from "app/graphql/mutation"
import { useShiftCreateRecoil, useShiftEditRecoil } from "app/hooks/useRecoil"
import ExcelJS from "exceljs"
import type { ShiftDate, Shift } from "app/utils/types"

/***
 * 作成済シフト確認画面
 */

export default function Index() {
  const navigate = useNavigate()
  const { date, shiftId } = useParams()
  const navState = useLocation().state as { shift: Shift; shifts: ShiftDate; isCopy?: boolean }
  const [tableSize, setTableSize] = useState(new Date(Number(date?.split(".")[0]), Number(date?.split(".")[1]), 0).getDate())
  const [isOpen, setOpen] = useState(false)
  const { data }: { data: { shift: Shift[] } | undefined } = useQuery(shiftDetailQuery(Number(shiftId)))
  const { setRecoilShiftDate, setRecoilEmployeeWorkingTime } = useShiftCreateRecoil()
  const { setRecoilEditUpdateId } = useShiftEditRecoil()
  const year = Number(date?.split(".")[0])
  const month = Number(date?.split(".")[1])
  const shifts: { employee: number | undefined; workIds: (number | undefined)[] }[] | undefined =
    data?.shift &&
    data.shift[0].shiftEmployees?.map((employee) => {
      return { employee: employee.id, workIds: [...employee.workIds!.map((v) => Number(v))] }
    })

  const mutation = useMutation({
    mutation: navState?.shifts?.shifts?.length > 1 ? deleteShift : deleteShiftDate,
    successMessage: "シフトを削除しました。",
    callback: () => navigate("/shift")
  })

  const onDeleteShift = () => {
    setOpen(false)
    mutation({ variables: navState?.shifts?.shifts?.length > 1 ? { shiftId: shiftId } : { shiftDateId: navState?.shifts?.id } })
  }

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    workbook.addWorksheet("シフト表")
    const sheet = workbook.getWorksheet("シフト表")
    sheet.properties.defaultRowHeight = 18

    const workingTimes = data?.shift[0].shiftWorkingTimes
    const employees = data?.shift[0].shiftEmployees
    const options = workingTimes
      ? [
          ...workingTimes.map((v) => {
            return { value: v.id, label: v.timeName }
          }),
          { value: 91, label: "明休" },
          { value: 92, label: "休" },
          { value: 93, label: "希望休" },
          { value: 94, label: "有給" }
        ]
      : []

    const WeekDay = ({ day }: { day: number }) => {
      return ["日", "月", "火", "水", "木", "金", "土"][new Date(year, month - 1, day).getDay()]
    }

    sheet.columns = [
      { header: `${year}年${month}月`, key: "従業員名", width: 16 },
      ...[...Array(new Date(year, month, 0).getDate())].map((_, i) => {
        return { header: `${i + 1}日(${WeekDay({ day: i + 1 })})`, key: `${i + 1}日(${WeekDay({ day: i + 1 })})`, width: 8 }
      }),
      ...options!.map((workingTime) => {
        return { header: workingTime.label, key: workingTime.label, width: 8 }
      })
    ]
    sheet.addRows([
      ...shifts!.map((shift) => {
        return {
          従業員名: employees?.find((employee) => shift.employee === employee.id)?.name,
          ...Object.assign(
            {},
            ...[...Array(new Date(year, month, 0).getDate())].map((_, i) => ({
              [`${i + 1}日(${WeekDay({ day: i + 1 })})`]: options.find((shiftWorkingTime) => shiftWorkingTime.value === shift.workIds[i])
                ?.label
            }))
          ),
          ...Object.assign(
            {},
            ...options!.map((workingTime) => ({
              [workingTime.label]: shift.workIds.filter((workId) => workingTime.value === workId).length
            }))
          )
        }
      }),
      ...workingTimes!.map((workingTime) => {
        return {
          従業員名: workingTime.timeName,
          ...Object.assign(
            {},
            ...[...Array(new Date(year, month, 0).getDate())].map((_, i) => {
              let workNum = 0
              shifts?.forEach((shift) => shift.workIds.forEach((workId, ii) => i === ii && workId === workingTime.id && workNum++))
              return {
                [`${i + 1}日(${WeekDay({ day: i + 1 })})`]: workNum
              }
            })
          )
        }
      })
    ])

    const borders = {
      base: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
      top: { top: { style: "thick" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
      bottom: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thick" }, right: { style: "thin" } },
      leftRight: { top: { style: "thin" }, left: { style: "thick" }, bottom: { style: "thin" }, right: { style: "thick" } },
      bottomLeftRight: { top: { style: "thin" }, left: { style: "thick" }, bottom: { style: "thick" }, right: { style: "thick" } },
      topLeftRight: { top: { style: "thick" }, left: { style: "thick" }, bottom: { style: "thin" }, right: { style: "thick" } }
    }
    const employeeFillStyle = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "fff0f9f8" }
    }
    const workingTimeFillStyle = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "fffff8f9" }
    }

    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell: any, colNumber) => {
        if (rowNumber === 1 || rowNumber === 2) {
          cell.border = colNumber === 1 ? borders.topLeftRight : borders.top
        } else if (rowNumber - 1 === employees?.length) {
          cell.border = colNumber === 1 ? borders.bottomLeftRight : borders.bottom
        } else {
          cell.border = colNumber === 1 ? borders.leftRight : borders.base
        }
        cell.font = colNumber === 1 || rowNumber === 1 ? { bold: true } : {}
        if (rowNumber % 2 === 0 && (colNumber > new Date(year, month, 0).getDate() + 1 || rowNumber > employees!.length + 1)) {
          cell.fill = workingTimeFillStyle
        } else if (rowNumber % 2 === 0) {
          cell.fill = employeeFillStyle
        }
        cell.alignment = { vertical: "middle", horizontal: "center" }
      })
      row.commit()
    })

    const uint8Array = await workbook.xlsx.writeBuffer()
    const blob = new Blob([uint8Array], { type: "application/octet-binary" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${year}${month}_${data?.shift[0].shiftName}.xlsx`
    a.click()
    a.remove()
  }

  return (
    <>
      <Title
        currentText={navState?.shift.shiftName!}
        previous={[
          { text: "作成シフト一覧", rootPath: "/shift" },
          { text: `${year}年${month}月`, rootPath: `/shift/${date}` }
        ]}
      />
      <PartSpinner isLoad={!data?.shift}>
        <>
          {shifts ? (
            <div className="p-2 rounded-md shadow-md border">
              <div className="flex items-center w-full justify-between mb-2">
                <div className="sm:hidden">
                  <TableSizeButtons tableSize={tableSize} setTableSize={setTableSize} date={{ year: year, month: month }} />
                </div>
                <div className="flex items-center">
                  {navState?.shift.isCompleted ? (
                    <>
                      <Button
                        text="編集"
                        onClick={() => navigate(`/${date}/${shiftId}/edit`, { state: { shift: data?.shift[0] } })}
                        width="sm"
                      />
                      <div className="mr-2" />
                      <Button
                        width="md"
                        text="複製編集"
                        onClick={() => navigate(`/${date}/${shiftId}/edit`, { state: { shift: data?.shift[0], isCopy: true } })}
                      />
                      <div className="mr-2" />
                      <Button width="md" text="エクセル出力" onClick={exportExcel} />
                    </>
                  ) : (
                    <Button
                      width="sm"
                      text="作成再開"
                      onClick={() => {
                        setRecoilEmployeeWorkingTime({
                          employees: data?.shift[0].shiftEmployees!,
                          workingTimes: data?.shift[0].shiftWorkingTimes!
                        })
                        setRecoilShiftDate({ year: year, month: month })
                        setRecoilEditUpdateId({ shiftId: data?.shift[0].id, shiftDateId: data?.shift[0].shiftDateId })
                        navigate(`/create/automation`, { state: { shifts: shifts, isTemporarily: true } })
                      }}
                    />
                  )}
                  <div className="mr-2" />
                  <Button width="sm" text="削除" onClick={() => setOpen(true)} color="secondary" />
                </div>
              </div>
              <ShiftsConfirmTable
                tableSize={tableSize}
                shifts={shifts}
                year={year}
                month={month}
                employees={data?.shift[0].shiftEmployees}
                workingTimes={data?.shift[0].shiftWorkingTimes}
              />
            </div>
          ) : (
            <p>表示できるデータがありません。</p>
          )}
        </>
      </PartSpinner>
      <Modal isOpen={isOpen} setOpen={setOpen}>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold mb-4">シフトを削除しますがよろしいですか？</h1>
          <div className="flex justify-around w-full">
            <Button text="キャンセル" color="secondary" onClick={() => setOpen(false)} variant="outlined" />
            <Button text="削除" color="secondary" onClick={onDeleteShift} />
          </div>
        </div>
      </Modal>
    </>
  )
}
