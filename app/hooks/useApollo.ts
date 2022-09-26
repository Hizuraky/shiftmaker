/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import type { DocumentNode } from "@apollo/client"
import toast from "react-hot-toast"
import { useLoadRecoil } from "app/hooks/useRecoil"
import { useMutation as useApolloMutation, useQuery as useApolloQuery } from "@apollo/client"
import { useNavigate } from "@remix-run/react"
import { useGQLErrorRecoil } from "app/hooks/useRecoil"

/***
 * graphQLのcustomHooks
 */

type Props = {
  mutation: DocumentNode
  successMessage?: string
  callback?: any
  isBackNav?: boolean
}

export const useMutation = ({ mutation, successMessage, callback, isBackNav = false }: Props) => {
  const { setRecoilLoad } = useLoadRecoil()
  const navigate = useNavigate()
  const [mutationFunc, { data, loading, error }] = useApolloMutation(mutation)

  useEffect(() => {
    console.log("!!>>>MUTATION_ERROR>>>!!", error)
    error && toast.error("システムエラーが発生しました")
  }, [error])

  useEffect(() => {
    console.log("||>>>MUTATION_DATA >>>||", data)

    if (data) {
      toast.success(successMessage ?? "データが保存されました")
      isBackNav ? navigate(-1) : callback()
    }
  }, [data])

  useEffect(() => {
    loading ? setRecoilLoad(true) : setRecoilLoad(false)
  }, [loading])

  return mutationFunc
}

export const useQuery = (query: DocumentNode) => {
  const { data, loading, error: queryError } = useApolloQuery(query)
  const { recoilGQLerror, setRecoilGQLError } = useGQLErrorRecoil()

  useEffect(() => {
    console.log("!!>>>QUERY_ERROR>>>!!", queryError)
    const NoToastErrs = ["Could not verify JWT: JWTExpired", "claims key: 'https://hasura.io/jwt/claims' not found"]
    queryError && !NoToastErrs.includes(queryError.message) && toast.error("データの取得に失敗しました。")
    !recoilGQLerror && setRecoilGQLError(queryError?.message)
  }, [queryError])

  useEffect(() => {
    console.log("||>>>QUERY_DATA >>>||", data)
  }, [data])

  return { data, loading, queryError }
}
