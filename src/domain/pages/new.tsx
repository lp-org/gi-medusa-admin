import React from "react"
import PageForm from "./pageForm"
import BackButton from "../../components/atoms/back-button"

const New = () => {
  return (
    <>
      <BackButton label="Back to Pages" path="/a/pages" className="mb-xsmall" />
      <PageForm />
    </>
  )
}

export default New
