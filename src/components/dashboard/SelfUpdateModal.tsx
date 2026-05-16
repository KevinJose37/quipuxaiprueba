import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { patchApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface SelfUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SelfUpdateModal({ isOpen, onClose }: SelfUpdateModalProps) {
  const { user, logout } = useAuth();
  
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre_completo);
      setCorreo(user.correo);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, string> = {
        nombre_completo: nombre,
        correo: correo,
      };
      
      if (password) {
        payload.contrasena = password;
      }

      await patchApi("/api/auth/me", payload);
      
      // Si todo sale bien, deslogueamos al usuario para que vuelva a iniciar sesión
      // Esto es clave porque el correo podría haber cambiado y el token quedaría huérfano.
      onClose();
      logout();
    } catch (err: any) {
      setError(err.message || "Error al actualizar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-secondary border border-border rounded-xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Actualizar mis datos</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-brand-danger/10 text-brand-danger border border-brand-danger/20 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nombre Completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition"
            />
          </div>

          <div className="pt-2 border-t border-border mt-2 space-y-4">
            <p className="text-xs text-muted-foreground">Opcional: Llena estos campos solo si deseas cambiar tu contraseña.</p>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-[oklch(0.2_0.03_295)] transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
