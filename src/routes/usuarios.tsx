import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/dashboard/PageShell";
import { useUsuarios, Usuario, UsuarioCreate, UsuarioUpdate } from "@/hooks/use-usuarios";
import { TableCardLoader } from "@/components/dashboard/CardLoader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { UserPlus, Pencil, Trash2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/usuarios")({
  component: UsuariosRoute,
});

function UsuariosRoute() {
  const { query, createMutation, updateMutation, deleteMutation } = useUsuarios();
  
  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<Partial<UsuarioCreate & UsuarioUpdate>>({ nombre_completo: "", correo: "", rol: "usuario" });
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const openCreate = () => {
    setFormData({ nombre_completo: "", correo: "", rol: "usuario" });
    setGeneratedPassword(null);
    setCreateOpen(true);
  };

  const openEdit = (user: Usuario) => {
    setSelectedUsuario(user);
    setFormData({ nombre_completo: user.nombre_completo, correo: user.correo, rol: user.rol, activo: user.activo } as Partial<UsuarioUpdate>);
    setEditOpen(true);
  };

  const openDelete = (user: Usuario) => {
    setSelectedUsuario(user);
    setDeleteOpen(true);
  };

  const handleCreate = async () => {
    if (!formData.nombre_completo || !formData.correo || !formData.rol) return;
    try {
      const res = await createMutation.mutateAsync(formData as UsuarioCreate);
      setGeneratedPassword(res.contrasena_generada);
    } catch (e) {
      // error handled in hook
    }
  };

  const handleEdit = async () => {
    if (!selectedUsuario) return;
    try {
      await updateMutation.mutateAsync({ id: selectedUsuario.id_usuario, data: formData });
      setEditOpen(false);
    } catch (e) {
      // error handled
    }
  };

  const handleDelete = async () => {
    if (!selectedUsuario) return;
    try {
      await deleteMutation.mutateAsync(selectedUsuario.id_usuario);
      setDeleteOpen(false);
    } catch (e) {
      // error handled
    }
  };

  return (
    <PageShell title="Usuarios y Roles" subtitle="Administración de cuentas y permisos del sistema">
      
      <div className="flex justify-end mb-6">
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <UserPlus className="h-4 w-4" />
          Crear Usuario
        </button>
      </div>

      {query.isLoading ? (
        <TableCardLoader className="h-[400px]" />
      ) : query.isError ? (
        <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3" />
          <p>Error cargando usuarios</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-muted-foreground uppercase text-xs tracking-wider">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {query.data?.map((user) => (
                  <tr key={user.id_usuario} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{user.nombre_completo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{user.correo}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        user.rol === "admin" 
                          ? "bg-brand-turquoise/10 text-brand-turquoise border border-brand-turquoise/20" 
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {user.rol === "admin" && <ShieldCheck className="h-3 w-3" />}
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.activo ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.activo ? "bg-green-500" : "bg-red-500"}`} />
                        {user.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(user)}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user.activo && (
                          <button
                            onClick={() => openDelete(user)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Desactivar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
            <DialogDescription>
              El usuario recibirá una contraseña generada automáticamente que deberás compartirle.
            </DialogDescription>
          </DialogHeader>
          
          {!generatedPassword ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nombre Completo</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Rol</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-center font-medium text-foreground">Usuario creado con éxito</p>
              <div className="w-full p-4 rounded-md bg-secondary/80 border border-border text-center">
                <p className="text-xs text-muted-foreground mb-2">Contraseña autogenerada:</p>
                <p className="font-mono text-xl text-primary font-bold tracking-widest select-all">{generatedPassword}</p>
              </div>
              <p className="text-xs text-yellow-500 text-center">
                ⚠️ Cópiala ahora, esta contraseña no se volverá a mostrar.
              </p>
            </div>
          )}

          <DialogFooter>
            {!generatedPassword ? (
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {createMutation.isPending ? "Guardando..." : "Crear"}
              </button>
            ) : (
              <button
                onClick={() => setCreateOpen(false)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full"
              >
                Cerrar
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nombre Completo</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Correo Electrónico</label>
              <input
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Rol</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input 
                type="checkbox" 
                id="activo" 
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="activo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Usuario Activo
              </label>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={handleEdit}
              disabled={updateMutation.isPending}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>Desactivar Usuario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas desactivar al usuario <span className="font-bold text-foreground">{selectedUsuario?.nombre_completo}</span>?
              Ya no podrá ingresar al sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <button
              onClick={() => setDeleteOpen(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 h-10 px-4 py-2"
            >
              {deleteMutation.isPending ? "Desactivando..." : "Sí, desactivar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageShell>
  );
}
