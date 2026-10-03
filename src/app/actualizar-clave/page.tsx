import { PasswordRecovery } from "@/components/password-recovery";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <PasswordRecovery reset token={typeof token === "string" ? token : undefined} />;
}
