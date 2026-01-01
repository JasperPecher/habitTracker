import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export async function signOut() {
  const { data, error } = await authClient.signOut();
  if (error) throw new Error(error.message);

  return data;
}
export type SignOutData = Awaited<ReturnType<typeof signOut>>;

export const useSignOutMutation = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success("Successfully signed out!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sign out");
    },
  });
};
