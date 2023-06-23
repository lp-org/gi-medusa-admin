import clsx from "clsx"
import React, { ReactNode, useEffect, useImperativeHandle, useRef } from "react"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  indeterminate?: boolean
}

const Checkbox = React.forwardRef(
  (
    {
      label,
      value,
      className,
      id,
      indeterminate = false,
      ...rest
    }: CheckboxProps,
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (checkboxRef.current) {
        // priority checked first
        if (rest.checked) {
          checkboxRef.current.checked = rest.checked
          checkboxRef.current.indeterminate = false
        } else {
          checkboxRef.current.indeterminate = indeterminate
        }
      }
    }, [checkboxRef, indeterminate, rest.checked])

    useImperativeHandle(ref, () => checkboxRef.current)
    return (
      <label
        className={clsx("flex cursor-pointer items-center", className)}
        htmlFor={id}
      >
        <input
          type="checkbox"
          className="form-checkbox mr-small h-[20px] w-[20px] rounded-base border-grey-30 text-violet-60 focus:ring-0"
          value={value}
          id={id}
          {...rest}
          ref={checkboxRef}
        />
        {label}
      </label>
    )
  }
)

export default Checkbox
