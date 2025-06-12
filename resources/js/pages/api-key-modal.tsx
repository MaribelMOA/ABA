"use client"

import { useState } from "react"
import { Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { router } from "@inertiajs/react"

type ApiKeyModalData = {
    title: string
    description: string
    accountName: string
    api_key: string
    client_secret: string
    mode: string
}

type ApiKeyModalProps = {
    data: ApiKeyModalData
    isOpen: boolean
    onClose: () => void
}

export default function ApiKeyModal({ data, isOpen, onClose }: ApiKeyModalProps) {
    const [copied, setCopied] = useState<{ apiKey: boolean; clientSecret: boolean; both: boolean }>({
        apiKey: false,
        clientSecret: false,
        both: false,
    })

    const copyToClipboard = async (text: string, type: "apiKey" | "clientSecret" | "both") => {
        try {
            await navigator.clipboard.writeText(text)

            setCopied((prev) => ({ ...prev, [type]: true }))

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied((prev) => ({ ...prev, [type]: false }))
            }, 2000)

            const labels = {
                apiKey: "API Key",
                clientSecret: "Client Secret",
                both: "API Key y Client Secret",
            }

            toast({
                title: "Copiado",
                description: `${labels[type]} copiado al portapapeles`,
            })
        } catch (err) {
            toast({
                title: "Error",
                description: "No se pudo copiar al portapapeles",
                variant: "destructive",
            })
        }
    }

    const handleClose = () => {
        onClose()
        // Redirigir a accounts para limpiar el modal de la URL
        router.get(
            "/accounts",
            {},
            {
                preserveState: false,
                preserveScroll: true,
            },
        )
    }

    const bothCredentials = `API Key: ${data.api_key}\nClient Secret: ${data.client_secret}`

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <DialogTitle className="text-green-800 text-lg sm:text-xl">{data.title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm sm:text-base">{data.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Account Info */}
                    <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription>
                            <div className="space-y-1">
                                <p className="font-medium text-blue-800 text-sm sm:text-base">Cuenta: {data.accountName}</p>
                                <p className="text-xs sm:text-sm text-blue-700">Modo: {data.mode}</p>
                            </div>
                        </AlertDescription>
                    </Alert>

                    {/* Credentials */}
                    <div className="space-y-6">
                        {/* API Key */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">API Key</label>
                            <div className="space-y-2">
                                {/* Desktop/Tablet Layout */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded-md text-sm font-mono break-all min-h-[40px] flex items-center">
                                        {data.api_key}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant={copied.apiKey ? "default" : "outline"}
                                        onClick={() => copyToClipboard(data.api_key, "apiKey")}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                    >
                                        {copied.apiKey ? (
                                            <>
                                                <CheckCircle className="h-3 w-3" />
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3 w-3" />
                                                Copiar
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Mobile Layout */}
                                <div className="sm:hidden space-y-2">
                                    <code className="block w-full bg-gray-100 px-3 py-3 rounded-md text-xs font-mono break-all">
                                        {data.api_key}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant={copied.apiKey ? "default" : "outline"}
                                        onClick={() => copyToClipboard(data.api_key, "apiKey")}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        {copied.apiKey ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                API Key Copiada
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copiar API Key
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Client Secret */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Client Secret</label>
                            <div className="space-y-2">
                                {/* Desktop/Tablet Layout */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded-md text-sm font-mono break-all min-h-[40px] flex items-center">
                                        {data.client_secret}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant={copied.clientSecret ? "default" : "outline"}
                                        onClick={() => copyToClipboard(data.client_secret, "clientSecret")}
                                        className="flex items-center gap-1 whitespace-nowrap"
                                    >
                                        {copied.clientSecret ? (
                                            <>
                                                <CheckCircle className="h-3 w-3" />
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3 w-3" />
                                                Copiar
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Mobile Layout */}
                                <div className="sm:hidden space-y-2">
                                    <code className="block w-full bg-gray-100 px-3 py-3 rounded-md text-xs font-mono break-all">
                                        {data.client_secret}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant={copied.clientSecret ? "default" : "outline"}
                                        onClick={() => copyToClipboard(data.client_secret, "clientSecret")}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        {copied.clientSecret ? (
                                            <>
                                                <CheckCircle className="h-4 w-4" />
                                                Client Secret Copiado
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copiar Client Secret
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
                        <Button
                            variant="secondary"
                            onClick={() => copyToClipboard(bothCredentials, "both")}
                            className="flex items-center justify-center gap-2 order-2 sm:order-1"
                        >
                            {copied.both ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Ambos Copiados</span>
                                    <span className="sm:hidden">Copiados</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    <span className="hidden sm:inline">Copiar Ambos</span>
                                    <span className="sm:hidden">Copiar Todo</span>
                                </>
                            )}
                        </Button>

                        <Button onClick={handleClose} className="order-1 sm:order-2">
                            Cerrar
                        </Button>
                    </div>

                    {/* Warning */}
                    <Alert className="border-amber-200 bg-amber-50">
                        <AlertDescription className="text-amber-800 text-xs sm:text-sm">
                            <strong>Importante:</strong> Guarde estas credenciales en un lugar seguro. No podrá volver a ver estos
                            valores una vez que cierre esta ventana.
                        </AlertDescription>
                    </Alert>
                </div>
            </DialogContent>
        </Dialog>
    )
}
