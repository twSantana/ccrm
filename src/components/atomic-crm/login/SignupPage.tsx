import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useDataProvider, useNotify } from "ra-core";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { CrmDataProvider } from "../providers/types";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { SignUpData } from "../types";

export const SignupPage = () => {
  const dataProvider = useDataProvider<CrmDataProvider>();
  const navigate = useNavigate();
  const { darkModeLogo: logo, title } = useConfigurationContext();

  const { isPending: isSignUpPending, mutate } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: SignUpData) => {
      return dataProvider.signUp(data);
    },
    onSuccess: () => {
      notify(
        "Account created. Check your email if confirmation is enabled, then sign in.",
      );
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      notify(
        error instanceof Error
          ? error.message
          : "An error occurred. Please try again.",
        { type: "error" },
      );
    },
  });

  const notify = useNotify();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    mutate(data);
  };

  return (
    <div className="h-screen p-8">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt={title}
          width={24}
          className="filter brightness-0 invert"
        />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="h-full">
        <div className="max-w-sm mx-auto h-full flex flex-col justify-center gap-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to {title}</h1>
          <p className="text-base mb-4">Create an account to access the CRM.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                {...register("first_name", { required: true })}
                id="first_name"
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                {...register("last_name", { required: true })}
                id="last_name"
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email", { required: true })}
                id="email"
                type="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password", { required: true })}
                id="password"
                type="password"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button
                type="submit"
                disabled={!isValid || isSignUpPending}
                className="w-full"
              >
                {isSignUpPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>
          </form>
          <Link to="/login" className="text-sm text-center hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

SignupPage.path = "/sign-up";
