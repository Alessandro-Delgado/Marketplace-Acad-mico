<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'cod_est' => 'required|string|regex:/^U\d+$/i|max:20',
            'nom_us' => 'required|string|max:100',
            'correo' => [
                'required',
                'string',
                'email',
                'max:150',
                'unique:usuario,correo',
                function ($attribute, $value, $fail) use ($request) {
                    $expectedEmail =
                        strtolower($request->cod_est) . '@utp.edu.pe';

                    if (strtolower($value) !== $expectedEmail) {
                        $fail(
                            'El correo institucional debe coincidir con tu código de estudiante.'
                        );
                    }
                },
            ],
            'contrasena' => 'required|string|min:6',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $fotoPath = null;

        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')
                ->store('fotos_perfil', 'public');
        }

        $user = User::create([
            'nom_us' => $request->nom_us,
            'correo' => strtolower($request->correo),
            'contrasena' => $request->contrasena,
            'foto' => $fotoPath,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado con éxito',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => [
                'required',
                'string',
                'email',
                'regex:/@utp\.edu\.pe$/',
            ],
            'contrasena' => 'required|string',
        ]);

        $user = User::where('correo', strtolower($request->correo))
            ->first();

        if (
            !$user ||
            !Hash::check($request->contrasena, $user->contrasena)
        ) {
            throw ValidationException::withMessages([
                'correo' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            'token' => $token,
        ]);
    }
}