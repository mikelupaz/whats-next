"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

interface ISettingsModal {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}
const SettingsModal = ({ isOpen, onClose, currentUser }: ISettingsModal) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {} = useForm<FieldValues>();
  return <div></div>;
};

export default SettingsModal;
