"use client";
import React from "react";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input = (props: InputProps) => {
  return (
    <div>
      <label
        htmlFor={props?.id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {props?.label}
      </label>
      <div className="mt-2">
        <input
          id={props?.id}
          type={props?.type}
          autoComplete={props?.id}
          disabled={props?.disabled}
          {...props?.register(props?.id, { required: props?.required })}
          className={clsx(
            `
            form-input
            block
            w-full
            rounded-md
            border-0
            py-1.5
            text-gray-900
            shadow-sm
            ring-1
            ring-inset
            ring-gray-300
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
            focus:ring-sky-600
            sm:text-sm
            sm:leading-6
          `,
            props?.errors[props?.id] && "focus:ring-rose-500",
            props.disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

export default Input;
