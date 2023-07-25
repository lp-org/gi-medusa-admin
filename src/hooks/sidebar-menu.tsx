import { useMemo } from "react"
import CartIcon from "../components/fundamentals/icons/cart-icon"
import { useIsPermission } from "./use-is-permission"
import TagIcon from "../components/fundamentals/icons/tag-icon"
import { useFeatureFlag } from "../providers/feature-flag-provider"
import SwatchIcon from "../components/fundamentals/icons/swatch-icon"
import BuildingsIcon from "../components/fundamentals/icons/buildings-icon"
import SaleIcon from "../components/fundamentals/icons/sale-icon"
import CashIcon from "../components/fundamentals/icons/cash-icon"
import GearIcon from "../components/fundamentals/icons/gear-icon"
import GiftIcon from "../components/fundamentals/icons/gift-icon"
import FileIcon from "../components/fundamentals/icons/file-icon"
import ChartIcon from "../components/fundamentals/icons/chart-icon"
const ICON_SIZE = 20
export const sidebarMenu = () => {
  const isPermissionEnabled = useIsPermission()
  const { isFeatureEnabled } = useFeatureFlag()
  return useMemo(() => {
    return [
      {
        pageLink: "/a/analytics",
        icon: <ChartIcon size={ICON_SIZE} />,
        text: "Analytics",
        enabled: true,
      },
      {
        pageLink: "/a/orders",
        icon: <CartIcon size={ICON_SIZE} />,
        text: "Orders",
        enabled: isPermissionEnabled("orders.view"),
      },
      {
        pageLink: "/a/products",
        icon: <TagIcon size={ICON_SIZE} />,
        text: "Products",
        enabled: isPermissionEnabled(["products.view", "products.add"]),
      },
      {
        pageLink: "/a/product-categories",
        icon: <SwatchIcon size={ICON_SIZE} />,
        text: "Categories",
        enabled:
          isFeatureEnabled("product_categories") &&
          isPermissionEnabled(["categories.view", "categories.add"]),
      },
      {
        pageLink: "/a/customers",
        icon: <CartIcon size={ICON_SIZE} />,
        text: "Customers",
        enabled: isPermissionEnabled("customers.view"),
      },
      {
        pageLink: "/a/inventory",
        icon: <BuildingsIcon size={ICON_SIZE} />,
        text: "Inventory",
        enabled:
          isFeatureEnabled("inventoryService") &&
          isFeatureEnabled("stockLocationService"),
      },
      {
        pageLink: "/a/discounts",
        icon: <SaleIcon size={ICON_SIZE} />,
        text: "Discounts",
        enabled: isPermissionEnabled(["discounts.view", "discounts.add"]),
      },
      {
        pageLink: "/a/gift-cards",
        icon: <GiftIcon size={ICON_SIZE} />,
        text: "Gift Cards",
        enabled: isPermissionEnabled(["gift-cards.view", "gift-cards.add"]),
      },
      {
        pageLink: "/a/pricing",
        icon: <CashIcon size={ICON_SIZE} />,
        text: "Pricings",
        enabled: isPermissionEnabled(["pricings.view", "pricings.add"]),
      },
      {
        pageLink: "/a/pages",
        icon: <FileIcon size={ICON_SIZE} />,
        text: "Pages",
        enabled: isPermissionEnabled(["pages.view", "pages.add"]),
      },
      {
        pageLink: "/a/settings",
        icon: <GearIcon size={ICON_SIZE} />,
        text: "Settings",
        enabled: true,
      },
    ]
  }, [])
}
