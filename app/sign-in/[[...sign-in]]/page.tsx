import { SignIn } from "@clerk/nextjs";

export default function Page() {
  // リダイレクト先を明示的に指定（Safari対応）
  const afterSignInUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/admin";
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">管理者ログイン</h1>
          <p className="text-gray-600 mt-2">Nexana Database 管理者用ログイン</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            },
          }}
          afterSignInUrl={afterSignInUrl}
          routing="path"
          path="/sign-in"
        />
      </div>
    </div>
  );
}
