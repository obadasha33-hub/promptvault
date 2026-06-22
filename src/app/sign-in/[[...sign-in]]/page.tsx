import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-[#0f131d] text-[#dfe2f1]">
      <div className="w-full max-w-md p-6">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#4cd7f6',
              colorBackground: '#171b26',
            },
            elements: {
              card: 'border border-white/10 shadow-[0_0_20px_rgba(76,215,246,0.05)] rounded-lg',
            },
          }}
        />
      </div>
    </main>
  );
}
