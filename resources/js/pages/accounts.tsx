"use client"

import { useState, useEffect } from "react"
import { Head, usePage, router } from "@inertiajs/react"
import { Users, Plus, Key, Trash2, Settings, MoreVertical, Search, RefreshCw } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
    DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import ApiKeyModal from "./api-key-modal"
import type { BreadcrumbItem } from "@/types"

// Types
type ApiKey = {
    id: number
    api_key: string
    client_secret: string
    label: string
    mode: "live" | "test"
    active: boolean
    created_at: string
}

type Account = {
    id: number
    name: string
    devices_count: number
    created_at: string
    updated_at: string
    api_keys?: ApiKey[]
    apiKeyInfo?: {
        mode: "live" | "test" | null
        active: boolean
        apiKeyId?: number
    }
}

type Device = {
    id: number
    device_name: string
    mac: string
    sn: string
    account_id?: number
}

type ApiKeyModalData = {
    title: string
    description: string
    accountName: string
    api_key: string
    client_secret: string
    mode: string
}

type PageProps = {
    accounts: Account[]
    totalAccounts: number
    activeApiKeys: number
    liveApiKeys: number
    devices?: Device[]
    apiKeyModal?: ApiKeyModalData

}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Devices",
        href: "/devices",
    },
    {
        title: "Accounts",
        href: "/accounts",
    },
]

export default function Accounts() {
    const { props } = usePage<PageProps>()
    const { accounts = [], totalAccounts, activeApiKeys, liveApiKeys, devices = [], apiKeyModal } = props

    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(accounts)
    const [searchTerm, setSearchTerm] = useState("")
    const [newAccountApiMode, setNewAccountApiMode] = useState("live")

    // Form states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isNewApiKeyDialogOpen, setIsNewApiKeyDialogOpen] = useState(false)
    const [isManageDevicesDialogOpen, setIsManageDevicesDialogOpen] = useState(false)
    const [newAccountName, setNewAccountName] = useState("")
    const [selectedAccountForApiKey, setSelectedAccountForApiKey] = useState<Account | null>(null)
    const [selectedAccountForDevices, setSelectedAccountForDevices] = useState<Account | null>(null)
    const [newApiKeyMode, setNewApiKeyMode] = useState<"live" | "test">("live")
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")

    // API Key Modal state
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)

    // Button loading states
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)
    const [isCreatingApiKey, setIsCreatingApiKey] = useState(false)
    const [isAssigningDevice, setIsAssigningDevice] = useState(false)

    // Actualizar cuentas filtradas cuando cambien las cuentas
    useEffect(() => {
        setFilteredAccounts(accounts)
        handleSearch(searchTerm)
    }, [accounts])

    // Mostrar modal de API Key si viene en props
    useEffect(() => {
        if (apiKeyModal) {
            setIsApiKeyModalOpen(true)
        }
    }, [apiKeyModal])

    // Mostrar mensajes flash
    // useEffect(() => {
    //     if (flash?.message) {
    //         toast({
    //             title: "Éxito",
    //             description: flash.message,
    //         })
    //     }
    //     if (flash?.error) {
    //         toast({
    //             title: "Error",
    //             description: flash.error,
    //
    //         })
    //     }
    // }, [flash])

    // Search functionality
    const handleSearch = (term: string) => {
        setSearchTerm(term)
        if (!term.trim()) {
            setFilteredAccounts(accounts)
            return
        }

        const filtered = accounts.filter((account) => {
            const searchLower = term.toLowerCase()
            const matchesName = account.name.toLowerCase().includes(searchLower)
            const matchesId = account.id.toString().includes(searchLower)
            const matchesMode = account.apiKeyInfo?.mode?.toLowerCase().includes(searchLower)

            return matchesName || matchesId || matchesMode
        })

        setFilteredAccounts(filtered)
    }

    const createAccount = () => {
        if (!newAccountName.trim()) {
            toast({
                title: "Error",
                description: "El nombre de la cuenta es requerido",

            })
            return
        }

        setIsCreatingAccount(true)

        router.post(
            "/accounts",
            {
                name: newAccountName,
                mode: newAccountApiMode,
            },
            {
                onSuccess: () => {
                    setNewAccountName("")
                    setIsCreateDialogOpen(false)
                },
                onError: (errors) => {
                    console.error("Error al crear la cuenta:", errors)
                    const errorMessage = Object.values(errors).flat().join(", ") || "No se pudo crear la cuenta"
                    toast({
                        title: "Error",
                        description: errorMessage,

                    })
                },
                onFinish: () => {
                    setIsCreatingAccount(false)
                },
            },
        )
    }

    const deleteAccount = (accountId: number) => {
        if (!confirm("¿Está seguro de que desea eliminar esta cuenta? Esta acción no se puede deshacer.")) {
            return
        }

        router.delete(`/accounts/${accountId}`, {
            onSuccess: () => {
                toast({
                    title: "Cuenta eliminada",
                    description: "La cuenta se ha eliminado exitosamente",
                })
            },
            onError: (errors) => {
                console.error("Error al eliminar la cuenta:", errors)
                toast({
                    title: "Error",
                    description: "No se pudo eliminar la cuenta",

                })
            },
        })
    }

    const updateAccountApiKey = (account: Account, updates: { active?: boolean; mode?: "live" | "test" }) => {
        if (!account.apiKeyInfo?.apiKeyId) {
            toast({
                title: "Error",
                description: "No se encontró la API key para esta cuenta",

            })
            return
        }

        router.put(`/api-keys/${account.apiKeyInfo.apiKeyId}`, updates, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "API Key actualizada",
                    description: "Los cambios se han guardado exitosamente",
                })
            },
            onError: (errors) => {
                console.error("Error al actualizar la API key:", errors)
                toast({
                    title: "Error",
                    description: "No se pudo actualizar la API key",

                })
            },
        })
    }

    const createNewApiKey = () => {
        if (!selectedAccountForApiKey) {
            toast({
                title: "Error",
                description: "No se ha seleccionado una cuenta",

            })
            return
        }

        setIsCreatingApiKey(true)

        router.post(
            "/api-keys",
            {
                account_id: selectedAccountForApiKey.id,
                mode: newApiKeyMode,
            },
            {
                onSuccess: () => {
                    setIsNewApiKeyDialogOpen(false)
                },
                onError: (errors) => {
                    console.error("Error al crear la API key:", errors)
                    toast({
                        title: "Error",
                        description: "No se pudo crear la API key",

                    })
                },
                onFinish: () => {
                    setIsCreatingApiKey(false)
                },
            },
        )
    }

    const openNewApiKeyDialog = (account: Account) => {
        setSelectedAccountForApiKey(account)
        setNewApiKeyMode(account.apiKeyInfo?.mode || "live")
        setIsNewApiKeyDialogOpen(true)
    }

    const openManageDevicesDialog = (account: Account) => {
        setSelectedAccountForDevices(account)
        setSelectedDeviceId("")
        setIsManageDevicesDialogOpen(true)
    }

    const assignDeviceToAccount = () => {
        if (!selectedAccountForDevices || !selectedDeviceId) {
            toast({
                title: "Error",
                description: "Seleccione un dispositivo para asignar",

            })
            return
        }

        setIsAssigningDevice(true)

        router.patch(
            `/devices/${selectedDeviceId}/assign-account`,
            {
                account_id: selectedAccountForDevices.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedDeviceId("")
                    toast({
                        title: "Dispositivo asignado",
                        description: "El dispositivo se ha asignado a la cuenta exitosamente",
                    })
                },
                onError: (errors) => {
                    console.error("Error al asignar el dispositivo:", errors)
                    toast({
                        title: "Error",
                        description: "No se pudo asignar el dispositivo a la cuenta",

                    })
                },
                onFinish: () => {
                    setIsAssigningDevice(false)
                },
            },
        )
    }

    const removeDeviceFromAccount = (deviceId: number) => {
        if (!confirm("¿Está seguro de que desea remover este dispositivo de la cuenta?")) {
            return
        }

        router.patch(
            `/devices/${deviceId}/assign-account`,
            {
                account_id: null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Dispositivo removido",
                        description: "El dispositivo se ha removido de la cuenta exitosamente",
                    })
                },
                onError: (errors) => {
                    console.error("Error al remover el dispositivo:", errors)
                    toast({
                        title: "Error",
                        description: "No se pudo remover el dispositivo de la cuenta",
                      //  variant: "destructive",
                    })
                },
            },
        )
    }

    const getAccountDevices = (accountId: number) => {
        return devices.filter((device) => device.account_id === accountId)
    }

    const getAvailableDevices = () => {
        return devices.filter((device) => !device.account_id)
    }

    const handleApiKeyModalClose = () => {
        setIsApiKeyModalOpen(false)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Cuentas" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header with inline stats */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Cuentas</h1>
                        <div className="flex gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-blue-500" />
                                {totalAccounts} cuentas
                            </div>
                            <div className="flex items-center gap-1">
                                <Key className="h-3 w-3 text-green-500" />
                                {activeApiKeys} API keys activas
                            </div>
                            <div className="flex items-center gap-1">
                                <Settings className="h-3 w-3 text-purple-500" />
                                {liveApiKeys} en modo live
                            </div>
                        </div>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Nueva Cuenta
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Crear Nueva Cuenta</DialogTitle>
                                <DialogDescription>
                                    Ingrese el nombre de la nueva cuenta. Se generará automáticamente una API key.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="accountName">Nombre de la Cuenta</Label>
                                    <Input
                                        id="accountName"
                                        value={newAccountName}
                                        onChange={(e) => setNewAccountName(e.target.value)}
                                        placeholder="Ingrese el nombre de la cuenta"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="apiMode">Modo de API Key</Label>
                                    <Select value={newAccountApiMode} onValueChange={setNewAccountApiMode}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="live">Live</SelectItem>
                                            <SelectItem value="test">Test</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={createAccount} disabled={isCreatingAccount}>
                                    {isCreatingAccount ? "Creando..." : "Crear Cuenta"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar cuentas..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Tabla de Cuentas */}
                <Card className="border border-gray-200">
                    <CardHeader className="border-b border-gray-200 pb-4">
                        <CardTitle className="text-lg font-medium text-gray-900">Cuentas Registradas</CardTitle>
                        <CardDescription>Gestione las cuentas y sus configuraciones de API</CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha de Creación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado API
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Modo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dispositivos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAccounts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            {searchTerm ? "No se encontraron cuentas" : "No hay cuentas registradas"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAccounts.map((account) => (
                                        <tr key={account.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="h-5 w-5 text-blue-500" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {account.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(account.created_at).toLocaleDateString("es-ES")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <Switch
                                                        checked={account.apiKeyInfo?.active || false}
                                                        onCheckedChange={(checked) => updateAccountApiKey(account, { active: checked })}
                                                        disabled={!account.apiKeyInfo?.apiKeyId}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-500">
                              {account.apiKeyInfo?.active ? "Activa" : "Inactiva"}
                            </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {account.apiKeyInfo?.apiKeyId ? (
                                                    <Select
                                                        value={account.apiKeyInfo.mode || "live"}
                                                        onValueChange={(newMode) =>
                                                            updateAccountApiKey(account, { mode: newMode as "live" | "test" })
                                                        }
                                                    >
                                                        <SelectTrigger className="w-24 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="live">Live</SelectItem>
                                                            <SelectItem value="test">Test</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium text-gray-900">{account.devices_count}</span>
                                                    {account.devices_count > 0 && (
                                                        <span className="text-xs text-gray-500 ml-1">dispositivos</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openManageDevicesDialog(account)}>
                                                            <Settings className="h-4 w-4 mr-2" />
                                                            Gestionar Dispositivos
                                                        </DropdownMenuItem>
                                                        {account.apiKeyInfo?.apiKeyId && (
                                                            <DropdownMenuItem onClick={() => openNewApiKeyDialog(account)}>
                                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                                Regenerar API Key
                                                            </DropdownMenuItem>
                                                        )}
                                                        {!account.apiKeyInfo?.apiKeyId && (
                                                            <DropdownMenuItem onClick={() => openNewApiKeyDialog(account)}>
                                                                <Key className="h-4 w-4 mr-2" />
                                                                Crear API Key
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            onClick={() => deleteAccount(account.id)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar Cuenta
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

                {/* Dialog para crear nueva API key */}
                <Dialog open={isNewApiKeyDialogOpen} onOpenChange={setIsNewApiKeyDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedAccountForApiKey?.apiKeyInfo?.apiKeyId ? "Regenerar API Key" : "Crear Nueva API Key"}
                            </DialogTitle>
                            <DialogDescription>
                                {selectedAccountForApiKey?.apiKeyInfo?.apiKeyId
                                    ? "Se eliminará la API key actual y se generará una nueva. Esta acción no se puede deshacer."
                                    : "Se generará una nueva API key para esta cuenta."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Cuenta</Label>
                                <div className="p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{selectedAccountForApiKey?.name}</div>
                                            <div className="text-sm text-gray-500">ID: {selectedAccountForApiKey?.id}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="apiKeyMode">Modo de API Key</Label>
                                <Select value={newApiKeyMode} onValueChange={(value: "live" | "test") => setNewApiKeyMode(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="live">Live</SelectItem>
                                        <SelectItem value="test">Test</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewApiKeyDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={createNewApiKey} disabled={isCreatingApiKey}>
                                {isCreatingApiKey
                                    ? "Procesando..."
                                    : selectedAccountForApiKey?.apiKeyInfo?.apiKeyId
                                        ? "Regenerar API Key"
                                        : "Crear API Key"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog para gestionar dispositivos de la cuenta */}
                <Dialog open={isManageDevicesDialogOpen} onOpenChange={setIsManageDevicesDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Gestionar Dispositivos de la Cuenta</DialogTitle>
                            <DialogDescription>Asigne o remueva dispositivos de la cuenta seleccionada.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            {/* Account Info */}
                            <div>
                                <Label>Cuenta</Label>
                                <div className="p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{selectedAccountForDevices?.name}</div>
                                            <div className="text-sm text-gray-500">ID: {selectedAccountForDevices?.id}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Devices */}
                            {selectedAccountForDevices && getAccountDevices(selectedAccountForDevices.id).length > 0 && (
                                <div>
                                    <Label>Dispositivos Actuales</Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {getAccountDevices(selectedAccountForDevices.id).map((device) => (
                                            <div
                                                key={device.id}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                                            >
                                                <div>
                                                    <span className="text-sm font-medium">{device.device_name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">({device.sn})</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeDeviceFromAccount(device.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Device */}
                            <div>
                                <Label>Asignar Nuevo Dispositivo</Label>
                                <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar dispositivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableDevices().map((device) => (
                                            <SelectItem key={device.id} value={device.id.toString()}>
                                                {device.device_name} ({device.sn})
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
                                    setIsManageDevicesDialogOpen(false)
                                    setSelectedAccountForDevices(null)
                                    setSelectedDeviceId("")
                                }}
                            >
                                Cerrar
                            </Button>
                            <Button onClick={assignDeviceToAccount} disabled={!selectedDeviceId || isAssigningDevice}>
                                {isAssigningDevice ? "Asignando..." : "Asignar Dispositivo"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* API Key Modal */}
                {apiKeyModal && <ApiKeyModal data={apiKeyModal} isOpen={isApiKeyModalOpen} onClose={handleApiKeyModalClose} />}
            </div>
            <Toaster />
        </AppLayout>
    )
}




