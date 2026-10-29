<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $table = 'participante';
    protected $primaryKey = 'participanteid';
    public $timestamps = false;

    protected $fillable = [
        'usuarioid',
        'ultim_lectura',
    ];

    public function usuario()
    {
        return $this->belongsTo(
            User::class,
            'usuarioid',
            'usuarioid'
        );
    }

    public function conversaciones()
    {
        return $this->belongsToMany(
            Conversation::class,
            'conversacion_participante',
            'participanteid',
            'conversacionid'
        );
    }

    public function mensajes()
    {
        return $this->hasMany(
            Message::class,
            'participanteid',
            'participanteid'
        );
    }
}
