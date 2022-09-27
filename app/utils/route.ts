// 各画面のpathname

export const inUserRoute = (pathname: string) => {
  const route = ["/create/date", "/create/confirm", "/create/automation", "/workingTime", "/mypage"]
  return route.includes(pathname) || pathname.startsWith("/shift") || pathname.endsWith("/show") || pathname.endsWith("/edit")
}

export const inGuestRoute = (pathname: string) => {
  const route = ["/", "/login", "/register"]
  return route.includes(pathname)
}

export const generalRoute = [
  "/shift",
  "/shift/$date",
  "/create/date",
  "/create/confirm",
  "/create/automation",
  "/workingTime",
  "/mypage",
  "/$date/$shiftId/show",
  "/$date/$shiftId/edit",
  "/manual",
  "/policy",
  "/terms"
]
