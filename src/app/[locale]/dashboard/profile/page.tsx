"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import { Loader2, Save, User as UserIcon, Mail, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
          setFullname(data.fullname);
          setEmail(data.email);
        } else {
          toast.error("Failed to load profile data.");
        }
      } catch (error) {
        toast.error("An error occurred while loading profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!fullname.trim()) newErrors.fullname = "Full Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    
    if (password) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (!hasUppercase || !hasNumber || !hasSpecial) {
        newErrors.password = "Password must contain a capital letter, a number, and a special character.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullname, email, password })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      
      setTimeout(() => {
        toast.info("Please sign in again to apply all changes.");
        signOut({ callbackUrl: "/login" });
      }, 2000);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden dark:bg-gray-900 dark:border-gray-800">
          <div className="p-6 md:p-8 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2 max-w-md">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2 max-w-md">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-64 mt-1" />
              </div>
            </div>
          </div>
          
          <div className="p-4 md:px-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end">
            <Skeleton className="h-[44px] w-[140px] rounded-[10px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl text-gray-900 dark:text-gray-100 tracking-tight">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal credentials and security preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl bg-white shadow-none overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UserIcon className="size-5 text-indigo-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                    if (errors.fullname) setErrors({ ...errors, fullname: "" });
                  }}
                  className={`bg-gray-50 dark:bg-gray-800 shadow-none ${errors.fullname ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  placeholder="John Doe"
                />
                {errors.fullname && <p className="text-xs text-red-500">{errors.fullname}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: "" });
                  }}
                  className={`bg-gray-50 dark:bg-gray-800 shadow-none ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  placeholder="johndoe"
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Mail className="size-5 text-indigo-500" />
              Contact
            </h2>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`bg-gray-50 dark:bg-gray-800 shadow-none ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Lock className="size-5 text-indigo-500" />
              Security
            </h2>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="password">New Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                className={`bg-gray-50 dark:bg-gray-800 shadow-none ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                placeholder="Leave blank to keep current password"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Must contain at least one capital letter, one number, and one special character.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 md:px-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            className="shadow-none rounded-full bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin mr-1" />
            ) : (
              <Save className="size-4 mr-1" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
