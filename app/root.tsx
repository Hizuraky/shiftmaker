import type { MetaFunction } from "@remix-run/node"
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react"
import type { LinksFunction } from "@remix-run/node"
import styles from "~/styles/generated.css"
import { RecoilRoot } from "recoil"
import { Toaster } from "react-hot-toast"
import { RootSpinner } from "app/components/Spinner"
import { CustomProvider } from "~/components/CustomProvider"
import { initializeApp, getApp } from "firebase/app"
import { NotFound } from "app/components/NotFound"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Shift maker",
  viewport: "width=device-width,initial-scale=1"
})

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    type: "text/css",
    href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
  },
  {
    rel: "stylesheet",
    type: "text/css",
    charSet: "UTF-8",
    href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
  }
]

export async function loader() {
  return process.env
    ? {
        env: {
          API_KEY: process.env.API_KEY,
          AUTH_DOMAIN: process.env.AUTH_DOMAIN,
          PROJECT_ID: process.env.PROJECT_ID,
          STORAGE_BUCKET: process.env.STORAGE_BUCKET,
          MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
          APP_ID: process.env.APP_ID,
          HASURA_URL: process.env.HASURA_URL,
          HASURA_KEY: process.env.HASURA_KEY,
          ENVIRONMENT: process.env.ENVIRONMENT
        }
      }
    : null
}

export function CatchBoundary() {
  return (
    <html>
      <head>
        <title>ページが見つかりません。</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NotFound />
        <Scripts />
      </body>
    </html>
  )
}

const initializeFirebase = (config: any) => {
  let app
  try {
    app = getApp()
  } catch (e) {
    app = initializeApp(config)
  }
  return app
}

export default function Root() {
  const { env } = useLoaderData()
  initializeFirebase({
    apiKey: env.API_KEY,
    authDomain: env.AUTH_DOMAIN,
    projectId: env.PROJECT_ID,
    storageBucket: env.STORAGE_BUCKET,
    messagingSenderId: env.MESSAGING_SENDER_ID,
    appId: env.APP_ID
  })

  type consoleType = "log" | "debug" | "warn" | "error"
  const consoleKey: consoleType[] = env.ENVIRONMENT === "PRODUCT" ? ["warn", "error", "log", "debug"] : ["debug", "warn", "error"]
  consoleKey.forEach((key: consoleType) => {
    console[key] = () => {}
  })
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <RecoilRoot>
          <RootSpinner />
          <CustomProvider>
            <Outlet />
          </CustomProvider>
        </RecoilRoot>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
      </body>
    </html>
  )
}
