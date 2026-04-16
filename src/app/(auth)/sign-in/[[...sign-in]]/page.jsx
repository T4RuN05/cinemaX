import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'glass-panel border border-white/20 bg-black/40 shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-zinc-300',
            socialButtonsBlockButton:
              'border border-white/20 bg-white/10 text-white hover:bg-white/15',
            dividerLine: 'bg-white/15',
            dividerText: 'text-zinc-400',
            formFieldInput:
              'input-glass border-white/20 bg-black/50 text-white placeholder:text-zinc-400',
            formButtonPrimary:
              'cta-primary shadow-none hover:shadow-none focus:shadow-none',
            footerActionLink: 'text-red-300 hover:text-red-200',
          },
        }}
      />
    </div>
  );
}