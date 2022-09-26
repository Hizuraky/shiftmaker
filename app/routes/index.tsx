import { Outlet, useNavigate } from "@remix-run/react"
import { useEffect } from "react"

export default function Index() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/shift")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Outlet />
}
