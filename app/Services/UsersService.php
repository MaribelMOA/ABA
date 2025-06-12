<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UsersService
{
    public static function findUser(array $conditions): ?User
    {
        return User::where($conditions)->first();
    }

    public static function authenticate(array $credentials): ?User
    {
        $user = User::where('email', $credentials['email'])->first();

        if ($user && Hash::check($credentials['password'], $user->password)) {
            return $user;
        }

        return null;
    }

    public static function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return User::create($data);
    }

    public static function confirmEmail(string $email): ?User
    {
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->email_verified_at = now();
            $user->save();
        }

        return $user;
    }

    public static function changePassword(array $data, string $hashedPassword): ?User
    {
        $user = User::find($data['id']);

        if ($user) {
            $user->password = $hashedPassword;
            $user->save();
        }

        return $user;
    }

    public static function readUser(int $id): ?User
    {
        return User::find($id);
    }

    public static function readAllUsers()
    {
        $users = User::all();
        return $users->map(function ($user) {
            $user->role_names = $user->getRoleNames(); // agregamos la propiedad "roles_names"
            return $user;
        });
    }

    public static function updateUser(int $id, array $data): ?User
    {
        $user = User::find($id);

        if ($user) {
            $user->update($data);
        }

        return $user;
    }
    public static function updateUserByEmail(string $email, array $data): ?User
    {
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update($data);
            return $user;
        }

        return null;
    }

    public static function deleteUserByEmail(string $email): bool
    {
        $user = User::where('email', $email)->first();

        if ($user) {
            return $user->delete();
        }

        return false;
    }

    public static function deleteUser(int $id): bool
    {
        $user = User::find($id);

        if ($user) {
            return $user->delete();
        }

        return false;
    }
}
