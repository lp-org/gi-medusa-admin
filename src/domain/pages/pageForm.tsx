import { Controller, useForm, useWatch } from "react-hook-form"
import BodyCard from "../../components/organisms/body-card"

import Input from "../../components/molecules/input"
import TextArea from "../../components/molecules/textarea"
import InputHeader from "../../components/fundamentals/input-header"
import "quill-image-uploader/dist/quill.imageUploader.min.css"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"
import ImageUploader from "quill-image-uploader"
import api from "../../services/api"
import { FC, useEffect, useMemo } from "react"
import Checkbox from "../../components/atoms/checkbox"
import Switch from "../../components/atoms/switch"
import { useMutation } from "@tanstack/react-query"
import useNotification from "../../hooks/use-notification"
import { queryClient } from "../../constants/query-client"
import { getErrorMessage } from "../../utils/error-messages"
import { PagesType } from "../../types/shared"
import { useNavigate } from "react-router-dom"
import FocusModal from "../../components/molecules/modal/focus-modal"
import FormHeader from "../pricing/pricing-form/form-header"
import Button from "../../components/fundamentals/button"
import CrossIcon from "../../components/fundamentals/icons/cross-icon"

function convertTitleToUrl(title) {
  if (!title) return
  // Remove special characters and convert to lowercase
  var url = title.replace(/[^\w\s]/gi, "").toLowerCase()

  // Replace spaces with hyphens or underscores
  url = url.replace(/\s+/g, "-") // Use hyphens ("-")
  // url = url.replace(/\s+/g, '_'); // Use underscores ("_")

  return url
}

// #2 register module
Quill.register("modules/imageUploader", ImageUploader)
// type PagesFormData = {
//   title?: string
//   handle?: string
//   description?: string
//   body?: string
//   publish?: string
// }
type PageFormProps = {
  payloadData?: PagesType
}
const PageForm: FC<PageFormProps> = ({ payloadData }) => {
  const notification = useNotification()
  const navigate = useNavigate()
  const { register, reset, handleSubmit, control, watch, setValue } =
    useForm<PagesType>({})
  const modules = useMemo(() => {
    return {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
      imageUploader: {
        upload: (file) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append("image", file)

            api.uploads.create([file]).then(({ data }) => {
              const uploaded = data.uploads.map(({ url }) => url)
              console.log(uploaded[0])
              resolve(uploaded[0])
            })
          })
        },
      },
    }
  }, [])
  useEffect(() => {
    if (payloadData) {
      reset(payloadData)
    }
  }, [payloadData])
  const { mutate } = useMutation({
    mutationFn: payloadData ? api.pages.update : api.pages.add,
    onSuccess: () => {
      notification(
        "Success",
        payloadData ? `Page updated` : `Page added`,
        "success"
      )
      queryClient.invalidateQueries({ queryKey: ["pageList"] })
      payloadData?.id &&
        queryClient.invalidateQueries({ queryKey: ["page", payloadData.id] })
      navigate("/a/pages")
    },
    onError: (error) => {
      notification("Error", getErrorMessage(error), "error")
    },
  })
  const onSubmit = (data: PagesType) => {
    const { id, ...payload } = data
    payloadData
      ? mutate({
          id,
          data: {
            title: data.title,
            handle: data.handle,
            description: data.description,
            body: data.body,
            publish: data.publish,
          },
        })
      : mutate(data)
  }
  const title = useWatch({ control, name: "title" })
  useEffect(() => {
    setValue("handle", convertTitleToUrl(title))
  }, [title])

  const handleCancel = () => {
    if (payloadData) reset(payloadData)
  }
  return (
    <form>
      <FocusModal>
        <FocusModal.Header>
          <div className="flex w-full justify-between px-8 medium:w-8/12">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={() => navigate("/a/pages")}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="flex gap-x-small">
              {payloadData && (
                <Button
                  size="small"
                  variant="ghost"
                  type="button"
                  onClick={handleCancel}
                >
                  Reset
                </Button>
              )}
              <Controller
                name="publish"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <div className="flex flex-row items-center">
                      <InputHeader label="Publish" className="mr-2 w-auto" />
                      <Switch
                        checked={value}
                        onCheckedChange={onChange}
                        className="w-full"
                      />
                    </div>
                  )
                }}
              />
              <Button
                size="small"
                variant="primary"
                type="button"
                onClick={handleSubmit(onSubmit)}
              >
                Save page
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="no-scrollbar flex w-full justify-center">
          <div className="my-16 max-w-[700px] small:w-4/5 medium:w-7/12 large:w-6/12">
            <Input
              className="mt-base"
              label="Title"
              {...register("title")}
              placeholder="Terms of use"
              required
            />
            <Input
              className="mt-base"
              label="Handle"
              {...register("handle")}
              placeholder="terms-of-use"
            />

            <TextArea
              className="mt-base"
              label="Description"
              {...register("description")}
              placeholder="This will show in the meta description"
            />

            <div className="mt-base mb-32 w-full rounded">
              <InputHeader label="Body" />
              <Controller
                control={control}
                name="body"
                render={({ field }) => (
                  <ReactQuill
                    className="h-72"
                    modules={modules}
                    theme="snow"
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                  />
                )}
              ></Controller>
            </div>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

export default PageForm
