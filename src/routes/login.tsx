import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/LoginForm";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-turquoise/20 blur-[120px]" />
      <LoginForm />
    </div>
  );
}
