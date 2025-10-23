import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center py-8">
      <SignUp />
    </div>
  );
}
