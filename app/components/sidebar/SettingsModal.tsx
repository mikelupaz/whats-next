"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "../Modal";
import Avatar from "../Avatar";
import Input from "../inputs/Input";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { CldUploadButton } from "next-cloudinary";
import Button from "../Button";

interface ISettingsModal {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}
const SettingsModal = ({ isOpen, onClose, currentUser }: ISettingsModal) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });
  const image = watch("image");

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    fetch("/api/settings", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data?.name, image: data?.image }),
    })
      .then((res) => res.json())
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => enqueueSnackbar("Unable to update.", { variant: "error" }))
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 ">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information .
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {currentUser?.email}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Photo
                </label>
                <div className=" mt-2 flex items-center gap-x-3">
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset="whats-next"
                  >
                    {image || currentUser?.image ? (
                      <Image
                        width="48"
                        height="48"
                        className="rounded-full"
                        src={image || currentUser?.image}
                        alt="Avatar"
                      />
                    ) : (
                      <CgProfile size={44} />
                    )}
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
