"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
export async function logout() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("reg_token")}`,
      },
    });

    toast.success("Logged out successfully!");
    await signOut({ redirect: false });
    Cookies.remove("reg_token");

    return true; // ✅ success
  } catch (err) {
    console.error("Logout failed:", err);
    return false; // ❌ failed
  }
}
