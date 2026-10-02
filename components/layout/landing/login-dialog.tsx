"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/layout/logo";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { useLoginDialogStore } from "@/store/login-dialog-store";

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.05 10.05 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

export default function LoginDialog() {
  const { open, setOpen } = useLoginDialogStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  // Auto-open when redirected here with ?login=1 (e.g. from a guarded page)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("login")) {
      setOpen(true);
      params.delete("login");
      const query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? `?${query}` : ""));
    }
  }, [setOpen]);

  const handleSocial = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      await signIn.social({ provider, callbackURL: "/dashboard" });
    } catch {
      setLoading(null);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("magic");
    try {
      const { error } = await signIn.magicLink({ email, callbackURL: "/dashboard" });
      if (error) {
        toast.error(error.message ?? "Could not send the magic link");
      } else {
        toast.success("Check your inbox for the sign-in link");
        setOpen(false);
        setEmail("");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <Logo className="mb-2 flex items-center justify-center gap-2" />
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Access your purchased products and license keys.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => handleSocial("google")}
            disabled={loading !== null}>
            {loading === "google" ? <Spinner className="size-4" /> : <GoogleIcon />}
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocial("github")}
            disabled={loading !== null}>
            {loading === "github" ? <Spinner className="size-4" /> : <GithubIcon />}
            GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleMagicLink} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading !== null}>
            {loading === "magic" ? <Spinner className="size-4" /> : null}
            Send Magic Link
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            We&apos;ll email you a one-time sign-in link. No password needed.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
