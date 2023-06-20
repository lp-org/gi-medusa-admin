import { useCallback } from "react"
import { useAppStore } from "../store"

export const useIsPermission = () => {
  const permissions = useAppStore((state) => state.permissions)
  return useCallback(
    (permission: string) => {
      return permissions.includes(permission)
    },
    [permissions]
  )
}
