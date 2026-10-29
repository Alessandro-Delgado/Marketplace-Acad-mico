<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        // $request->user() obtiene automáticamente al usuario autenticado por el token
        $usuarioId = $request->user()->usuarioid;

        // Busca el perfil de ese usuario trayendo también los datos de la tabla usuario
        $perfil = Profile::with('usuario')->where('usuarioid', $usuarioId)->first();

        return response()->json($perfil);
    }
}