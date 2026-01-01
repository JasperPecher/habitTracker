"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useSessionQuery } from "@/lib/authSessionQuery";
import { toast } from "sonner";
import { useSignOutMutation } from "@/lib/signOutMutation";

// need to disableSignup to false in auth.ts
// const { data, error } = await authClient.signUp.email(
//   {
//     email: "name@domain.test",
//     password: "Password", // user password -> min 8 characters by default
//     name: "name", // user display name
//     username: "username",
//   },
//   {
//     onRequest: (ctx) => {
//       //show loading
//     },
//     onSuccess: (ctx) => {
//       //redirect to the dashboard or sign in page
//     },
//     onError: (ctx) => {
//       // display the error message
//       alert(ctx.error.message);
//     },
//   }
// );

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, startTransition] = useTransition();
  const { data: session, isPending, error } = useSessionQuery();
  const signOutMutation = useSignOutMutation();

  const handleLogin = async () => {
    startTransition(async () => {
      await authClient.signIn.username(
        {
          username,
          password,
          callbackURL: "/auth",
        },
        {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success("Successfully logged in!");
            setUsername("");
            setPassword("");
            window.location.reload();
          },
        }
      );
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-2xl font-bold text-center">
        Client Authentication Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your username and password to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username here"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Session Display */}
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>
              {isPending
                ? "Loading session..."
                : session
                ? "You are currently logged in"
                : "You are not logged in"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                Error: {error.message}
              </div>
            ) : session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  (
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {session.user.name?.charAt(0) ||
                        session.user.email?.charAt(0)}
                    </span>
                  </div>
                  )
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium mb-2">Session Details:</p>
                  <pre className="text-xs overflow-auto max-h-40">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>Sign in to view your session information</p>
              </div>
            )}
          </CardContent>
          {session && (
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOutMutation.mutate()}
                disabled={signOutMutation.isPending}
              >
                {signOutMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Sign Out"
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
