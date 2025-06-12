"use client"

import { useState, useEffect } from "react"
import { Head, usePage, router } from "@inertiajs/react"
import { Camera, Users, Settings, Search } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { BreadcrumbItem } from "@/types"
import { Input } from "@/components/ui/input"

// Define types
type AlarmType = {
    id: number
    smart_type: string
    description: string
}

type Account = {
    id: number
    name: string
}

type Device = {
    id: number
    mac: string
    device_name: string
    sn: string
    alarm_type: AlarmType
    image_save_enabled: boolean
    device_enabled: boolean
    created_at: string
    updated_at: string
    account_id?: number
    account?: Account
}

type PageProps = {
    devices: Device[]
    totalDevices: number
    activeDevices: number
    devicesWithAccounts: number
    accounts: Account[]

}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Devices",
        href: "/devices",
    },
]

export default function Devices() {
    // Usar usePage para obtener los datos del controlador
    const { props } = usePage<PageProps>()
    const { devices, totalDevices, activeDevices, devicesWithAccounts, accounts } = props

    // Dialog states
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedDeviceForAssign, setSelectedDeviceForAssign] = useState<Device | null>(null)
    const [selectedAccountId, setSelectedAccountId] = useState<string>("")
    const [isAssigning, setIsAssigning] = useState(false)
    const [hasAccountSelectionChanged, setHasAccountSelectionChanged] = useState(false)

    // Search states
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredDevices, setFilteredDevices] = useState<Device[]>(devices)

    // Filter states
    const [accountFilter, setAccountFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")



    // Actualizar dispositivos filtrados cuando cambien los dispositivos
    useEffect(() => {
        applyFilters(searchTerm, accountFilter, statusFilter)
    }, [devices])



    const applyFilters = (searchTerm: string, accountFilter: string, statusFilter: string) => {
        let filtered = devices

        // Filtro por búsqueda de texto
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter((device) => {
                const matchesName = device.device_name.toLowerCase().includes(searchLower)
                const matchesMac = device.mac.toLowerCase().includes(searchLower)
                const matchesSn = device.sn.toLowerCase().includes(searchLower)
                const matchesAlarm = device.alarm_type?.description?.toLowerCase().includes(searchLower) ?? false
                const accountName = device.account?.name?.toLowerCase() || ""
                const matchesAccount = accountName.includes(searchLower)

                return matchesName || matchesMac || matchesSn || matchesAlarm || matchesAccount
            })
        }

        // Filtro por cuenta
        if (accountFilter !== "all") {
            if (accountFilter === "unassigned") {
                filtered = filtered.filter((device) => !device.account_id)
            } else {
                filtered = filtered.filter((device) => device.account_id?.toString() === accountFilter)
            }
        }

        // Filtro por estado
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active"
            filtered = filtered.filter((device) => device.device_enabled === isActive)
        }

        setFilteredDevices(filtered)
    }

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        applyFilters(term, accountFilter, statusFilter)
    }

    const handleAccountFilter = (value: string) => {
        setAccountFilter(value)
        applyFilters(searchTerm, value, statusFilter)
    }

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value)
        applyFilters(searchTerm, accountFilter, value)
    }

    const toggleDeviceStatus = (device: Device) => {
        const url = device.device_enabled ? `/device/disable-device/${device.id}` : `/device/enable-device/${device.id}`

        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Estado actualizado",
                        description: `Dispositivo ${device.device_enabled ? "desactivado" : "activado"} exitosamente`,
                    })
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "No se pudo cambiar el estado del dispositivo",
                       // variant: "destructive",
                    })
                },
            },
        )
    }

    const toggleImageSaving = (device: Device) => {
        const url = device.image_save_enabled
            ? `/device/disable-save-image/${device.id}`
            : `/device/enable-save-image/${device.id}`

        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Configuración actualizada",
                        description: `Guardado de imágenes ${device.image_save_enabled ? "desactivado" : "activado"}`,
                    })
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "No se pudo cambiar la configuración de guardado",

                    })
                },
            },
        )
    }

    const openAssignDialog = (device: Device) => {
        setSelectedDeviceForAssign(device)
        setSelectedAccountId(device.account_id?.toString() || "")
        setHasAccountSelectionChanged(false)
        setIsAssignDialogOpen(true)
    }

    const assignAccountToDevice = () => {
        if (!selectedDeviceForAssign) {
            toast({
                title: "Error",
                description: "No se ha seleccionado un dispositivo",

            })
            return
        }

        setIsAssigning(true)

        const accountId =
            selectedAccountId && selectedAccountId !== "none" && selectedAccountId !== ""
                ? Number.parseInt(selectedAccountId)
                : null

        router.patch(
            `/devices/${selectedDeviceForAssign.id}/assign-account`,
            {
                account_id: accountId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const accountName = accountId ? accounts.find((acc) => acc.id === accountId)?.name : null

                    toast({
                        title: "Cuenta asignada",
                        description: accountId
                            ? `Se ha asignado la cuenta "${accountName}" al dispositivo`
                            : "Se ha removido la cuenta del dispositivo",
                    })

                    // Cerrar dialog y resetear estados
                    setIsAssignDialogOpen(false)
                    setSelectedDeviceForAssign(null)
                    setSelectedAccountId("")
                    setHasAccountSelectionChanged(false)
                },
                onError: (errors) => {
                    console.error("Error al asignar la cuenta:", errors)
                    toast({
                        title: "Error",
                        description: "No se pudo asignar la cuenta al dispositivo",

                    })
                },
                onFinish: () => {
                    setIsAssigning(false)
                },
            },
        )
    }

    const getAccountName = (accountId?: number) => {
        if (!accountId) return "Sin asignar"
        const account = accounts.find((acc) => acc.id === accountId)
        return account ? account.name : "Cuenta no encontrada"
    }

   // const localAccounts = accounts

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cámaras" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sistema de Gestión de Cámaras</h1>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar dispositivos..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="account-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Cuenta:
                        </Label>
                        <Select value={accountFilter} onValueChange={handleAccountFilter}>
                            <SelectTrigger className="w-40" id="account-filter">
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las cuentas</SelectItem>
                                <SelectItem value="unassigned">Sin asignar</SelectItem>
                                {accounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id.toString()}>
                                        {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/*<div className="flex items-center gap-2">*/}
                    {/*    <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">*/}
                    {/*        Estado:*/}
                    {/*    </Label>*/}
                    {/*    <Select value={statusFilter} onValueChange={handleStatusFilter}>*/}
                    {/*        <SelectTrigger className="w-32" id="status-filter">*/}
                    {/*            <SelectValue placeholder="Todos" />*/}
                    {/*        </SelectTrigger>*/}
                    {/*        <SelectContent>*/}
                    {/*            <SelectItem value="all">Todos</SelectItem>*/}
                    {/*            <SelectItem value="active">Activos</SelectItem>*/}
                    {/*            <SelectItem value="inactive">Inactivos</SelectItem>*/}
                    {/*        </SelectContent>*/}
                    {/*    </Select>*/}
                    {/*</div>*/}

                    {(accountFilter !== "all" || statusFilter !== "all" || searchTerm) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSearchTerm("")
                                setAccountFilter("all")
                                setStatusFilter("all")
                                applyFilters("", "all", "all")
                            }}
                            className="flex items-center gap-1"
                        >
                            Limpiar filtros
                        </Button>
                    )}
                </div>

                {/* Tabla de Cámaras */}
                <Card className="border-2 border-gray-200">
                    <CardHeader className="border-b-2 border-gray-200 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl text-gray-800">Listado de Cámaras</CardTitle>
                                <CardDescription>Gestione sus dispositivos de vigilancia y asignación de cuentas</CardDescription>
                            </div>

                            {/* Estadísticas */}
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Camera className="h-3 w-3 text-gray-500" />
                                    {filteredDevices.length} de {totalDevices} cámaras
                                    {(accountFilter !== "all" || statusFilter !== "all" || searchTerm) && (
                                        <span className="text-blue-600">(filtradas)</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Camera className="h-3 w-3 text-green-500" />
                                    {filteredDevices.filter((d) => d.device_enabled).length} activas
                                    {filteredDevices.length > 0 && (
                                        <span className="ml-1 text-[10px] text-gray-400">
                      (
                                            {Math.round(
                                                (filteredDevices.filter((d) => d.device_enabled).length / filteredDevices.length) * 100,
                                            )}
                                            %)
                    </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-blue-500" />
                                    {filteredDevices.filter((d) => d.account_id).length} con cuenta
                                    {filteredDevices.length > 0 && (
                                        <span className="ml-1 text-[10px] text-gray-400">
                      ({Math.round((filteredDevices.filter((d) => d.account_id).length / filteredDevices.length) * 100)}
                                            %)
                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nombre</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dirección MAC</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Número de serie</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tipo de Alarma</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cuenta Asignada</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Activada</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Guardar Imágenes</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredDevices.length === 0 ? (
                                    <tr className="border-b">
                                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                            {searchTerm ? "No se encontraron dispositivos" : "No hay cámaras registradas"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDevices.map((device) => (
                                        <tr key={device.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                                                        <Camera className="h-6 w-6 text-gray-500" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{device.device_name}</div>
                                                        <div className="text-sm text-gray-500">ID: {device.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500">{device.mac}</td>
                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard
                                                            .writeText(device.sn)
                                                            .then(() => {
                                                                window.open("https://www.provisionisr-cloud.com/", "_blank")
                                                                toast({
                                                                    title: "Copiado",
                                                                    description: "Número de serie copiado al portapapeles",
                                                                })
                                                            })
                                                            .catch((err) => {
                                                                console.error("Error al copiar:", err)
                                                                window.open("https://www.provisionisr-cloud.com/", "_blank")
                                                            })
                                                    }}
                                                    className="hover:text-blue-800 underline text-left"
                                                >
                                                    {device.sn}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge variant={device.alarm_type.smart_type === "Vehículo" ? "default" : "secondary"}>
                                                    {device.alarm_type.smart_type}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={device.account_id ? "default" : "outline"}>
                                                        {getAccountName(device.account_id)}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Switch checked={device.device_enabled} onCheckedChange={() => toggleDeviceStatus(device)} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <Switch
                                                    checked={device.image_save_enabled}
                                                    onCheckedChange={() => toggleImageSaving(device)}
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openAssignDialog(device)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Settings className="h-3 w-3" />
                                                    Asignar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Dialog para asignar cuenta */}
                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Asignar Cuenta al Dispositivo</DialogTitle>
                            <DialogDescription>Seleccione una cuenta para asignar al dispositivo seleccionado.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Dispositivo Seleccionado</Label>
                                <div className="p-3 bg-gray-50 rounded-md border">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                                            <Camera className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{selectedDeviceForAssign?.device_name}</div>
                                            <div className="text-sm text-gray-500">MAC: {selectedDeviceForAssign?.mac}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Cuenta</Label>
                                <Select
                                    value={selectedAccountId}
                                    onValueChange={(value) => {
                                        setSelectedAccountId(value)
                                        setHasAccountSelectionChanged(true)
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Ninguna (Sin asignar)</SelectItem>
                                        {accounts.map((account) => (
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
                                    setSelectedDeviceForAssign(null)
                                    setSelectedAccountId("")
                                    setHasAccountSelectionChanged(false)
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={assignAccountToDevice} disabled={!hasAccountSelectionChanged || isAssigning}>
                                {isAssigning ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <Toaster />
        </AppLayout>
    )
}




