"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import axios from "axios"
import { Car, RefreshCw, X, CheckCircle } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import type { BreadcrumbItem } from "@/types"

type Vehicle = {
    id: string
    plate: string
    color: string
    timestamp: string
    vehicleImage: string
    plateImage: string
}
type VehicleApiResponse = {
    id: string
    plate_number: string
    car_color: string
    created_at: string
    image: string
    plate_image: string
}[]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Cámaras",
        href: "/devices",
    },
    {
        title: "Vehículos",
        href: "/vehicles",
    },
]

const API_BASE_URL = "http://192.168.86.61/api"

export default function Vehicles() {
    const [loading, setLoading] = useState(true)
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [vehicleData, setVehicleData] = useState({
        plate: "",
        color: "",
        timestamp: "",
    })

    const [isPolling, setIsPolling] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)

    const colorMap: { [key: string]: string } = {
        red: "rojo",
        blue: "azul",
        green: "verde",
        black: "negro",
        white: "blanco",
        yellow: "amarillo",
        purple: "morado",
        orange: "naranja",
        gray: "gris",
        brown: "marrón",
        pink: "rosado",
        violet: "violeta",
        olive: "oliva",
    }

    const fetchVehicles = async () => {
        if (!isPolling) return

        try {
            const response = await axios.get<VehicleApiResponse>(`api/vehicles`)
            const mappedVehicles = response.data.map((v) => ({
                id: v.id,
                plate: v.plate_number,
                color: colorMap[v.car_color] || v.car_color,
                timestamp: v.created_at,
                vehicleImage: v.image,
                plateImage: v.plate_image,
            })) as Vehicle[]

            // Solo actualizar si hay cambios reales
            if (JSON.stringify(mappedVehicles) !== JSON.stringify(vehicles)) {
                setVehicles(mappedVehicles)
            }

            if (selectedVehicle) {
                const stillExists = mappedVehicles.find((v) => v.id === selectedVehicle.id)
                if (stillExists) {
                    setSelectedVehicle(stillExists)
                }
            }
        } catch (err) {
            console.error("Error al obtener los vehículos:", err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (timestamp: string): string => {
        if (!timestamp) return ""

        const date = new Date(timestamp)

        // Verifica si la fecha es válida
        if (isNaN(date.getTime())) return ""

        return new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const handleSelectVehicle = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle)
        setVehicleData({
            plate: vehicle.plate,
            color: vehicle.color,
            timestamp: vehicle.timestamp,
        })
    }

    const handleDeselectVehicle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedVehicle(null)
        setVehicleData({
            plate: "",
            color: "",
            timestamp: "",
        })
    }

    const handleSubmit = async () => {
        if (!selectedVehicle) return

        try {
            console.log("Vehículo seleccionado:", selectedVehicle)

            // Aquí puedes agregar la lógica para enviar los datos al backend
            // await axios.post('/api/register-vehicle', selectedVehicle)

            // Mostrar mensaje de éxito
            setShowSuccess(true)

            // Limpiar formulario
            setSelectedVehicle(null)
            setVehicleData({
                plate: "",
                color: "",
                timestamp: "",
            })

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                setShowSuccess(false)
            }, 3000)
        } catch (error) {
            console.error("Error al registrar vehículo:", error)
        }
    }

    useEffect(() => {
        fetchVehicles()

        const intervalId = setInterval(() => {
            if (isPolling) {
                fetchVehicles()
            }
        }, 5000) // Reducido a 5 segundos

        return () => clearInterval(intervalId)
    }, [isPolling])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehículos" />
            <main className="min-h-screen bg-gray-100 p-4">
                <div className="container mx-auto py-8 max-w-7xl">
                    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sistema de Registro de Vehículos</h1>

                    <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
                        {/* Vehículos Detectados */}
                        <Card className="border-2 border-gray-300">
                            <CardHeader className="border-b-2 border-gray-300 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl text-gray-800">Vehículos Detectados</CardTitle>
                                        <CardDescription>Seleccione un vehículo para registrar</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/*<Button variant="outline" size="sm" onClick={() => setIsPolling(!isPolling)} className="mr-2">*/}
                                        {/*    <RefreshCw className={`h-4 w-4 mr-1 ${isPolling ? "animate-spin" : ""}`} />*/}
                                        {/*    {isPolling ? "Pausar" : "Reanudar"}*/}
                                        {/*</Button>*/}
                                        <Badge variant="outline" className="border-2">
                                            {vehicles.length} vehículos
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6">
                                {loading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg">
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[100px]" />
                                                    <Skeleton className="h-4 w-[80px]" />
                                                    <Skeleton className="h-4 w-[120px]" />
                                                </div>
                                                <div className="flex gap-2 ml-auto">
                                                    <Skeleton className="h-[80px] w-[120px]" />
                                                    <Skeleton className="h-[80px] w-[120px]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : Array.isArray(vehicles) && vehicles.length > 0 ? (
                                    <div className="space-y-4">
                                        {vehicles.map((vehicle) => (
                                            <div
                                                key={vehicle.id}
                                                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                                                    selectedVehicle?.id === vehicle.id
                                                        ? "bg-primary/10 border-2 border-primary"
                                                        : "hover:bg-muted/50 border-2 border-gray-300 hover:border-gray-400"
                                                }`}
                                                onClick={() => handleSelectVehicle(vehicle)}
                                            >
                                                <div className="flex-1 flex flex-col items-center">
                                                    <div className="flex items-center">
                                                        <Car className="h-5 w-5 text-primary mr-2" />
                                                        <h3 className="font-semibold text-lg">{vehicle.plate}</h3>
                                                    </div>

                                                    <div className="mt-1">
                                                        <Badge variant="secondary" className="mr-2">
                                                            {vehicle.color}
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-1">
                                                        <p className="text-sm text-muted-foreground">{formatDate(vehicle.timestamp)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                                                    <img
                                                        src={vehicle.plateImage || "/placeholder.svg"}
                                                        alt={`Placa ${vehicle.plate}`}
                                                        className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-36 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                                    />
                                                    <img
                                                        src={vehicle.vehicleImage || "/placeholder.svg"}
                                                        alt={`Vehículo ${vehicle.plate}`}
                                                        className="h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-36 object-cover rounded-md border border-gray-200 flex-shrink-0"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border border-dashed rounded-lg">
                                        <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">No hay vehículos detectados</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Los vehículos aparecerán aquí cuando sean detectados
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Datos del Vehículo */}
                        <Card className="border-2 border-gray-300">
                            <CardHeader className="border-b-2 border-gray-300 pb-4">
                                <CardTitle className="text-xl text-gray-800">Datos del Vehículo</CardTitle>
                                <CardDescription>Información detallada del vehículo seleccionado</CardDescription>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleSubmit()
                                    }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="plate" className="text-sm font-medium">
                                            Número de Placa
                                        </Label>
                                        <Input
                                            value={vehicleData?.plate || ""}
                                            onChange={(e) => setVehicleData({ ...vehicleData, plate: e.target.value })}
                                            id="plate"
                                            name="plate"
                                            placeholder="Número de placa"
                                            className="w-full bg-gray-50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="color" className="text-sm font-medium">
                                                Color del Vehículo
                                            </Label>
                                            <Input
                                                value={vehicleData?.color || ""}
                                                onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
                                                id="color"
                                                name="color"
                                                placeholder="Color"
                                                className="w-full bg-gray-50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timestamp" className="text-sm font-medium">
                                                Fecha y Hora de Detección
                                            </Label>
                                            <Input
                                                value={formatDate(vehicleData.timestamp)}
                                                onChange={(e) => setVehicleData({ ...vehicleData, timestamp: e.target.value })}
                                                id="timestamp"
                                                name="timestamp"
                                                placeholder="Fecha y hora"
                                                className="w-full bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    {/* Vehículo seleccionado con diseño mejorado */}
                                    {selectedVehicle ? (
                                        <div className="pt-3 border-t-2 border-gray-200 mt-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <Label className="font-medium">Vehículo Seleccionado</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleDeselectVehicle}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    Deseleccionar
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border-2 border-gray-300">
                                                <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                                                    <Car className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-lg">{selectedVehicle.plate}</p>
                                                    <p className="text-sm font-medium mt-1">{selectedVehicle.color}</p>
                                                    <p className="text-sm text-muted-foreground">{formatDate(selectedVehicle.timestamp)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mt-6">
                                            <Car className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-muted-foreground">Seleccione un vehículo de la lista</p>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                            {showSuccess && (
                                <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                        <p className="text-green-800 font-medium">¡Vehículo registrado exitosamente!</p>
                                    </div>
                                </div>
                            )}

                            <CardFooter className="border-t-2 border-gray-300 pt-6 mt-4">
                                <Button
                                    type="submit"
                                    className="w-full py-6 border-2"
                                    disabled={!selectedVehicle}
                                    onClick={handleSubmit}
                                >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Registrar Vehículo
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <Toaster />
            </main>
        </AppLayout>
    )
}

