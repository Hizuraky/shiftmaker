import { useLocation, useNavigate, useLoaderData, Link } from "@remix-run/react"
import { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useUserRecoil } from "app/hooks/useRecoil"
import { ApolloProvider } from "@apollo/client"
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { DefaultLayout } from "app/components/layouts/DefaultLayout"
import { useGQLErrorRecoil } from "app/hooks/useRecoil"
import { inUserRoute, inGuestRoute, generalRoute } from "app/utils/route"
import { Spinner } from "app/components/Spinner"

/***
 * 認証・通信関連ラッパー
 */

export const CustomProvider = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { recoilUser, setRecoilUser } = useUserRecoil()
  const auth = getAuth()
  const [idToken, setIdToken] = useState("")
  const { recoilGQLerror, setRecoilGQLError } = useGQLErrorRecoil()

  // Hasura設定
  const { env } = useLoaderData()
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${idToken}`
      }
    }
  })
  const httpLink = createHttpLink({
    uri: env.HASURA_URL
  })
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  })

  // ログイン判定
  useEffect(() => {
    onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        !idToken && setIdToken(await userInfo.getIdToken())
        !recoilUser &&
          setRecoilUser({ uid: userInfo.uid, name: userInfo.displayName, email: userInfo.email, createdAt: userInfo.metadata.creationTime })
        inGuestRoute(pathname) && navigate("/shift")
      } else {
        setRecoilUser(undefined)
        inUserRoute(pathname) && navigate("/login", { state: { isRedirect: true } })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // カスタムクレームがトークンに含まれない場合はトークンをフォースリフレッシュ
  useEffect(() => {
    if (recoilGQLerror === "claims key: 'https://hasura.io/jwt/claims' not found") {
      auth.currentUser?.getIdToken(true).then((token) => {
        setIdToken(token)
        setRecoilGQLError(undefined)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoilGQLerror])

  // 未ログイン状態でユーザーページ、ログイン状態でゲストページは開けないように制御
  if ((recoilUser && inUserRoute(pathname)) || (!recoilUser && inGuestRoute(pathname))) {
    return (
      <DefaultLayout>
        <>
          <ApolloProvider client={client}>{children}</ApolloProvider>
          {generalRoute.map((path) => (
            <Link to={path} key={path} prefetch="render">
              <div className="hidden" />
            </Link>
          ))}
        </>
      </DefaultLayout>
    )
  }
  return <Spinner isLoad />
}
