"use client";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

enum EVariant {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
}

const AuthForm = () => {
  const [variant, setVariant] = useState<EVariant>(EVariant.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  const toggleVariant = useCallback(() => {
    if (variant === EVariant.LOGIN) {
      setVariant(EVariant.REGISTER);
    } else {
      setVariant(EVariant.LOGIN);
    }
  }, [variant]);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === EVariant.REGISTER) {
      fetch("/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          setIsLoading(false);
          if (res?.status === 200) {
            signIn("credentials", data);
          } else {
            enqueueSnackbar(res?.statusText, { variant: "error" });
          }
        })
        .catch((err) => enqueueSnackbar(err, { variant: "error" }))
        .finally(() => setIsLoading(false));
    }
    if (variant === EVariant.LOGIN) {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            enqueueSnackbar("Invalid credentials", { variant: "error" });
          } else if (callback?.ok) {
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: "github" | "google") => {
    setIsLoading(true);

    signIn(action, { redirect: false }).then((callback) => {
      if (callback?.error) {
        enqueueSnackbar("Invalid credentials", { variant: "error" });
      } else if (callback?.ok) {
        enqueueSnackbar("Logged in!", { variant: "success" });
      }
    });
  };

  return (
    <div className="flex justify-center mt-8 sm:mx-auto sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === EVariant.REGISTER && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button fullWidth disabled={isLoading} type="submit">
              {variant === EVariant.LOGIN ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === EVariant.LOGIN
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === EVariant.LOGIN ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
