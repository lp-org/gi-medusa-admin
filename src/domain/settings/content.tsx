import { Store } from "@medusajs/medusa"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import { FC, useEffect, useRef, useState } from "react"
import {
  Control,
  FieldName,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form"
import BackButton from "../../components/atoms/back-button"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import TextArea from "../../components/molecules/textarea"
import Button from "../../components/fundamentals/button"
import { DragItem, SliderType } from "../../types/shared"
import SliderModal from "../../components/organisms/slider-modal"
import api from "../../services/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import EditIcon from "../../components/fundamentals/icons/edit-icon"
import { XYCoord, useDrag, useDrop } from "react-dnd"
import type { Identifier } from "dnd-core"
import clsx from "clsx"
import GripIcon from "../../components/fundamentals/icons/grip-icon"
import FileUploadField from "../../components/atoms/file-upload-field"
import Actionables from "../../components/molecules/actionables"
import { Icon } from "@radix-ui/react-select"
import TrashIcon from "../../components/fundamentals/icons/trash-icon"
import Badge from "../../components/fundamentals/badge"
import { queryClient } from "../../constants/query-client"
import { prepareImages } from "../../utils/images"
import InputHeader from "../../components/fundamentals/input-header"
type StoreContentFormData = {
  facebook_url?: string
  instagram_url?: string
  phone_no?: string
  email?: string
  address?: string
  logo?: string
  favicon?: string
  slider?: SliderType[]
  sliderProduct?: SliderType[]
  wording_1?: string
  wording_2?: string
    wording_3?: string
  banner_1?: string
    banner_2?: string
    tiktok?: string

      shopee?: string
        whatapps?: string
          website?: string
}
const ItemTypes = {
  CARD: "card",
} 
function isVideoURL(url: string) {
  // Define an array of video file extensions to check
  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".wmv",
    ".flv",
    ".webm",
    ".3gp",
  ]

  // Extract the file extension from the URL
  const fileExtension = url.split(".").pop()

  // Check if the file extension is in the list of video extensions
  return videoExtensions.includes("." + fileExtension)
}


const StoreContent = () => {
  const { register, reset, handleSubmit, control, watch, setValue } =
    useForm<StoreContentFormData>()
  const logo = useWatch({ control, name: "logo" })
  const favicon = useWatch({ control, name: "favicon" })
    const banner_1 = useWatch({ control, name: "banner_1" })
    const banner_2 = useWatch({ control, name: "banner_2" })
  const { data } = useQuery<AxiosResponse<StoreContentFormData>>({
    queryKey: ["storeContent"],
    queryFn: api.store.content,
  })
  const { mutate } = useMutation({ mutationFn: api.store.postContent })
  const notification = useNotification()

  const handleCancel = () => {
    if (data?.data) {
      reset(data?.data)
    }
  }

  useEffect(() => {
    if (data?.data) reset(data?.data)
  }, [data?.data])

  const onSubmit = (data: StoreContentFormData) => {
    const validateFacebookUrlTemplate = validateUrl(data.facebook_url)
    const validateInstagramUrlTemplate = validateUrl(data.instagram_url)

    if (!validateFacebookUrlTemplate) {
      notification("Error", "Malformed facebook url", "error")
      return
    }

    if (!validateInstagramUrlTemplate) {
      notification("Error", "Malformed instagram url", "error")
      return
    }

    mutate(data, {
      onSuccess: () => {
        notification("Success", "Successfully updated store content", "success")
        queryClient.invalidateQueries(["storeContent"])
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className=" flex-col py-5">
      <BackButton
        path="/a/settings/"
        label="Back to settings"
        className="mb-xsmall"
      />
      <BodyCard
        events={[
          {
            label: "Save",
            type: "button",
            onClick: handleSubmit(onSubmit),
          },
          { label: "Cancel", type: "button", onClick: handleCancel },
        ]}
        title="Store Content"
        subtitle="Manage your store content"
      >
        <div className="grid grid-cols-1 gap-4 large:grid-cols-2">
          <div className="mb-large flex flex-col gap-y-xlarge">
            <div>
              <h2 className="inter-base-semibold mb-base">General</h2>
              <InputHeader label="Logo" />

              <FileUploadField
                className="h-16"
                placeholder="1:1 recommended, up to 2MB each"
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
                  const uploadedImgs = await prepareImages(toAppend)

                  setValue("logo", uploadedImgs[0].url)
                }}
              />
              <img
                src={logo}
                alt=""
                className="mx-auto mt-base w-56 rounded-base object-cover object-center"
              />
              <InputHeader label="Favicon" className="mt-base" />
              <FileUploadField
                className="h-16"
                placeholder="1:1 recommended, .ico format recommended"
                filetypes={[
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/x-icon",
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
                  const uploadedImgs = await prepareImages(toAppend)

                  setValue("favicon", uploadedImgs[0].url)
                }}
              />
              <img
                src={favicon}
                alt=""
                className="mx-auto mt-base w-24 rounded-base object-cover object-center"
              />
              <Input
                className="mt-base"
                label="Facebook URL"
                {...register("facebook_url")}
                placeholder="https://facebook.com/{your_facebook_store}"
              />

              <Input
                className="mt-base"
                label="Instagram URL"
                {...register("instagram_url")}
                placeholder="https://instagram.com/{your_facebook_store}"
              />
              <Input
                className="mt-base"
                label="Email"
                {...register("email")}
                placeholder="example@gmail.com"
              />

              <Input
                className="mt-base"
                label="Phone no"
                {...register("phone_no")}
                placeholder="012 1234567"
              />

              <TextArea
                className="mt-base"
                label="Address"
                {...register("address")}
                placeholder="Contoso Ltd, 215 E Tasman Dr, Po Box 65502, CA 95134 San Jose "
              />


              <Input
                className="mt-base"
                label="Wording 1 "
                {...register("wording_1")}
                placeholder=""
              />

               <Input
                className="mt-base"
                label="Wording 2 "
                {...register("wording_2")}
                placeholder=""
              />

                  <Input
                className="mt-base"
                label="Wording 3 (Footer)"
                {...register("wording_3")}
                placeholder=""
              />
   <InputHeader label="Banner 1" className="mt-base" />
              <FileUploadField
                className="h-16"
                placeholder="4:3 recommended, .mp4 .jpg .png format recommended (max: 2mb)"
                filetypes={[
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "video/mp4"
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
                  const uploadedImgs = await prepareImages(toAppend)

                  setValue("banner_1", uploadedImgs[0].url)
                }}
              />
              {banner_1 && isVideoURL(banner_1)?<video
                src={banner_1}
                            autoPlay
              loop
              muted
                  className="mx-auto mt-base w-56 rounded-base object-cover object-center"
              />: <img
                src={banner_1}
                alt=""
                className="mx-auto mt-base w-56 rounded-base object-cover object-center"
              />}


              <InputHeader label="Banner 2 (Footer)" className="mt-base" />
              <FileUploadField
                className="h-16"
                placeholder="4:3 recommended, .mp4 .jpg .png format recommended (max: 2mb)"
                filetypes={[
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "video/mp4"
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
                  const uploadedImgs = await prepareImages(toAppend)

                  setValue("banner_2", uploadedImgs[0].url)
                }}
              />
              {banner_2 && isVideoURL(banner_2)?<video
                src={banner_2}
                            autoPlay
              loop
              muted
                  className="mx-auto mt-base w-56 rounded-base object-cover object-center"
              />: <img
                src={banner_2}
                alt=""
                className="mx-auto mt-base w-56 rounded-base object-cover object-center"
              />}


                  <Input
                className="mt-base"
                label="Tiktok "
                {...register("tiktok")}
                placeholder=""
              />

                <Input
                className="mt-base"
                label="Shopee "
                {...register("shopee")}
                placeholder=""
              />

                <Input
                className="mt-base"
                label="Whatsapps "
                {...register("whatapps")}
                placeholder=""
              />

                <Input
                className="mt-base"
                label="Website "
                {...register("website")}
                placeholder=""
              />

            </div>
          </div>
          <div>
            <div className="">
              <h2 className="inter-base-semibold mb-base">
                Sliders (Homepage)
              </h2>
              <SliderForm control={control} name={"slider"} />
            </div>

            <div className="">
              <h2 className="inter-base-semibold mb-base">
                Sliders (Products)
              </h2>
              <SliderForm control={control} name={"slider_product"} />
            </div>
          </div>
        </div>
      </BodyCard>
    </form>
  )
}

const validateUrl = (address: string | undefined) => {
  if (!address || address === "") {
    return true
  }

  try {
    const url = new URL(address)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

const mapStoreDetails = (store: Store): StoreContentFormData => {
  return {
    name: store.name,
    swap_link_template: store.swap_link_template,
    payment_link_template: store.payment_link_template,
    invite_link_template: store.invite_link_template,
  }
}

export default StoreContent

type SliderCardProps = {
  index: number
  data: SliderType
  remove: any
  update: any
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

const SliderCard: FC<SliderCardProps> = ({
  data,
  remove,
  update,
  index,
  moveCard,
}) => {
  const [open, setOpen] = useState<SliderType>()

  const dragRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!previewRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = previewRef.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging, currentDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      currentDragging: monitor.getTargetIds(),
    }),
  })
  drag(dragRef)
  drop(preview(previewRef))
  return (
    <div>
      <div
        ref={previewRef}
        className={clsx("my-4 flex w-full gap-4 rounded-base bg-gray-200 p-4", {
          "opacity-50": currentDragging.includes(handlerId || ""),
        })}
        data-handler-id={handlerId}
      >
        <div
          ref={dragRef}
          className="flex cursor-move items-center justify-center text-grey-40"
        >
          <GripIcon size={20} />
        </div>
        <img
          src={data.image}
          className="h-16 w-48 rounded-base object-cover object-center"
        />
        <div className="flex min-w-0 flex-col">
          <div className="flex items-end gap-4">
            <Badge variant={data.is_active ? "default" : "danger"}>
              {data.is_active ? "Active" : "Disabled"}
            </Badge>
            {data.open_new && <Badge variant={"default"}>{"New tab"}</Badge>}
          </div>
        </div>

        <div className="ml-auto">
          <Actionables
            actions={[
              {
                label: "Edit",
                icon: <EditIcon />,
                onClick: () => setOpen(data),
              },
              {
                label: "Delete",
                icon: <TrashIcon />,
                onClick: () => remove(index),
              },
            ]}
          ></Actionables>
        </div>

        <div></div>
      </div>

      {open && (
        <SliderModal
          payload={open}
          handleClose={() => setOpen(undefined)}
          handleSave={(value) => {
            update(index, value)
          }}
        />
      )}
    </div>
  )
}

const SliderForm = ({
  control,
  name,
}: {
  control: Control<StoreContentFormData>
  name: any
}) => {
  const { append, update, swap, remove } = useFieldArray({
    control,
    name,
  })

  const [contentSliderModal, setContentSliderModal] = useState(false)
  const slider = useWatch({ control, name })

  return (
    <>
      <div className="flex flex-row">
        <Button
          className="ml-auto"
          size="small"
          variant="secondary"
          type="button"
          onClick={() => setContentSliderModal(true)}
        >
          + Add new slider
        </Button>
      </div>

      <div className="mb-4 flex flex-col">
        {slider?.map((el, i) => (
          <SliderCard
            key={i}
            index={i}
            data={el}
            remove={remove}
            update={update}
            moveCard={swap}
          />
        ))}
      </div>
      {contentSliderModal && (
        <SliderModal
          handleSave={append}
          handleClose={() => setContentSliderModal(false)}
        />
      )}
    </>
  )
}
