<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Participant;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
   

    // Listar las conversaciones del usuario autenticado
    public function index(Request $request)
    {
        $usuarioId = $request->user()->usuarioid;

        $conversaciones = Conversation::whereHas(
            'participantes',
            function ($query) use ($usuarioId) {
                $query->where('participante.usuarioid', $usuarioId);
            }
        )
        ->with('participantes.usuario')
        ->orderByDesc('fech_creacion')
        ->get();

        return response()->json($conversaciones);
    }

    // Iniciar una conversación con el vendedor de un producto
    public function crearConversacion(Request $request)
    {
        $datos = $request->validate([
            'productoid' => 'required|integer|exists:producto,productoid',
        ]);

        $usuarioId = $request->user()->usuarioid;

        $producto = Product::findOrFail($datos['productoid']);

        if (!$producto->usuarioid) {
            return response()->json([
                'message' => 'Este producto todavía no tiene un vendedor asignado.',
            ], 422);
        }

        if ((int) $producto->usuarioid === (int) $usuarioId) {
            return response()->json([
                'message' => 'No puedes iniciar una conversación contigo mismo.',
            ], 422);
        }

        $conversacion = DB::transaction(function () use (
            $usuarioId,
            $producto
        ) {
            $conversacion = Conversation::create([
                'tipo' => 'privada',
                'nombre' => 'Chat sobre: ' . $producto->nom_prod,
            ]);

            $comprador = Participant::create([
                'usuarioid' => $usuarioId,
            ]);

            $vendedor = Participant::create([
                'usuarioid' => $producto->usuarioid,
            ]);

            $conversacion->participantes()->attach([
                $comprador->participanteid,
                $vendedor->participanteid,
            ]);

            return $conversacion;
        });

        return response()->json([
            'message' => 'Conversación creada correctamente.',
            'conversacion' => $conversacion->load('participantes.usuario'),
        ], 201);
    }

    // Consultar mensajes de una conversación
    public function mensajes(Request $request, int $id)
    {
        $participante = $this->buscarParticipante($request, $id);

        if (!$participante) {
            return response()->json([
                'message' => 'No tienes acceso a esta conversación.',
            ], 403);
        }

        $mensajes = Message::where('conversacionid', $id)
            ->with('participante.usuario')
            ->orderBy('fech_envio')
            ->get();

        Participant::where('participanteid', $participante->participanteid)
            ->update(['ultim_lectura' => now()]);

        return response()->json($mensajes);
    }

    // Enviar un mensaje
    public function enviarMensaje(Request $request, int $id)
    {
        $datos = $request->validate([
            'txt_msj' => 'required|string|max:5000',
        ]);

        $participante = $this->buscarParticipante($request, $id);

        if (!$participante) {
            return response()->json([
                'message' => 'No tienes acceso a esta conversación.',
            ], 403);
        }

        $mensaje = Message::create([
            'conversacionid' => $id,
            'participanteid' => $participante->participanteid,
            'txt_msj' => trim($datos['txt_msj']),
            'estado' => 'enviado',
        ]);

        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'mensaje' => $mensaje->load('participante.usuario'),
        ], 201);
    }

    // Comprobar que el usuario pertenece a la conversación
    private function buscarParticipante(
        Request $request,
        int $conversacionId
    ): ?Participant {
        return Participant::where(
            'usuarioid',
            $request->user()->usuarioid
        )
        ->whereHas('conversaciones', function ($query) use (
            $conversacionId
        ) {
            $query->where(
                'conversacion.conversacionid',
                $conversacionId
            );
        })
        ->first();
    }
}
