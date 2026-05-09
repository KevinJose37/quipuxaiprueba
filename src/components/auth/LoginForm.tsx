import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE } from "@/lib/api";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("admin@quipux.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${API_BASE}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await res.json();
      await login(data.access_token);
      toast.success("¡Bienvenido de nuevo!");
      
      navigate({ to: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150px] bg-primary/20 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-primary)" }}>
          <ShieldCheck className="h-6 w-6 text-[oklch(0.2_0.03_295)]" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Director Apolo</h1>
        <p className="text-sm text-muted-foreground mt-1">Ingresa tus credenciales para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="admin@quipux.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Contraseña</label>
            <a href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 mt-6 rounded-lg font-medium text-sm flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--gradient-primary)", color: "oklch(0.2 0.03 295)" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
