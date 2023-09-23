import { useAdminStore } from "medusa-react"
import React, { useMemo, useState } from "react"

import { useTranslation } from "react-i18next"

import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { useRoutes } from "../../../providers/route-provider"
import BuildingsIcon from "../../fundamentals/icons/buildings-icon"
import CartIcon from "../../fundamentals/icons/cart-icon"
import CashIcon from "../../fundamentals/icons/cash-icon"
import GearIcon from "../../fundamentals/icons/gear-icon"
import GiftIcon from "../../fundamentals/icons/gift-icon"
import SaleIcon from "../../fundamentals/icons/sale-icon"
import SquaresPlus from "../../fundamentals/icons/squares-plus"
import SwatchIcon from "../../fundamentals/icons/swatch-icon"
import TagIcon from "../../fundamentals/icons/tag-icon"
import UsersIcon from "../../fundamentals/icons/users-icon"
import SidebarMenuItem from "../../molecules/sidebar-menu-item"
import UserMenu from "../../molecules/user-menu"
import { useIsPermission } from "../../../hooks/use-is-permission"
import { sidebarMenu } from "../../../hooks/sidebar-menu"

const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)

  const { store } = useAdminStore()

  const { getLinks } = useRoutes()

  const triggerHandler = () => {
    const id = triggerHandler.id++
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    }
  }
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0

  const list = sidebarMenu()

  return (
    <div className="bg-gray-0 h-screen min-w-sidebar max-w-sidebar overflow-y-auto border-r border-grey-20 py-base px-base">
      <div className="h-full">
        <div className="flex justify-between px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-circle border border-solid border-gray-300">
            <UserMenu />
          </div>
        </div>
        <div className="my-base flex flex-col px-2">
          <span className="text-grey-50 text-small font-medium">
            {t("sidebar-store", "Store")}
          </span>
          <span className="text-grey-90 text-medium font-medium">
            {store?.name}
          </span>
        </div>
        <div className="py-3.5">
          {list
            .filter((el) => el.enabled)
            .map((el) => (
              <SidebarMenuItem
                key={el.text}
                pageLink={el.pageLink}
                icon={el.icon}
                triggerHandler={triggerHandler}
                text={el.text}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
