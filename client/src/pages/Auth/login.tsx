import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Link } from "react-router-dom";
import { logInSchema } from "../../schema";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "../../hooks/use-toast";
import { login } from "../../store/slices/userSlices";
import { Auth } from "../../services";

// Define the shape of your form data
interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(logInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await Auth.loginToAccount(data);

      if (response.status === 201) {
        toast({
          title: "Failed",
          description: response.data.message,
        });
      }

      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        dispatch(login(response.data.data.user));
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "An error occurred";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[22rem] mx-auto sm:mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Login
            </h1>
            <p className="text-balance text-black dark:text-white">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4 dark:text-white text-muted">
            <div className="grid gap-2">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black dark:text-white">
                      Email
                    </FormLabel>
                    <Input
                      id="email"
                      // type="email"
                      placeholder="m@example.com"
                      className="text-black dark:text-white"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label
                  htmlFor="password"
                  className="text-black dark:text-white"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-black dark:text-white ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Input
                      id="password"
                      type="password"
                      placeholder="abc123"
                      className="text-black dark:text-white"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-black dark:text-white">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Login;
