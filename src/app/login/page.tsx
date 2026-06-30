"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { login } from "./api";
import { t } from "@/lib/translations";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.success) {
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user_email", formData.email);
      localStorage.setItem("user_name", res.data.name);
      window.location.href = "/dashboard/upload-detect";
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      {/* Left: Form */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{t("app_title")}</span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("welcome_back")}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {t("login_subtitle")}
            </p>
          </div>

          {registered && (
            <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-600">
              {t("register_success")}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="h-11 pl-10"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="group h-11 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  {t("login")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("no_account")}{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {t("sign_up_now")}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right: Branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-800 lg:flex lg:items-center lg:justify-center">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-white/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-white/5 blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative z-10 flex max-w-md flex-col px-12 text-white"
        >
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            {t("app_title")}
          </h1>
          <div className="mt-12 text-xs text-white/40">&copy; 2026</div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
