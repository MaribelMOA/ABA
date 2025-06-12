<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApiKeyRequest;
use App\Http\Requests\UpdateApiKeyRequest;
use App\Models\Account;
use App\Models\ApiKey;
use App\Models\Device;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ApiKeyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $apiKeys = ApiKey::all(); // Esto sí regresa un arreglo
        return response()->json($apiKeys);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreApiKeyRequest $request)
    {
        // Buscar la cuenta (404 si no existe)
        $account = Account::findOrFail($request->account_id);

        // Generar nuevo API Key y Client Secret
        $apiKey = Str::random(32);
        $clientSecret = Str::random(64);

        // Buscar si ya existe un API Key asociado a esta cuenta
        $existingApiKey = ApiKey::where('account_id', $account->id)->first();

        $isRegeneration = (bool) $existingApiKey;

        if ($existingApiKey) {
            // Actualizar el registro existente
            $existingApiKey->update([
                'api_key' => Hash::make($apiKey),
                'client_secret' => Hash::make($clientSecret),
                'label' => $account->name,
                'mode' => $request->mode,
                'active' => true,
            ]);
        } else {
            // Crear nuevo registro
            ApiKey::create([
                'account_id' => $account->id,
                'api_key' => Hash::make($apiKey),
                'client_secret' => Hash::make($clientSecret),
                'label' => $account->name,
                'mode' => $request->mode,
                'active' => true,
            ]);
        }

        // Renderizar el modal de API Key
        return $this->renderApiKeyModal([
            'title' => $isRegeneration ? '¡API Key regenerada exitosamente!' : '¡API Key creada exitosamente!',
            'description' => $isRegeneration
                ? 'Se ha regenerado la API Key para la cuenta seleccionada.'
                : 'Se ha creado una nueva API Key para la cuenta seleccionada.',
            'accountName' => $account->name,
            'api_key' => $apiKey,
            'client_secret' => $clientSecret,
            'mode' => $request->mode,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ApiKey $apiKey)
    {
        //
    }

    public function findApiKey($accountId)
    {
        // Busca la API Key de la cuenta
        $apiKey = ApiKey::where('account_id', $accountId)->first();

        if (!$apiKey) {
            return response()->json(['message' => 'API Key no encontrada'], 404);
        }

        return response()->json([
            'id' => $apiKey->id,
            'mode' => $apiKey->mode,
            'active' => $apiKey->active
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ApiKey $apiKey)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApiKeyRequest $request, ApiKey $apiKey)
    {
        $data = $request->only(['active', 'mode']);

        $apiKey->update($data);

//        return response()->json([
//            'message' => 'API Key actualizada correctamente.',
//            'api_key' => $apiKey,
//        ], 200);
        return redirect()->route('accounts.index')->with('message', 'Account actualizado exitosamente');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ApiKey $apiKey)
    {
        //        if (!Auth::user()->hasRole('admin')) {
//            return response()->json([
//                'message' => 'No tienes permisos para realizar esta acción.'
//            ], 403);
//        }

        $apiKey->delete();

        return redirect()->route('accounts.index')->with('message', 'API Key eliminada exitosamente');
    }
    private function renderApiKeyModal($data)
    {
        // Obtener datos actualizados para el componente principal
        $accounts = Account::with('devices','apiKeys')
            ->withCount('devices')
            ->get();

        $accounts->map(function ($account) {
            $apiKey = $account->apiKeys->first();
            if ($apiKey) {
                $account->apiKeyInfo = [
                    'mode' => $apiKey->mode,
                    'active' => $apiKey->active,
                    'apiKeyId' => $apiKey->id,
                ];
            } else {
                $account->apiKeyInfo = [
                    'mode' => null,
                    'active' => false,
                    'apiKeyId' => null,
                ];
            }
            return $account;
        });

        $devices = Device::all();
        $totalAccounts = count($accounts);
        $apiKeys = ApiKey::all();
        $activeApiKeys = $apiKeys->where('active', 1)->count();
        $liveApiKeys = $apiKeys->where('mode', 'live')->where('active', 1)->count();

        return Inertia::render('accounts', [
            'accounts' => $accounts,
            'totalAccounts' => $totalAccounts,
            'activeApiKeys' => $activeApiKeys,
            'liveApiKeys' => $liveApiKeys,
            'devices' => $devices,
            // Modal data
            'apiKeyModal' => $data,
        ]);
    }
}
