import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6">
      <SignIn />
    </main>
  );
}