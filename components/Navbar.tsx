"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
      } else {
        alert("Failed to logout");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during logout");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-lg font-bold">Tarot App</h1>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  );
} 