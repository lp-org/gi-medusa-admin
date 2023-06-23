import { useCallback } from "react"
import { useAppStore } from "../store"

export const useIsPermission = () => {
  const permissions = useAppStore((state) => state.permissions)

  return useCallback(
    (permission: string | string[]) => {
      return typeof permission === 'string' ? permissions.includes(permission): permission.some((el)=>permissions.includes(el))
    },
    [permissions]
  )
}
