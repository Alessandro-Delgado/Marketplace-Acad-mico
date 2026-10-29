
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ChatController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/productos', [ProductController::class, 'index']);
Route::get('/productos/{id}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    // Publicar productos requiere iniciar sesión
    Route::post('/productos', [ProductController::class, 'store']);

    // Chat
    Route::get('/conversaciones', [ChatController::class, 'index']);

    Route::post(
        '/conversaciones',
        [ChatController::class, 'crearConversacion']
    );

    Route::get(
        '/conversaciones/{id}/mensajes',
        [ChatController::class, 'mensajes']
    );

    Route::post(
        '/conversaciones/{id}/mensajes',
        [ChatController::class, 'enviarMensaje']
    );
});
