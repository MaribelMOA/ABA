"use client"

import { useState, useEffect } from "react"
import { Head, usePage, router } from "@inertiajs/react"
import { Plus, Edit, Trash2, Settings, Mail, User, MoreVertical, Search, Shield, Users } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { BreadcrumbItem } from "@/types"

// Types
type Account = {
    id: number
    name: string
}

type UserAccount = {
    id: number
    user_id: number
    account_id: number
    account: Account
    created_at: string
    updated_at: string
}

type UserType = {
    id: number
    name: string
    email: string
    email_verified_at?: string
    created_at: string
    updated_at: string
    user_accounts?: UserAccount[]
    accounts?: Account[]
    role: string
}

type UserFormData = {
    name: string
    email: string
    password: string
    password_confirmation: string
    role: string
}

type PageProps = {
    users: UserType[]
    totalUsers: number
    totalAdmins: number
    usersWithAccounts: number
    accounts: Account[]
    flash?: {
        success?: string
        error?: string
    }
    errors?: Record<string, string[]>
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Devices",
        href: "/devices",
    },
    {
        title: "Usuarios",
        href: "/users",
    },
]

export default function UsersComponent() {
    // Usar usePage para obtener los datos del controlador
    const { props } = usePage<PageProps>()
    const { users, totalUsers, totalAdmins, usersWithAccounts, accounts, flash, errors } = props

    const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users)
    const [searchTerm, setSearchTerm] = useState("")

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
    const [selectedUserForAssign, setSelectedUserForAssign] = useState<UserType | null>(null)
    const [selectedAccountId, setSelectedAccountId] = useState<string>("")

    // Button loading states
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isAssigning, setIsAssigning] = useState(false)

    // Form states
    const emptyForm = { name: "", email: "", password: "", password_confirmation: "", role: "" }
    const [formData, setFormData] = useState<UserFormData>(emptyForm)
    const [originalData, setOriginalData] = useState({
        name: "",
        email: "",
        role: "",
        password: "",
        password_confirmation: "",
    })

    // Actualizar usuarios filtrados cuando cambien los usuarios
    useEffect(() => {
        setFilteredUsers(users)
        handleSearch(searchTerm)
    }, [users])

    // Mostrar mensajes flash
    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Éxito",
                description: flash.success,
            })
        }
        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,

            })
        }
    }, [flash])

    // Search functionality
    const handleSearch = (term: string) => {
        setSearchTerm(term)
        if (!term.trim()) {
            setFilteredUsers(users)
            return
        }

        const filtered = users.filter((user) => {
            const searchLower = term.toLowerCase()
            const matchesName = user.name.toLowerCase().includes(searchLower)
            const matchesEmail = user.email.toLowerCase().includes(searchLower)
            const matchesRole = user.role.toLowerCase().includes(searchLower)
            const matchesAccounts = user.user_accounts?.some((ua) => ua.account.name.toLowerCase().includes(searchLower))

            return matchesName || matchesEmail || matchesRole || matchesAccounts
        })

        setFilteredUsers(filtered)
    }

    const createUser = () => {
        if (isSubmitting) return;
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.role.trim()) {
            toast({
                title: "Error",
                description: "Todos los campos son requeridos",
                //variant: "destructive",
            })
            return
        }

        if (formData.password !== formData.password_confirmation) {
            toast({
                title: "Error",
                description: "Las contraseñas no coinciden",

            })
            return
        }

        setIsSubmitting(true)

        router.post("/users", formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateDialogOpen(false)
                setFormData(emptyForm)
                toast({
                    title: "Usuario creado",
                    description: "El usuario se ha creado exitosamente",
                })
            },
            onError: (errors) => {
                console.error("Error al crear el usuario:", errors)
                if (errors) {
                    const errorMessages = Object.values(errors).flat().join("\n")
                    toast({
                        title: "Error de validación",
                        description: errorMessages,

                    })
                } else {
                    toast({
                        title: "Error",
                        description: "No se pudo crear el usuario",

                    })
                }
            },
            onFinish: () => {
                setIsSubmitting(false)
            },
        })
    }

    const updateUser = () => {
        if (isUpdating) return;
       // setIsUpdating(true);
        // Validación de campos requeridos
        if (!selectedUser || !formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
            toast({
                title: "Error",
                description: "El nombre, email y rol son requeridos",

            })
            return
        }
        if (formData.password && formData.password !== formData.password_confirmation) {
            toast({
                title: "Error",
                description: "Las contraseñas no coinciden",

            })
            return
        }

        setIsUpdating(true)


        const updateData = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            ...(formData.password && {
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            }),
        };

        router.put(`/users/${selectedUser.id}`, updateData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditDialogOpen(false);
               // setSelectedUser(null);
                setSelectedUser(null)
                setFormData({ ...emptyForm })
                toast({
                    title: "Usuario actualizado",
                    description: "El usuario se ha actualizado exitosamente",
                });
            },
            onError: (errors) => {
                console.error("Error al actualizar el usuario:", errors);
                const errorMessage = errors?.message || "No se pudo actualizar el usuario";
                toast({
                    title: "Error",
                    description: errorMessage,
                });
            },
            onFinish: () => {
                setIsUpdating(false);
               // setSelectedUser(null);
            },
        });
    };


    const deleteUser = (userId: number) => {
        if (!confirm("¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.")) {
            return
        }

        router.delete(`/users/${userId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Usuario eliminado",
                    description: "El usuario se ha eliminado exitosamente",
                })
            },
            onError: (errors) => {
                console.error("Error al eliminar el usuario:", errors)
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el usuario",

                })
            },
        })
    }

    const assignAccountToUser = () => {
        if (!selectedUserForAssign || !selectedAccountId) {
            toast({
                title: "Error",
                description: "Seleccione una cuenta para asignar",

            })
            return
        }

        setIsAssigning(true)

        router.post(
            "/user-accounts",
            {
                user_id: selectedUserForAssign.id,
                account_id: Number.parseInt(selectedAccountId),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAssignDialogOpen(false)
                    setSelectedUserForAssign(null)
                    setSelectedAccountId("")
                    toast({
                        title: "Cuenta asignada",
                        description: "La cuenta se ha asignado al usuario exitosamente",
                    })
                },
                onError: (errors) => {
                    console.error("Error al asignar la cuenta:", errors)
                    const errorMessage = errors?.message || "No se pudo asignar la cuenta al usuario"
                    toast({
                        title: "Error",
                        description: errorMessage,

                    })
                },
                onFinish: () => {
                    setIsAssigning(false)
                },
            },
        )
    }

    const removeAccountFromUser = (userAccountId: number) => {
        if (!confirm("¿Está seguro de que desea remover esta cuenta del usuario?")) {
            return
        }

        router.delete(`/user-accounts/${userAccountId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAssignDialogOpen(false)
                toast({
                    title: "Cuenta removida",
                    description: "La cuenta se ha removido del usuario exitosamente",
                })

            },
            onError: (errors) => {
                console.error("Error al remover la cuenta:", errors)
                toast({
                    title: "Error",
                    description: "No se pudo remover la cuenta del usuario",

                })
            },
        })
    }

    const isFormChanged = () => {
        return (
            formData.name.trim() !== "" ||
            formData.email.trim() !== "" ||
            formData.password.trim() !== "" ||
            formData.password_confirmation.trim() !== "" ||
            formData.role.trim() !== ""
        )
    }

    const isEditFormChanged = () => {
        return (
            formData.name !== originalData.name ||
            formData.email !== originalData.email ||
            formData.role !== originalData.role ||
            formData.password.trim() !== "" ||
            formData.password_confirmation.trim() !== ""
        )
    }

    const openCreateDialog = () => {
        setFormData(emptyForm)
        setIsCreateDialogOpen(true)
    }

    const openEditDialog = (user: UserType) => {
        setSelectedUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.role,
        })
        setOriginalData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
            password_confirmation: "",
        })
        setIsEditDialogOpen(true)
    }

    const openAssignDialog = (user: UserType) => {
        setSelectedUserForAssign(user)
        setSelectedAccountId("")
        setIsAssignDialogOpen(true)
    }

    const getUserAccounts = (user: UserType) => {
        return user.user_accounts || []
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "default"
            case "user":
                return "secondary"
            default:
                return "outline"
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Usuarios</h1>
                        {/* Stats Cards - Minimalist */}
                        <div className="flex gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-blue-500" />
                                {totalUsers} usuarios
                            </div>
                            <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-purple-500" />
                                {totalAdmins} admins
                            </div>
                            <div className="flex items-center gap-1">
                                <Settings className="h-3 w-3 text-green-500" />
                                {usersWithAccounts} con cuentas
                            </div>
                        </div>
                    </div>
                    <Button onClick={openCreateDialog} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <Card className="border border-gray-200">
                    <CardHeader className="border-b border-gray-200 pb-4">
                        <CardTitle className="text-lg font-medium text-gray-900">Usuarios del Sistema</CardTitle>
                        <CardDescription>Gestione los usuarios y sus permisos</CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cuentas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <User className="h-5 w-5 text-gray-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-900">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-900">{getUserAccounts(user).length}</span>
                                                    {getUserAccounts(user).length > 0 && (
                                                        <span className="text-xs text-gray-500 ml-1">cuentas</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString("es-ES")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openAssignDialog(user)}>
                                                            <Settings className="h-4 w-4 mr-2" />
                                                            Gestionar Cuentas
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => deleteUser(user.id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Create User Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                            <DialogDescription>Complete los datos del nuevo usuario del sistema.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="createName">Nombre Completo</Label>
                                <Input
                                    id="createName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div>
                                <Label htmlFor="createEmail">Email</Label>
                                <Input
                                    id="createEmail"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="createRole">Rol</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="user">Usuario</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="createPassword">Contraseña</Label>
                                <Input
                                    id="createPassword"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Contraseña"
                                />
                            </div>
                            <div>
                                <Label htmlFor="createPasswordConfirmation">Confirmar Contraseña</Label>
                                <Input
                                    id="createPasswordConfirmation"
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    placeholder="Confirmar contraseña"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={createUser} disabled={!isFormChanged() || isSubmitting}>
                                {isSubmitting ? "Creando..." : "Crear Usuario"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>Modifique los datos del usuario. La contraseña es opcional.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="editName">Nombre Completo</Label>
                                <Input
                                    id="editName"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editEmail">Email</Label>
                                <Input
                                    id="editEmail"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editRole">Rol</Label>
                                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="user">Usuario</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="editPassword">Nueva Contraseña (opcional)</Label>
                                <Input
                                    id="editPassword"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Dejar vacío para mantener actual"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editPasswordConfirmation">Confirmar Nueva Contraseña</Label>
                                <Input
                                    id="editPasswordConfirmation"
                                    type="password"
                                    value={formData.password_confirmation}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    placeholder="Confirmar nueva contraseña"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={updateUser} disabled={!isEditFormChanged() || !isFormChanged() || isUpdating}>
                                {isUpdating ? "Actualizando..." : "Actualizar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Assign Account Dialog */}
                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Gestionar Cuentas del Usuario</DialogTitle>
                            <DialogDescription>Asigne o remueva cuentas del usuario seleccionado.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            {/* User Info */}
                            <div>
                                <Label>Usuario</Label>
                                <div className="p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{selectedUserForAssign?.name}</div>
                                            <div className="text-sm text-gray-500">{selectedUserForAssign?.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Accounts */}
                            {selectedUserForAssign && getUserAccounts(selectedUserForAssign).length > 0 && (
                                <div>
                                    <Label>Cuentas Actuales</Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {getUserAccounts(selectedUserForAssign).map((userAccount) => (
                                            <div
                                                key={userAccount.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                                            >
                                                <span className="text-sm font-medium">{userAccount.account.name}</span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeAccountFromUser(userAccount.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Account */}
                            <div>
                                <Label>Asignar Nueva Cuenta</Label>
                                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts
                                            .filter((account) => {
                                                const userAccounts = getUserAccounts(selectedUserForAssign || ({} as UserType))
                                                return !userAccounts.some((ua) => ua.account_id === account.id)
                                            })
                                            .map((account) => (
                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                    {account.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAssignDialogOpen(false)
                                    setSelectedUserForAssign(null)
                                    setSelectedAccountId("")
                                }}
                            >
                                Cerrar
                            </Button>
                            <Button onClick={assignAccountToUser} disabled={!selectedAccountId || isAssigning}>
                                {isAssigning ? "Asignando..." : "Asignar Cuenta"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Toaster />
        </AppLayout>
    )
}




