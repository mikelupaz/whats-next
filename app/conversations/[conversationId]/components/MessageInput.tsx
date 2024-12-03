import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface IMessageInput {
  id: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  required?: boolean;
  placeholder?: string;
  type?: string;
}
const MessageInput = ({
  id,
  register,
  required,
  placeholder,
  type,
}: IMessageInput) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black font-light py-2 px-4 bg-neutral-100 border-none w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
