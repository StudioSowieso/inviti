import type { Metadata } from "next";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Account aanmaken — Inviti" };

export default function SignupPage() {
  return <SignupForm />;
}
