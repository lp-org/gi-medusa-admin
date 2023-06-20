import { useAdminGetSession } from "medusa-react"
import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../atoms/spinner"
import { useAppStore } from "../../store"

type PrivateRouteProps = {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAdminGetSession()
  const setPermissions = useAppStore((state) => state.setPermissions)

  const navigate = useNavigate()
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  if (user && !isLoading) {
    setPermissions(user?.teamRole?.permissions)
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner variant="secondary" />
    </div>
  )
}

export default PrivateRoute
