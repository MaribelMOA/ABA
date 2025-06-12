<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UserLoginRequest;
use App\Http\Requests\CreateUserRequest;
use Illuminate\Support\Facades\Hash;
use function Laravel\Prompts\password;

class AuthController extends Controller
{
    public function register(CreateUserRequest $request){


        $fields = $request->validated();
        $fields['password'] = Hash::make($fields['password']);

        $user = User::create($fields);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('API token of ' . $user->name)->plainTextToken
        ], 201);
    }

    public function login(UserLoginRequest $request){
        $fields= $request->validated();

        $user = User::where('email',$fields['email'])->first();
        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
            ],401);

        }
        $token =$user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return ['message' => 'Logged out'];

    }

}
