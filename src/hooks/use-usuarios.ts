import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export interface Usuario {
  id_usuario: number;
  correo: string;
  nombre_completo: string;
  rol: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface UsuarioCreate {
  correo: string;
  nombre_completo: string;
  rol: string;
}

export interface UsuarioCreateResponse extends Usuario {
  contrasena_generada: string;
}

export interface UsuarioUpdate {
  correo?: string;
  nombre_completo?: string;
  rol?: string;
  activo?: boolean;
}

export function useUsuarios() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const fetchUsuarios = async (): Promise<Usuario[]> => {
    const res = await fetch(`${API_BASE}/api/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error cargando usuarios");
    return res.json();
  };

  const createUsuario = async (data: UsuarioCreate): Promise<UsuarioCreateResponse> => {
    const res = await fetch(`${API_BASE}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Error creando usuario");
    }
    return res.json();
  };

  const updateUsuario = async ({ id, data }: { id: number; data: UsuarioUpdate }): Promise<Usuario> => {
    const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error actualizando usuario");
    return res.json();
  };

  const deleteUsuario = async (id: number) => {
    const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error desactivando usuario");
    return res.json();
  };

  const query = useQuery({
    queryKey: ["usuarios"],
    queryFn: fetchUsuarios,
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario actualizado");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario desactivado");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
