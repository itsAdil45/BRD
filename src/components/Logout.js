"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
export async function logout() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    await fetch(`https://car-auctions.xeriotech.com/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("Logged out successfully!");
    await signOut({ redirect: false });
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
