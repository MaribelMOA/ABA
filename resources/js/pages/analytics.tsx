"use client"

import { useState, useEffect } from "react"
import { Head } from "@inertiajs/react"
import { Calendar, Users, TrendingUp, RefreshCw, Clock, Camera } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import type { BreadcrumbItem } from "@/types"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

type Device = {
    id: number
    device_name: string
    mac: string
    sn: string
}

type HourlyData = {
    hour: string
    count: number
    time: string
}

type ObjectCountingRecord = {
    id: number
    object_type: string
    object_state: string
    count: number
    created_at: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Devices",
        href: "/devices",
    },
    {
        title: "Conteo de Personas",
        href: "/analytics",
    },
]

const API_CREDENTIALS = {
    api_key: "enCJreWqZ8hBLjn7K9rkJVVUQ6lY4UdP",
    client_secret: "k4Q0DlGj8NvCmGKpAthpeUCjtLTDwLOGurrZuri5tXH5mvpXK1x9IcfgDeraYYcz",
}

export default function PeopleAnalytics() {
    function getTodayInLosAngeles() {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Los_Angeles",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });

        // Devuelve formato YYYY-MM-DD (por eso "en-CA")
        return formatter.format(new Date());
    }

    // Estados principales
    const [selectedDevice, setSelectedDevice] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>(() => getTodayInLosAngeles())

    // Estados de datos
    const [devices, setDevices] = useState<Device[]>([])
    const [hourlyData, setHourlyData] = useState<HourlyData[]>([])
    const [totalPeople, setTotalPeople] = useState<number>(0)
    const [peakHour, setPeakHour] = useState<string>("")
    const [lastUpdate, setLastUpdate] = useState<string>("")

    // Estados de carga
    const [loadingDevices, setLoadingDevices] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    // Obtener dispositivos al cargar el componente
    const fetchDevices = async () => {
        setLoadingDevices(true)
        try {
            const response = await fetch(`/api/devices/by-account`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                    "api_key":API_CREDENTIALS.api_key,
                    "client_secret":API_CREDENTIALS.client_secret,
                },
            })

            if (!response.ok) {
                throw new Error("Error al obtener dispositivos")
            }

            const data = await response.json()
            setDevices(data.devices || [])
        } catch (error) {
            console.error("Error fetching devices:", error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los dispositivos",

            })
        } finally {
            setLoadingDevices(false)
        }
    }

    // Obtener datos de conteo de personas
    const fetchPeopleData = async (deviceId: string, date: string) => {
        setLoadingData(true)
        try {
            const url = `/api/devices/${deviceId}/alarms/TRAFFIC`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                    "api_key":API_CREDENTIALS.api_key,
                    "client_secret":API_CREDENTIALS.client_secret,
                }

            })

            if (!response.ok) {
                if (response.status === 404) {
                    setHourlyData([])
                    setTotalPeople(0)
                    setPeakHour("")
                   // setLastUpdate(new Date().toLocaleString("es-ES"))
                    setLastUpdate(new Date().toLocaleString("es-MX", {
                        timeZone: "America/Mexico_City", // o "America/Los_Angeles"
                    }))

                    return
                }
                throw new Error("Error al obtener datos")
            }

            const data = await response.json()
            const records: ObjectCountingRecord[] = data.records || []

            const selectedDateRecords = records.filter((record) => {
                const recordDate = new Date(record.created_at).toLocaleDateString("es-Mx", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    timeZone: "America/Los_Angeles"
                })
                    .split("/")
                    .reverse()
                    .join("-")

                return recordDate === date && record.object_state === "enter" && record.object_type === "person"
            })
            console.log(selectedDateRecords)

            const hourlyStats = processHourlyData(selectedDateRecords)
            setHourlyData(hourlyStats)
            //console.log(hourlyStats)

          //  const total = selectedDateRecords.reduce((sum, record) => sum + record.count, 0)
            setTotalPeople(selectedDateRecords.length)

            const peak = hourlyStats.reduce(
                (max, current) => (current.count > max.count ? current : max),
                { hour: "", count: 0, time: "" }
            )
            setPeakHour(peak.hour)
            setLastUpdate(new Date().toLocaleString("es-ES"))

            toast({
                title: "Datos actualizados",
                description: `Se encontraron ${selectedDateRecords.length} registros para la fecha seleccionada`,
            })
        } catch (error) {
            console.error("Error fetching people data:", error)
            toast({
                title: "Error",
                description: "No se pudieron cargar los datos de conteo",

            })
        } finally {
            setLoadingData(false)
        }
    }


    // Procesar datos por hora
    const processHourlyData = (records: ObjectCountingRecord[]): HourlyData[] => {
        const hourlyMap = new Map<string, number>()

        // Inicializar todas las horas del día
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, "0")
            hourlyMap.set(hour, 0)
        }

        // Agrupar registros por hora
        records.forEach((record) => {

            //const hour = new Date(record.created_at).getUTCHours().toString().padStart(2, "0")
            const date = new Date(record.created_at)
            const hour = date.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                hour12: false,
                timeZone: "America/Los_Angeles", // o " America/Mexico_City"
            }).padStart(2, "0")
            const currentCount = hourlyMap.get(hour) || 0
            hourlyMap.set(hour, currentCount + 1)

        })

        // Convertir a array para el gráfico
        return Array.from(hourlyMap.entries()).map(([hour, count]) => ({
            hour,
            count,
            time: `${hour}:00`,
        }))
    }

    // Manejar cambio de dispositivo
    const handleDeviceChange = (deviceId: string) => {
        setSelectedDevice(deviceId)
        if (deviceId && selectedDate) {
            fetchPeopleData(deviceId, selectedDate)
        }
    }

    // Manejar cambio de fecha
    const handleDateChange = (date: string) => {
        setSelectedDate(date)
        if (selectedDevice && date) {
            fetchPeopleData(selectedDevice, date)
        }
    }

    // Refrescar datos
    const refreshData = () => {
        if (selectedDevice && selectedDate) {
            fetchPeopleData(selectedDevice, selectedDate)
        }
    }

    // Cargar dispositivos al montar el componente
    useEffect(() => {
        fetchDevices()
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Análisis de Personas" />

            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Análisis de Flujo de Personas</h1>
                        <p className="text-gray-600">Monitoreo en tiempo real del conteo de personas por hora</p>
                    </div>

                    {/* Controles */}
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Selector de Dispositivo */}
                                <div className="space-y-2">
                                    <Label htmlFor="device-select" className="text-sm font-medium">
                                        Cámara/Dispositivo
                                    </Label>
                                    <Select value={selectedDevice} onValueChange={handleDeviceChange} disabled={loadingDevices}>
                                        <SelectTrigger id="device-select">
                                            <SelectValue
                                                placeholder={loadingDevices ? "Cargando dispositivos..." : "Seleccionar dispositivo"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {devices.map((device) => (
                                                <SelectItem key={device.id} value={device.id.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        <Camera className="h-4 w-4" />
                                                        {device.device_name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {loadingDevices && <p className="text-xs text-gray-500">Cargando dispositivos disponibles...</p>}
                                </div>

                                {/* Selector de Fecha */}
                                <div className="space-y-2">
                                    <Label htmlFor="date-select" className="text-sm font-medium">
                                        Fecha
                                    </Label>
                                    <Input
                                        id="date-select"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}

                                    />
                                </div>

                                {/* Botón Refrescar */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium opacity-0">Acciones</Label>
                                    <Button
                                        onClick={refreshData}
                                        disabled={!selectedDevice || loadingData}
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <RefreshCw className={`h-4 w-4 mr-2 ${loadingData ? "animate-spin" : ""}`} />
                                        {loadingData ? "Cargando..." : "Refrescar"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estadísticas */}
                    {selectedDevice && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total del Día</p>
                                            <p className="text-2xl font-bold text-gray-900">{totalPeople}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-8 w-8 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Hora Pico</p>
                                            <p className="text-2xl font-bold text-gray-900">{peakHour || "--"}:00</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-8 w-8 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Última Actualización</p>
                                            <p className="text-sm font-bold text-gray-900">{lastUpdate || "--"}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Gráfico */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Flujo de Personas por Hora
                            </CardTitle>
                            <CardDescription>Distribución del conteo de personas a lo largo del día seleccionado</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loadingData ? (
                                <div className="h-80 flex items-center justify-center">
                                    <div className="space-y-4 w-full">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-64 w-full" />
                                    </div>
                                </div>
                            ) : !selectedDevice ? (
                                <div className="h-80 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                                        <h3 className="text-lg font-medium text-gray-900">Selecciona un dispositivo</h3>
                                        <p className="text-gray-600">Elige una cámara para ver las estadísticas de conteo</p>
                                    </div>
                                </div>
                            ) : hourlyData.length === 0 || totalPeople === 0 ? (
                                <div className="h-80 flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                                        <h3 className="text-lg font-medium text-gray-900">Sin datos</h3>
                                        <p className="text-gray-600">No hay registros de conteo para la fecha seleccionada</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={hourlyData}>
                                            <defs>
                                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                            <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: "8px",
                                                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                }}
                                                labelStyle={{ color: "#1e293b" }}
                                                formatter={(value, name) => [`${value} personas`, "Conteo"]}
                                                labelFormatter={(label) => `Hora: ${label}`}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCount)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Toaster />
        </AppLayout>
    )
}

