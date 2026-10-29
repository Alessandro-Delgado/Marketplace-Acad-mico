<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $table = 'conversacion';
    protected $primaryKey = 'conversacionid';
    public $timestamps = false;

    protected $fillable = [
        'tipo',
        'nombre',
    ];

    public function participantes()
    {
        return $this->belongsToMany(
            Participant::class,
            'conversacion_participante',
            'conversacionid',
            'participanteid'
        );
    }

    public function mensajes()
    {
        return $this->hasMany(
            Message::class,
            'conversacionid',
            'conversacionid'
        )->orderBy('fech_envio');
    }
}
