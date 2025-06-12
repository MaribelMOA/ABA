"use client"

import { useState, useEffect } from "react"
import { Head, usePage } from "@inertiajs/react"
import { Search, Menu } from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import type { BreadcrumbItem } from "@/types"
import Swal from "sweetalert2"

type PageProps = {
    // Puedes agregar props que vengan del controlador aquí
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Cambio de Divisas",
        href: "/moneyExpress",
    },
]

export default function CurrencyExchange() {
    const { props } = usePage<PageProps>()

    // Estados para el modo (Compra/Venta)
    const [mode, setMode] = useState<"compra" | "venta">("compra")

    // Tasas de cambio (estas podrían venir del backend)
    const [rates] = useState({
        compra: 18.63,
        venta: 18.79,
    })

    // Estados para los campos
    const [monto, setMonto] = useState<string>("")
    const [recibido, setRecibido] = useState<string>("")
    const [importe, setImporte] = useState<string>("")
    const [cambio, setCambio] = useState<string>("")

    // Estados para las monedas
    const [montoCurrency, setMontoCurrency] = useState<"USD" | "MXN">("USD")
    const [recibidoCurrency, setRecibidoCurrency] = useState<"USD" | "MXN">("USD")
    const [importeCurrency, setImporteCurrency] = useState<"USD" | "MXN">("MXN")
    const [cambioCurrency, setCambioCurrency] = useState<"USD" | "MXN">("USD")

    // Estado para loading del botón siguiente
    const [isLoading, setIsLoading] = useState(false)

    // Validacion de error
    const [error, setError] = useState<string | null>(null)


    // Mappeo de object state
    const stateTranslations: Record<string, string> = {
        enter: "Entró",
        leave: "Salió",
        exist: "Presente",
    }


    // Función para calcular conversiones
    const calculateConversions = (
        field: string,
        value: string,
        currentMonto = monto,
        currentImporte = importe,
        currentRecibido = recibido
    ) => {
        const numValue = Number.parseFloat(value) || 0
        const currentRate = rates[mode]

        setError(null)

        if (field === "monto") {
            let newImporte = 0

            if (mode === "compra") {
                newImporte = numValue * currentRate
            } else {
                newImporte = numValue / currentRate
            }
            setImporte(newImporte.toFixed(2))

            // Si ya se ingresó un valor en recibido, recalcular con el nuevo importe
            if (currentRecibido !== "") {
                calculateConversions("recibido", currentRecibido, value, newImporte.toFixed(2), currentRecibido)
            }

        } else if (field === "recibido") {

            const recibidoValue = numValue

            if (mode === "compra") {
                const montoValue = Number.parseFloat(currentMonto) || 0

                if (recibidoValue < montoValue) {
                    setError("El monto recibido no puede ser menor al monto solicitado.")
                    setCambio("")
                    return
                }

                const cambioValue = recibidoValue - montoValue
                setCambio(cambioValue.toFixed(2))
            } else {
                const importeValue = Number.parseFloat(currentImporte) || 0
                const importeEnMXN = importeValue * currentRate

                if (recibidoValue < importeEnMXN) {
                    setError("El monto recibido no puede ser menor al importe a entregar.")
                    setCambio("")
                    return
                }

                const cambioValue = recibidoValue - importeEnMXN
                setCambio(cambioValue.toFixed(2))
            }
        }
    }




    // Efectos para actualizar monedas según el modo
    useEffect(() => {
        if (mode === "compra") {
            setMontoCurrency("USD")
            setRecibidoCurrency("USD")
            setImporteCurrency("MXN")
            setCambioCurrency("USD")
        } else {
            setMontoCurrency("MXN")
            setRecibidoCurrency("MXN")
            setImporteCurrency("USD")
            setCambioCurrency("MXN")
        }

        // Limpiar campos al cambiar modo
        setMonto("")
        setRecibido("")
        setImporte("")
        setCambio("")
    }, [mode])

    // Función para manejar cambios en los inputs
    const handleInputChange = (field: string, value: string) => {
        const regex = /^\d*\.?\d*$/
        if (!regex.test(value) && value !== "") return

        switch (field) {
            case "monto":
                setMonto(value)
                calculateConversions("monto", value, value, importe, recibido)
                break
            case "recibido":
                setRecibido(value)
                calculateConversions("recibido", value, monto, importe, value)
                break
            case "importe":
                setImporte(value)
                break
            case "cambio":
                setCambio(value)
                break
        }
    }


    // Función para llamar a la API de detección de personas
    const checkPersonDetection = async () => {
        setIsLoading(true)

        try {
            const response = await fetch("/api/object-counting/last-state-filtered?object_type=person&alarm_type=TRAFFIC", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor")
            }

            const data = await response.json()
            const translatedState = stateTranslations[data.object_state] || data.object_state

            if (data.object_state === "exist") {
                await Swal.fire({
                    title: "¡Persona Detectada!",
                    text: `Estado de persona: ${translatedState}`,
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#10b981",
                })
            } else {
                await Swal.fire({
                    title: "Estado Diferente",
                    text: `Estado de persona detectado: ${translatedState}`,
                    icon: "warning",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#f59e0b",
                })
            }
        } catch (error) {
            console.error("Error al verificar detección:", error)
            await Swal.fire({
                title: "Error",
                text: "No se pudo verificar la detección de personas",
                icon: "error",
                confirmButtonText: "OK",
                confirmButtonColor: "#ef4444",
            })
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cambio de Divisas" />

            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-6xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Buscar por nombre del Usuario"
                                        className="pl-10 bg-gray-50 border-gray-200"
                                        disabled
                                    />
                                </div>
                            </div>

                            <Button className="bg-green-500 hover:bg-green-600 text-white px-6" disabled>
                                Buscar
                            </Button>

                            <Button variant="outline" className="px-6" disabled>
                                Nuevo
                            </Button>

                            <Button variant="outline" size="icon" className="relative" disabled>
                                <Menu className="h-4 w-4" />
                                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                                    9
                                </Badge>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Card className="bg-white shadow-lg">
                        <CardContent className="p-8">
                            {/* Exchange Rates - Clickeable */}
                            <div className="flex justify-center gap-16 mb-12">
                                <div
                                    className="text-center cursor-pointer transition-all hover:scale-105"
                                    onClick={() => setMode("compra")}
                                >
                                    <h3 className={`text-2xl font-bold mb-2 ${mode === "compra" ? "text-gray-800" : "text-gray-400"}`}>
                                        Compra
                                        {mode === "compra" && <Badge className="ml-2 bg-orange-500 text-white px-2 py-1 text-sm">C1</Badge>}
                                    </h3>
                                    <div className={`text-5xl font-bold ${mode === "compra" ? "text-green-600" : "text-gray-400"}`}>
                                        {rates.compra.toFixed(3)}
                                    </div>
                                </div>
                                <div
                                    className="text-center cursor-pointer transition-all hover:scale-105"
                                    onClick={() => setMode("venta")}
                                >
                                    <h3 className={`text-2xl font-bold mb-2 ${mode === "venta" ? "text-gray-800" : "text-gray-400"}`}>
                                        Venta
                                        {mode === "venta" && <Badge className="ml-2 bg-orange-500 text-white px-2 py-1 text-sm">C2</Badge>}
                                    </h3>
                                    <div className={`text-5xl font-bold ${mode === "venta" ? "text-green-600" : "text-gray-400"}`}>
                                        {rates.venta.toFixed(3)}
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                {/* Monto */}
                                <div className="flex items-center gap-4">
                                    <Label className="text-xl font-semibold text-gray-700 w-32">Monto:</Label>
                                    <div className="flex-1">
                                        <Input
                                            value={monto}
                                            onChange={(e) => handleInputChange("monto", e.target.value)}
                                            className="text-lg py-3 px-4 border-2 border-gray-200 rounded-lg"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Select
                                            value={montoCurrency}
                                            onValueChange={(value: "USD" | "MXN") => {
                                                setMontoCurrency(value)
                                                setMode(value === "USD" ? "compra" : "venta")
                                            }}
                                        >
                                            <SelectTrigger className="w-24 py-3 px-4 border-2 border-gray-200 rounded-lg">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="MXN">MXN</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Recibido */}
                                <div className="flex items-center gap-4">
                                    <Label className="text-xl font-semibold text-gray-700 w-32">Recibido:</Label>
                                    <div className="flex-1">
                                        <Input
                                            value={recibido}
                                            onChange={(e) => handleInputChange("recibido", e.target.value)}
                                            className="text-lg py-3 px-4 border-2 border-gray-200 rounded-lg"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="w-24 py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">{recibidoCurrency}</span>
                                    </div>
                                </div>

                                {/* Importe */}
                                <div className="flex items-center gap-4">
                                    <Label className="text-xl font-semibold text-gray-700 w-32">Importe:</Label>
                                    <div className="flex-1">
                                        <Input
                                            value={importe}
                                            onChange={(e) => handleInputChange("importe", e.target.value)}
                                            className="text-lg py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                                            placeholder="0.00"
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-24 py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">{importeCurrency}</span>
                                    </div>
                                </div>

                                {/* Cambio */}
                                <div className="flex items-center gap-4">
                                    <Label className="text-xl font-semibold text-gray-700 w-32">Cambio:</Label>
                                    <div className="flex-1">
                                        <Input
                                            value={cambio}
                                            onChange={(e) => handleInputChange("cambio", e.target.value)}
                                            className="text-lg py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50"
                                            placeholder="0.00"
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-24 py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <span className="text-gray-600 font-medium">{cambioCurrency}</span>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm mt-1">{error}</p>
                                )}

                            </div>

                            {/* Siguiente Button */}
                            <div className="flex justify-end mt-12">
                                <Button
                                    onClick={checkPersonDetection}
                                    disabled={isLoading}
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-lg"
                                >
                                    {isLoading ? "VERIFICANDO..." : "SIGUIENTE"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Toaster />
        </AppLayout>
    )
}

