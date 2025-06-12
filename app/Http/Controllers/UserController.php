<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Account;
use App\Models\User;
use App\Services\UsersService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function login()
    {
        return view('login');
    }

    public function register()
    {
        return view('register');
    }

    public function changePassword()
    {
        return view('password');
    }

    public function authentication(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $data = $request->only(['email', 'password']);

        $authenticatedUser = UsersService::authenticate($data);

        if ($authenticatedUser) {
            Session::put('id', $authenticatedUser['id']);
            Session::put('role', $authenticatedUser['role']);
            Session::put('name', $authenticatedUser['name']);

            return response()->json(['status' => 'success', 'redirect' => '/']);
        }

        return response()->json(['status' => 'error', 'message' => 'Invalid credentials']);
    }

    public function logout()
    {
        Session::flush();
        return redirect('/login');
    }

    public function index()
    {
        try {
            // Cargar usuarios con cuentas
            $users = User::with(['userAccounts.account'])->get();

            // Mapear roles y cuentas
            $users->map(function ($user) {
                $user->role = $user->getRoleNames()->first() ?? '';
                $user->accounts = $user->userAccounts->pluck('account'); // opcional: puedes simplificar esto según tus relaciones
                return $user;
            });

            // Estadísticas
            $totalUsers = $users->count();
            $totalAdmins = $users->filter(function ($user) {
                return $user->role === 'admin';
            })->count();

            $usersWithAccounts = $users->filter(function ($user) {
                return $user->accounts->isNotEmpty();
            })->count();

            // Obtener todas las cuentas
            $allAccounts = Account::all();

            // Renderizar la vista con Inertia
            return Inertia::render('users', [
                'users' => $users,
                'totalUsers' => $totalUsers,
                'totalAdmins' => $totalAdmins,
                'usersWithAccounts' => $usersWithAccounts,
                'accounts' => $allAccounts,
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ];

        try {
            $user = UsersService::createUser($data);

            $role = Role::firstOrCreate(['name' => $request->input('role')]);
            $user->assignRole($role);

            session()->flash('success', 'Usuario creado correctamente.');
            return redirect()->route('users.index');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear el usuario: ' . $e->getMessage()]);
        }
    }



    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $user->update($request->only(['email', 'name', 'password']));

            if ($request->filled('role')) {
                $role = Role::firstOrCreate(['name' => $request->role]);
                $user->syncRoles([$role]);
            }
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
                $user->save();
            }


            session()->flash('success', 'Usuario actualizado correctamente.');
            return redirect()->route('users.index');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al actualizar el usuario: ' . $e->getMessage()]);
        }
    }


    public function destroy(User $user)
    {
        try {
            $user->delete();
            session()->flash('success', 'Usuario eliminado correctamente.');
            return redirect()->route('users.index');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al eliminar el usuario: ' . $e->getMessage()]);
        }
    }


    public function show(User $user)
    {
        try {
            // Añade el rol
            $user->role = $user->getRoleNames()->first() ?? '';
            return response()->json(["status" => "success", "data" => $user]);
        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
    }

    public function savePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $data = UsersService::confirmEmail($request->email);

        if (!$data) {
            return response()->json(["status" => "error", "message" => "El correo no está registrado."]);
        }

        $hashedPassword = Hash::make($request->password);

        try {
            UsersService::changePassword($data, $hashedPassword);
            return response()->json(["status" => "success", "message" => "Contraseña cambiada correctamente"]);
        } catch (\Exception $e) {
            return response()->json(["status" => "error", "message" => $e->getMessage()]);
        }
    }
}
