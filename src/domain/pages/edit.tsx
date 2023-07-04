import React from "react"
import PageForm from "./pageForm"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "../../services/api"
import BackButton from "../../components/atoms/back-button"

const Edit = () => {
  const { id } = useParams()
  console.log(id)
  const { data } = useQuery({
    queryFn: () => api.pages.get(id),
    queryKey: ["page", id],
  })
  return (
    <>
      <BackButton label="Back to Pages" path="/a/pages" className="mb-xsmall" />
      <PageForm payloadData={data?.data} />
    </>
  )
}

export default Edit
