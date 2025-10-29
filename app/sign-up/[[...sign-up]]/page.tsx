import { SignUp } from "@clerk/nextjs";

export default function Page() {
  // リダイレクト先を明示的に指定（Safari対応）
  const afterSignUpUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/admin";
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">新規登録</h1>
          <p className="text-gray-600 mt-2">Nexana Database アカウントを作成</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            },
          }}
          afterSignUpUrl={afterSignUpUrl}
          routing="path"
          path="/sign-up"
        />
      </div>
    </div>
  );
}
