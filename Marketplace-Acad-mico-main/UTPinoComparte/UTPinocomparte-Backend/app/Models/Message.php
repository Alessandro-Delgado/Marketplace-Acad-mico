<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'mensaje';
    protected $primaryKey = 'mensajeid';
    public $timestamps = false;

    protected $fillable = [
        'conversacionid',
        'participanteid',
        'txt_msj',
        'estado',
    ];

    public function conversacion()
    {
        return $this->belongsTo(
            Conversation::class,
            'conversacionid',
            'conversacionid'
        );
    }

    public function participante()
    {
        return $this->belongsTo(
            Participant::class,
            'participanteid',
            'participanteid'
        );
    }
}
