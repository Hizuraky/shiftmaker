import { useUserRecoil, useShiftCreateRecoil, useShiftEditRecoil } from "app/hooks/useRecoil"
import { mutationShift, mutationShiftDate, updateShift } from "app/graphql/mutation"
import { useMutation } from "app/hooks/useApollo"
import { useNavigate, useParams } from "@remix-run/react"
import type { DocumentNode } from "graphql"

/***
 * シフト作成mutation関連のHooks
 */

type Props = {
  shifts: { employee: number | undefined; workIds: (number | undefined)[] }[]
  employees?: any
  workingTimes?: any
  shiftInfo: {
    isCompleted?: boolean
    isEdit?: boolean
    isTemporarily?: boolean
    isFirstDateShift?: boolean
    shiftName: string
    createdAt?: string | Date
    updatedAt?: string | Date | null
  }
}

export const useMutationShift = ({ shifts, shiftInfo, employees, workingTimes }: Props) => {
  const navigate = useNavigate()
  const { date: shiftDate } = useParams()
  const { recoilEmployeeWorkingTime, recoilShiftDate, recoilCreateShiftId, resetCreate } = useShiftCreateRecoil()
  const { recoilEditShiftId, setRecoilEditUpdateId } = useShiftEditRecoil()
  const { recoilUser } = useUserRecoil()

  const shiftEmployees = employees ?? (recoilEmployeeWorkingTime && [...recoilEmployeeWorkingTime.employees])
  const shiftWorkingTimes = workingTimes ?? (recoilEmployeeWorkingTime && [...recoilEmployeeWorkingTime.workingTimes])

  let shiftVariable: any = {
    shiftName: shiftInfo.shiftName,
    isCompleted: shiftInfo.isCompleted,
    createdAt: shiftInfo.createdAt ?? new Date(),
    updatedAt: shiftInfo.updatedAt ?? null,
    shiftWorkingTimes: {
      data: shiftWorkingTimes && [
        ...shiftWorkingTimes.map((v: any) => {
          const obj = { ...v }
          delete obj.__typename
          delete obj.userId
          return {
            ...obj
          }
        })
      ]
    },
    shiftEmployees: {
      data: shiftEmployees && [
        ...shiftEmployees.map((v: any) => {
          const obj = { ...v }
          delete obj.id
          delete obj.userId
          let workIds = shifts.find((shift) => shift.employee === v.id)?.workIds?.map((id, i) => id ?? 0)
          return {
            name: v.name,
            canWorkingIds: ((array) => `{${array.join(",")}}`)(v.canWorkingIds),
            workIds: ((array) => `{${array?.join(",")}}`)(workIds)
          }
        })
      ]
    }
  }

  let shiftDateVariable = {
    shiftDate: {
      userId: recoilUser?.uid,
      year: recoilShiftDate?.year,
      month: recoilShiftDate?.month,
      shifts: { data: [shiftVariable] }
    }
  }

  let mutationDocumentNode: DocumentNode
  let variables: any

  if (shiftInfo?.isEdit) {
    mutationDocumentNode = updateShift
    variables = {
      shift: { ...shiftVariable, shiftDateId: recoilEditShiftId?.shiftDateId },
      shiftId: recoilEditShiftId?.shiftId
    }
  } else if (shiftInfo?.isFirstDateShift) {
    mutationDocumentNode = mutationShiftDate
    variables = shiftDateVariable
  } else {
    mutationDocumentNode = mutationShift
    variables = { shift: { ...shiftVariable, shiftDateId: recoilCreateShiftId?.shiftDateId } }
  }

  const mutation = useMutation({
    mutation: mutationDocumentNode,
    successMessage: "入力情報を保存しました",
    callback: () => {
      if (shiftInfo.isTemporarily) {
        // 一時保存再開
        navigate(`/shift/${recoilShiftDate?.year}.${recoilShiftDate?.month}`)
        setRecoilEditUpdateId(undefined)
        resetCreate()
      } else if (shiftInfo?.isEdit) {
        // 編集 or 複製編集
        setRecoilEditUpdateId(undefined)
        navigate(`/shift/${shiftDate}`)
      } else {
        // 新規作成
        navigate(`/shift/${recoilShiftDate?.year}.${recoilShiftDate?.month}`)
        resetCreate()
      }
    }
  })

  const mutationShifts = () => {
    mutation({
      variables: variables
    })
  }

  return mutationShifts
}
