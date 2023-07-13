import React from "react"
import { useForm, useWatch } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import Button from "../../fundamentals/button"

import Modal from "../../molecules/modal"
import api from "../../../services/api"
import Checkbox from "../../atoms/checkbox"

import { SliderType } from "../../../types/shared"

import FileUploadField from "../../atoms/file-upload-field"
import Input from "../../molecules/input"

type ModalProps = {
  payload?: SliderType
  handleClose: () => void
  handleSave: (data: SliderType) => void
}

const SliderModal: React.FC<ModalProps> = ({
  payload,
  handleClose,
  handleSave,
}) => {
  const notification = useNotification()

  const onSubmit = (data: SliderType) => {
    if (!data.image) {
      notification("Image is empty", "Please upload an image", "error")
      return
    }
    handleSave(data)
    handleClose()
    // mutate({ key, data })
  }

  const { control, setValue, handleSubmit, register, getValues } =
    useForm<SliderType>({
      defaultValues: payload || {
        url: "",
        image: "",
        is_active: true,
        open_new: true,
      },
    })
  const image = useWatch({
    control,
    name: "image",
  })
  return (
    <div>
      <Modal handleClose={handleClose}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Slider content</span>
          </Modal.Header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
              <FileUploadField
                placeholder="720 x 240 (3:1) recommended, up to 2MB each"
                filetypes={[
                  "image/gif",
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ]}
                onFileChosen={async (files) => {
                  if (files.length === 0) return
                  const toAppend = files.map((file) => ({
                    url: URL.createObjectURL(file),
                    name: file.name,
                    size: file.size,
                    nativeFile: file,
                    selected: false,
                  }))
                  const uploadedImgs = await api.uploads
                    .create(toAppend.map((el) => el.nativeFile))
                    .then(({ data }) => {
                      const uploaded = data.uploads.map(({ url }) => url)
                      return uploaded
                    })
                  setValue("image", uploadedImgs[0])
                }}
              />
              {image && (
                <img
                  src={image}
                  alt=""
                  className="mx-auto mt-base h-20 w-60 rounded-base object-cover object-center"
                />
              )}
              <Input
                className="mt-base"
                label="URL"
                {...register("url")}
                placeholder="https://"
              />
              <div className="flex flex-row gap-4">
                <Checkbox
                  className="mt-base"
                  label="Active"
                  {...register("is_active")}
                  placeholder=""
                />
                <Checkbox
                  className="mt-base ml-4"
                  label="Open new tab"
                  {...register("open_new")}
                  placeholder=""
                />
              </div>
            </Modal.Content>
            <Modal.Footer>
              <div className="flex h-8 w-full justify-end">
                <Button
                  variant="ghost"
                  className="mr-2 w-32 justify-center text-small"
                  size="large"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  size="large"
                  className="w-32 justify-center text-small"
                  variant="primary"
                >
                  Save
                </Button>
              </div>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default SliderModal
