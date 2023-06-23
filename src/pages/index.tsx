import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/atoms/spinner"
import SEO from "../components/seo"
import { sidebarMenu } from "../hooks/sidebar-menu"

const IndexPage = () => {
  const navigate = useNavigate()
  const list = sidebarMenu()
  useEffect(() => {
    navigate(list.filter((el) => el.enabled)[0].pageLink)
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-grey-5 text-grey-90">
      <SEO title="Home" />
      <Spinner variant="secondary" />
    </div>
  )
}

export default IndexPage
