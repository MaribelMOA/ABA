<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Models\Account;
use App\Models\ApiKey;
use App\Models\Device;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = Account::with('devices','apiKeys')
            ->withCount('devices') // 'devices_count'
            ->get();
        $devices =  Device::all();
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


        $totalAccounts = count($accounts);
        $apiKeys = ApiKey::all();
        $activeApiKeys = $apiKeys->where('active',1)->count();
        $liveApiKeys = $apiKeys->where('mode','live')->count();


        return Inertia::render('accounts', [
            'accounts' => $accounts,
            'totalAccounts'=>$totalAccounts,
            'activeApiKeys'=>$activeApiKeys,
            'liveApiKeys'=>$liveApiKeys,
            'devices'=>$devices,
        ]);
    }

    // Método para obtener todas las cuentas (para el selector)
    public function getAll()
    {
        $accounts = Account::all();

        return Inertia::render('devices', [
            'accounts' => $accounts
        ]);
    }
//    public function getAll()
//    {
//        $accounts = Account::all(); // Esto sí regresa un arreglo
//        return response()->json($accounts);
//    }

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
    public function store(StoreAccountRequest $request)
    {
        $account = Account::create([
            'name' => $request->name,
        ]);

        // Generar API Key y Client Secret
        $apiKey = Str::random(32);
        $clientSecret = Str::random(64);

        ApiKey::create([
            'account_id' => $account->id,
            'api_key' => Hash::make($apiKey),
            'client_secret' => Hash::make($clientSecret),
            'label' => $account->name,
            'mode' => $request->mode,
        ]);

        $newAccountData = [
            'account' => $account,
            'api_key' => $apiKey,
            'client_secret' => $clientSecret,
        ];

//        return redirect()->route('accounts.index')->with([
//            'message' => 'Cuenta creada exitosamente',
//            'newAccountData' => $newAccountData,
//        ]);
        // Renderizar el modal de API Key
        return $this->renderApiKeyModal([
            'title' => '¡Cuenta creada exitosamente!',
            'description' => 'Se ha creado la cuenta y generado las credenciales de API.',
            'accountName' => $account->name,
            'api_key' => $apiKey,
            'client_secret' => $clientSecret,
            'mode' => $request->mode,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        return $account;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account)
    {
        $account->update($request->validated());

        return redirect()->route('accounts.index')->with('message', 'Cuenta actualizado exitosamente');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        $account->apiKeys()->delete();

        // Desasignar dispositivos
        $account->devices()->update(['account_id' => null]);

        // Eliminar cuenta
        $account->delete();

        return redirect()->route('accounts.index')->with('message', 'Cuenta eliminado exitosamente');

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
