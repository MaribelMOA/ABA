"use client"

import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import {
    Bell,
    BarChart3,
    Key,
    CheckCircle,
    ArrowRight,
    Monitor,
    Users,
    Zap,
    Camera,
    Code,
    Server,
    Database,
    Layers,
    ExternalLink,
    ChevronRight,
    Menu,
    X,
} from "lucide-react"
import { useState } from "react"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <Head title="MyAlarmGate - Gestión de Eventos para Cámaras Provision ISR">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo */}
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-600 p-2 rounded-lg">
                                    <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">MyAlarmGate</h1>
                                    <p className="text-xs text-gray-600">Gestión de Eventos para Cámaras</p>
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="text-gray-700 hover:text-red-600 focus:outline-none"
                                >
                                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center space-x-6">
                                <a href="#inicio" className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
                                    Inicio
                                </a>
                                <a href="#que-es" className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
                                    ¿Qué es?
                                </a>
                                <a href="#solucion" className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
                                    Solución
                                </a>
                                <a href="#casos-uso" className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
                                    Casos de Uso
                                </a>
                                <a href="#api" className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm">
                                    API
                                </a>
                            </nav>

                            {/* Auth Buttons */}
                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route("devices")}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                                    >
                                        <Monitor className="h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                        >
                                            Registro
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white border-t border-gray-200 py-2">
                            <div className="px-4 pt-2 pb-4 space-y-3">
                                <a
                                    href="#inicio"
                                    className="block text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Inicio
                                </a>
                                <a
                                    href="#que-es"
                                    className="block text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ¿Qué es?
                                </a>
                                <a
                                    href="#solucion"
                                    className="block text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Solución
                                </a>
                                <a
                                    href="#casos-uso"
                                    className="block text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Casos de Uso
                                </a>
                                <a
                                    href="#api"
                                    className="block text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    API
                                </a>

                                {/* Mobile Auth Buttons */}
                                <div className="pt-4 border-t border-gray-200">
                                    {auth.user ? (
                                        <Link
                                            href={route("devices")}
                                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Monitor className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col space-y-2">
                                            <Link
                                                href={route("login")}
                                                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors text-center"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Registro
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </header>

                {/* Hero Section */}
                <section id="inicio" className="py-12 md:py-20 lg:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <Zap className="h-3.5 w-3.5" />
                                        <span>Integración de Eventos de Videovigilancia</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                        Centraliza y gestiona eventos de
                                        <span className="text-red-600"> cámaras Provision ISR</span>
                                    </h1>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Solución tecnológica que integra, procesa y pone a disposición los eventos de tus cámaras a través
                                        de una API segura y lista para usar.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {!auth.user && (
                                        <Link
                                            href={route("login")}
                                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <span>Iniciar Sesión</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    )}
                                    <a
                                        href="#api"
                                        className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-red-600 hover:text-red-600 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <span>Ver Documentación API</span>
                                        <Key className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>

                            {/* Hero Image/Illustration */}
                            <div className="relative order-first lg:order-last">
                                <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 md:p-8 shadow-xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                                            <Camera className="h-8 w-8 md:h-10 md:w-10 text-white" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                                            <Bell className="h-8 w-8 md:h-10 md:w-10 text-white" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                                            <Server className="h-8 w-8 md:h-10 md:w-10 text-white" />
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                                            <Code className="h-8 w-8 md:h-10 md:w-10 text-white" />
                                        </div>
                                    </div>
                                </div>
                                {/* Floating elements */}
                                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-2 md:p-3 rounded-full shadow-lg">
                                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-2 md:p-3 rounded-full shadow-lg">
                                    <Database className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What is AlarmGate Section */}
                <section id="que-es" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">¿Qué es MyAlarmGate?</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Una solución tecnológica que integra y gestiona eventos de cámaras de videovigilancia Provision ISR
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6 order-last md:order-first">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">El problema actual</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <ChevronRight className="h-5 w-5 text-red-500" />
                                            </div>
                                            <p className="text-gray-600">
                                                No hay forma unificada de acceder a eventos importantes como detección de rostros o lectura de
                                                placas.
                                            </p>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <ChevronRight className="h-5 w-5 text-red-500" />
                                            </div>
                                            <p className="text-gray-600">
                                                Cada cámara gestiona sus eventos localmente, limitando la integración con otros sistemas.
                                            </p>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <ChevronRight className="h-5 w-5 text-red-500" />
                                            </div>
                                            <p className="text-gray-600">
                                                Se pierde información valiosa que podría usarse para seguridad, auditoría o análisis.
                                            </p>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <ChevronRight className="h-5 w-5 text-red-500" />
                                            </div>
                                            <p className="text-gray-600">
                                                Implementar una solución personalizada es costoso, lento y requiere mantenimiento.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-600 text-lg">
                                    MyAlarmGate es una solución tecnológica de integración y gestión de eventos de cámaras de
                                    videovigilancia Provision ISR, que permite centralizar la información capturada por las cámaras y
                                    ponerla a disposición del cliente a través de una API segura y lista para usar.
                                </p>
                                <p className="text-gray-600 text-lg">
                                    Es ideal para organizaciones que necesitan consultar datos de eventos como lectura de placas,
                                    detección de rostros o cruce de líneas, sin necesidad de desarrollar su propio backend o montar
                                    infraestructura adicional.
                                </p>
                                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                    <p className="text-red-800 font-medium">
                                        Aprovecha al máximo tus cámaras Provision ISR sin necesidad de inversiones adicionales en
                                        infraestructura o desarrollo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section id="solucion" className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">¿Qué Soluciona MyAlarmGate?</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Una plataforma completa para aprovechar al máximo los eventos de tus cámaras
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                                    <Server className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Servidor Listo</h3>
                                <p className="text-gray-600">
                                    Un servidor completamente configurado que puede recibir eventos de cámaras sin necesidad de desarrollo
                                    adicional.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                                    <Bell className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recepción de Eventos</h3>
                                <p className="text-gray-600">
                                    Sistema que recibe eventos HTTP POST directamente desde las cámaras una vez configuradas
                                    correctamente.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                                    <Database className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesamiento Automático</h3>
                                <p className="text-gray-600">
                                    Procesamiento, clasificación y almacenamiento de los eventos de forma automática y organizada.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                                    <Code className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">API RESTful</h3>
                                <p className="text-gray-600">
                                    Una API lista para consumir, con autenticación vía API Key y Client Secret para acceso seguro.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                                    <Monitor className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interfaz Web</h3>
                                <p className="text-gray-600">
                                    Interfaz de ejemplo para visualizar eventos recientes como placas detectadas y gestionar dispositivos.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                                    <Layers className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Integración Externa</h3>
                                <p className="text-gray-600">
                                    Capacidad de integrarse a sistemas externos sin necesidad de instalar software adicional.
                                </p>
                            </div>
                        </div>

                        {/* How it works */}
                        <div className="mt-16">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">¿Cómo Funciona?</h3>

                            <div className="relative">
                                {/* Desktop flow */}
                                <div className="hidden md:block">
                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-200 -translate-y-1/2 z-0"></div>
                                    <div className="grid grid-cols-4 gap-4 relative z-10">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                                <Camera className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">Configuración</h4>
                                            <p className="text-sm text-gray-600">Configura el evento y la URL HTTP POST en la cámara</p>
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                                <Bell className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">Envío de Eventos</h4>
                                            <p className="text-sm text-gray-600">La cámara envía los eventos a MyAlarmGate</p>
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                                <Database className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">Procesamiento</h4>
                                            <p className="text-sm text-gray-600">El servidor procesa y almacena los eventos</p>
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                                <Code className="h-6 w-6" />
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">Consulta API</h4>
                                            <p className="text-sm text-gray-600">El cliente consulta los eventos usando la API</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile flow */}
                                <div className="md:hidden space-y-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                            <Camera className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Configuración</h4>
                                            <p className="text-sm text-gray-600">Configura el evento y la URL HTTP POST en la cámara</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                            <Bell className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Envío de Eventos</h4>
                                            <p className="text-sm text-gray-600">La cámara envía los eventos a MyAlarmGate</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                            <Database className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Procesamiento</h4>
                                            <p className="text-sm text-gray-600">El servidor procesa y almacena los eventos</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                                            <Code className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Consulta API</h4>
                                            <p className="text-sm text-gray-600">El cliente consulta los eventos usando la API</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section id="casos-uso" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Casos de Uso</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Descubre cómo MyAlarmGate puede transformar la seguridad y gestión de tu negocio
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <div className="bg-red-100 p-4 rounded-full w-fit mb-6">
                                    <Camera className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Moteles y Estacionamientos</h3>
                                <p className="text-gray-600 mb-6">
                                    Registro automático de placas de vehículos que ingresan, sin intervención humana. Asociación
                                    automática a formularios de entrada/salida.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Registro automático de placas</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Historial por auto o por día</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Integración con sistemas locales</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <div className="bg-green-100 p-4 rounded-full w-fit mb-6">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Corporativos con Sucursales</h3>
                                <p className="text-gray-600 mb-6">
                                    Monitoreo centralizado de quién entra en cada sucursal, cuándo y con qué frecuencia. Control y
                                    seguimiento de accesos.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Gestión multi-sucursal</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Alertas en tiempo real</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Reportes de acceso</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                                <div className="bg-blue-100 p-4 rounded-full w-fit mb-6">
                                    <BarChart3 className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Análisis de Flujos</h3>
                                <p className="text-gray-600 mb-6">
                                    Análisis de flujos de entrada/salida y tiempos de permanencia en tiendas, centros comerciales o
                                    instalaciones industriales.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Análisis de tráfico</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Reportes estadísticos</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600">Optimización de recursos</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Documentation Section */}
                <section id="api" className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Documentación API</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Rutas protegidas con API Key y Client Secret para acceder a los datos de forma segura
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="p-6 bg-gray-800 text-white">
                                <div className="flex items-center space-x-3">
                                    <Key className="h-5 w-5" />
                                    <h3 className="text-xl font-semibold">Rutas disponibles</h3>
                                </div>
                                <p className="mt-2 text-gray-300 text-sm">
                                    Todas las rutas requieren autenticación mediante API Key y Client Secret
                                </p>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {/* Route 1 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          GET
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/devices/by-account
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Obtiene todos los dispositivos registrados para la cuenta asociada, utilizando autenticación vía encabezados.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`POST /api/devices/by-account
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "account_id": 37,
  "devices": [
    {
      "id": 4,
      "account_id": 37,
      "mac": "AA:BB:CC:04:C5:4C",
      "device_name": "Device for AOIENTRY",
      "sn": "SN-LNHOCP",
      "id_alarm_type": 4,
      "image_save_enabled": 1,
      "device_enabled": 0,
      "created_at": "2025-05-27T18:56:05.000000Z",
      "updated_at": "2025-06-02T20:34:51.000000Z"
    },
    {
      "id": 8,
      "account_id": 37,
      "mac": "AA:BB:CC:08:3D:5A",
      "device_name": "Device for VFD",
      "sn": "SN-ELTW7A",
      "id_alarm_type": 8,
      "image_save_enabled": 0,
      "device_enabled": 0,
      "created_at": "2025-05-27T18:56:05.000000Z",
      "updated_at": "2025-06-02T20:34:59.000000Z"
    }
  ]
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>API-Key</strong> (string, requerido) – Tu clave de API única</li>
                                                <li><strong>Client-Secret</strong> (string, requerido) – Secreto asociado a la clave</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "API Key o Client Secret inválidos o inactivos."
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>

                                {/* Route 2 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          GET
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/alarms/by-device/&#123;device_id&#125;
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Obtiene todas las alarmas generadas por un dispositivo específico, clasificadas por tipo de alarma inteligente. Requiere autenticación mediante encabezados.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`POST /api/alarms/by-device/14
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "device_id": "14",
  "alarms": {
    "PASSLINECOUNT": [
      {
        "id": 122,
        "general_id": 67,
        "alarm_type_id": 6,
        "object_type": "person",
        "object_state": "leave",
        "count": 1585,
        "created_at": "2025-06-10T00:03:16.000000Z",
        "updated_at": "2025-06-10T00:03:16.000000Z"
      },
      {
        "id": 176,
        "general_id": 117,
        "alarm_type_id": 6,
        "object_type": "person",
        "object_state": "exist",
        "count": 25,
        "created_at": "2025-06-10T00:36:47.000000Z",
        "updated_at": "2025-06-10T00:36:47.000000Z"
      }
    ],
    "TRAFFIC": [
      {
        "id": 140,
        "general_id": 83,
        "alarm_type_id": 7,
        "object_type": "person",
        "object_state": "leave",
        "count": 641,
        "created_at": "2025-06-10T00:19:26.000000Z",
        "updated_at": "2025-06-10T00:19:26.000000Z"
      },
      {
        "id": 212,
        "general_id": 138,
        "alarm_type_id": 7,
        "object_type": "person",
        "object_state": "exist",
        "count": 1,
        "created_at": "2025-06-10T00:50:33.000000Z",
        "updated_at": "2025-06-10T00:50:33.000000Z"
      }
    ]
  }
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>API-Key</strong> (string, requerido) – Tu clave de API única</li>
                                                <li><strong>Client-Secret</strong> (string, requerido) – Secreto asociado a la clave</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de URL:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>device_id</strong> (entero, requerido) – ID del dispositivo para el que se solicitan las alarmas</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "API Key o Client Secret inválidos o inactivos."
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>
                                {/* Route 3 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          GET
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/devices/{'{device_id}'}/alarms/{'{alarm_type}'}
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Obtiene los registros de un tipo específico de alarma para el dispositivo indicado, validando la propiedad del dispositivo mediante autenticación con encabezados.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`POST /api/devices/14/alarms/TRAFFIC
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "device_id": "14",
  "alarm_type": "TRAFFIC",
  "records": [
    {
      "id": 140,
      "general_id": 83,
      "alarm_type_id": 7,
      "object_type": "person",
      "object_state": "leave",
      "count": 641,
      "created_at": "2025-06-10T00:19:26.000000Z",
      "updated_at": "2025-06-10T00:19:26.000000Z"
    },
    {
      "id": 139,
      "general_id": 83,
      "alarm_type_id": 7,
      "object_type": "person",
      "object_state": "enter",
      "count": 642,
      "created_at": "2025-06-10T00:19:26.000000Z",
      "updated_at": "2025-06-10T00:19:26.000000Z"
    },
    {
      "id": 141,
      "general_id": 84,
      "alarm_type_id": 7,
      "object_type": "person",
      "object_state": "leave",
      "count": 642,
      "created_at": "2025-06-10T00:19:38.000000Z",
      "updated_at": "2025-06-10T00:19:38.000000Z"
    },
    {
      "id": 212,
      "general_id": 138,
      "alarm_type_id": 7,
      "object_type": "person",
      "object_state": "exist",
      "count": 1,
      "created_at": "2025-06-10T00:50:33.000000Z",
      "updated_at": "2025-06-10T00:50:33.000000Z"
    }
  ]
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>API-Key</strong> (string, requerido) – Tu clave de API única</li>
                                                <li><strong>Client-Secret</strong> (string, requerido) – Secreto asociado a la clave</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error – sin registros:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "No hay registros para el tipo de alarma 'AVD' en el dispositivo especificado."
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error – tipo de alarma no válido:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "El tipo de alarma 'AVD2' no es válido."
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>
                                {/* Route 4 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          POST
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/devices/related-records
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Consulta registros cercanos en el tiempo de otros dispositivos en relación a eventos ocurridos en un dispositivo principal. Requiere autenticación vía encabezados y permite definir márgenes de tiempo y tipos de alarma opcionales.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`POST /api/devices/related-records
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret

Body:
{
  "trigger_device_id": 1,
  "related_devices": [
    {
      "id": 14,
      "alarm_type": "PASSLINECOUNT"
    },
    {
      "id": 6
    }
  ],
  "time_margin": 1000
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "time_margin": 1000,
  "trigger_device": {
    "id": 1,
    "device_name": "Device for AVD",
    "type": null,
    "records": [
      {
        "id": 3,
        "alarm_id": 3,
        "id_event": 9934,
        "status": "ignored",
        "alarm_type": "AVD",
        "created_at": "2025-06-06T03:43:20.000000Z",
        "updated_at": "2025-06-10T00:41:19.000000Z"
      },
      ...
    ]
  },
  "related_devices": [
    {
      "id": 14,
      "device_name": "Device XYZ",
      "alarm_type_used": "PASSLINECOUNT",
      "matched_records": [
        {
          "for_trigger_record_id": 3,
          "closest_record": {
            ...
          }
        },
        ...
      ]
    },
    {
      "id": 6,
      "device_name": "Device ABC",
      "alarm_type_used": "DEFAULT",
      "matched_records": [
        ...
      ]
    }
  ]
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros del cuerpo (body):</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>trigger_device_id</strong> (entero, requerido) – ID del dispositivo principal cuyas alertas se toman como referencia.</li>
                                                <li><strong>related_devices</strong> (array de objetos, requerido) – Lista de dispositivos a comparar. Cada objeto puede incluir:
                                                    <ul className="ml-4 list-disc list-inside">
                                                        <li><strong>id</strong> (entero, requerido) – ID del dispositivo relacionado.</li>
                                                        <li><strong>alarm_type</strong> (string, opcional) – Tipo de alarma a considerar. Si se omite, se usa el tipo de alarma por defecto del dispositivo.</li>
                                                    </ul>
                                                </li>
                                                <li><strong>time_margin</strong> (entero, opcional) – Margen de tiempo en segundos para considerar registros "cercanos". Valor por defecto: <code>10</code>.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>API-Key</strong> (string, requerido) – Tu clave de API única</li>
                                                <li><strong>Client-Secret</strong> (string, requerido) – Secreto asociado a la clave</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "related_devices": [
    {
      "id": 14,
      "device_name": "Dispositivo desconocido",
      "alarm_type_used": "INVALID_TYPE",
      "error": "El tipo de alarma 'INVALID_TYPE' no es válido."
    },
    {
      "id": 6,
      "error": "No tienes acceso a este dispositivo o no existe."
    }
  ]
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>
                                {/* Route 5 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          POST
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/object-counting/latest-auth
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Devuelve el último estado registrado de conteo de objetos (persona, bicicleta o auto), filtrando opcionalmente por tipo de alarma o ID de dispositivo. Requiere autenticación vía encabezados.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`POST /api/object-counting/latest-auth
Content-Type: application/json
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret

Body:
{
  "object_type": "person",
  "alarm_type": "TRAFFIC",       // opcional: TRAFFIC o PASSLINECOUNT
  "device_id": 14                // opcional: ID del dispositivo
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "object_type": "person",
  "object_state": "exist",
  "timestamp": "2025-06-10 00:50:33"
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros del body:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>object_type</strong> (string, requerido) – Tipo de objeto a consultar: <code>person</code>, <code>bike</code> o <code>car</code></li>
                                                <li><strong>alarm_type</strong> (string, opcional) – Tipo de alarma: <code>TRAFFIC</code> o <code>PASSLINECOUNT</code></li>
                                                <li><strong>device_id</strong> (integer, opcional) – ID del dispositivo del que se desea filtrar el evento</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>API-Key</strong> (string, requerido) – Tu clave de API única</li>
                                                <li><strong>Client-Secret</strong> (string, requerido) – Secreto asociado a la clave</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error (sin registros encontrados):</p>
                                            <pre className="bg-gray-800 text-yellow-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "No se encontró ningún registro que cumpla con los filtros."
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error (credenciales inválidas):</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "API Key o Client Secret inválidos o inactivos."
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error (tipo de alarma inválido):</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "Tipo de alarma inválido"
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>

                                {/* Route 6 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          GET
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/alarm-types/auth
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Obtiene todos los tipos de alarma disponibles. Requiere autenticación a través de encabezados API Key y Client Secret.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`POST /api/alarm-types/auth
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`[
    {
        "smart_type": "AVD",
        "description": "Tampering Alarm"
    },
    {
        "smart_type": "PEA",
        "description": "Line Crossing"
    },
    {
        "smart_type": "PEA2",
        "description": "Sterile Alarm"
    },
    {
        "smart_type": "AOIENTRY",
        "description": "Area Entry Alarm"
    },
    {
        "smart_type": "AOILEAVE",
        "description": "Area Exit Alarm"
    },
    {
        "smart_type": "PASSLINECOUNT",
        "description": "Passline Count"
    },
    {
        "smart_type": "TRAFFIC",
        "description": "Area (Traffic)"
    },
    {
        "smart_type": "VFD",
        "description": "Video Face Detection"
    },
    {
        "smart_type": "VSD",
        "description": "Meta Data"
    },
    {
        "smart_type": "VEHICE",
        "description": "License Plate Recognition"
    }
]`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>API-Key</strong> (string, requerido) – Tu clave de API única</li>
                                                <li><strong>Client-Secret</strong> (string, requerido) – Secreto asociado a la clave</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "API Key o Client Secret inválidos o inactivos."
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>

                                {/* Route 7 */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          GET
        </span>
                                                <h4 className="font-mono text-sm md:text-base font-medium text-gray-900">
                                                    /api/vsd-people/stats
                                                </h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Obtiene estadísticas de personas detectadas por un dispositivo VSD en una fecha específica. Utiliza autenticación por encabezados y parámetros query.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Request Example */}
                                    <div className="mt-4 bg-gray-50 rounded-md p-4 space-y-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Request completo:</p>
                                            <pre className="bg-gray-800 text-gray-200 p-3 rounded-md text-xs overflow-x-auto">
{`GET /api/vsd-people/stats?date=2025-06-06&device_id=9
Headers:
  api_key: tu_api_key
  client_secret: tu_client_secret`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de respuesta:</p>
                                            <pre className="bg-gray-800 text-green-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "date": "2025-06-06",
  "device_id": "9",
  "total_people": 4,
  "stats": {
    "sex": {
      "male": 3,
      "female": 1
    },
    "mask": {
      "mask": 2,
      "no mask": 2
    },
    "hat": {
      "hat": 2,
      "no hat": 2
    },
    "glasses": {
      "glasses": 2,
      "no glasses": 2
    },
    "backpack": {
      "backpack": 3,
      "no backpack": 1
    },
    "shoulderbag": {
      "no shoulderbag": 1,
      "Unknown": 2,
      "shoulderbag": 1
    },
    "age": {
      "youth(18-40)": 4
    },
    "upper_length": {
      "long sleeve": 2,
      "short sleeve": 2
    },
    "upper_color": {
      "blue": 1,
      "black": 1,
      "red": 1,
      "Unknown": 1
    }
  }
}`}
      </pre>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de encabezado:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>api_key</strong> (string, requerido) – Tu clave de API única.</li>
                                                <li><strong>client_secret</strong> (string, requerido) – Secreto asociado a la clave.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Parámetros de consulta:</p>
                                            <ul className="text-xs text-gray-700 list-disc list-inside">
                                                <li><strong>device_id</strong> (integer, requerido) – ID del dispositivo a consultar.</li>
                                                <li><strong>date</strong> (string, opcional, formato YYYY-MM-DD) – Fecha de la consulta. Si no se proporciona, se usa la fecha actual en zona horaria de Los Ángeles.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 mb-1">Ejemplo de error:</p>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "message": "API Key o Client Secret inválidos o inactivos."
}`}
      </pre>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto mt-2">
{`{
  "message": "No se encontró VSD asociado al dispositivo."
}`}
      </pre>
                                            <pre className="bg-gray-800 text-red-200 p-3 rounded-md text-xs overflow-x-auto mt-2">
{`{
  "message": "No se encontraron registros para la fecha 2025-06-09."
}`}
      </pre>
                                        </div>
                                    </div>
                                </div>





                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                {/*<a href="#" className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-1">*/}
                                {/*    <span>Ver documentación completa</span>*/}
                                {/*    <ExternalLink className="h-4 w-4" />*/}
                                {/*</a>*/}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            ¿Listo para aprovechar al máximo tus cámaras Provision ISR?
                        </h2>
                        <p className="text-lg text-red-100 mb-8">
                            Únete a empresas que ya confían en MyAlarmGate para gestionar sus eventos de videovigilancia
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!auth.user && (
                                <Link
                                    href={route("login")}
                                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <span>Iniciar Sesión</span>
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            )}
                            <a
                                href="#api"
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Documentación API</span>
                                <Key className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="bg-red-600 p-2 rounded-lg">
                                        <Bell className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">MyAlarmGate</h3>
                                        <p className="text-gray-400 text-xs">Gestión de Eventos para Cámaras</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 max-w-md text-sm">
                                    Solución integral para la integración, gestión y análisis de eventos de cámaras de videovigilancia
                                    Provision ISR con tecnología avanzada.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-sm">Recursos</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>
                                        <a href="#api" className="hover:text-white transition-colors">
                                            Documentación API
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white transition-colors">
                                            Guías de Configuración
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white transition-colors">
                                            Preguntas Frecuentes
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-sm">Contacto</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>
                                        <a href="#" className="hover:text-white transition-colors">
                                            Soporte Técnico
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white transition-colors">
                                            Ventas
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:text-white transition-colors">
                                            Consultoría
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                            <p>&copy; 2024 MyAlarmGate. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}


