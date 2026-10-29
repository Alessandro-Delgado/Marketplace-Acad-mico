<?php
 namespace App\Models;
 use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'perfil';
    protected $primaryKey = 'perfilid';
    protected $fillable = [
        'perfilid',
        'nom',
        'apell',
        'telef',
        'img_perfil',
        'historialid',
        'usuarioid'
    ];

    // Opcional: Relación con el usuario si la necesitas en el backend
    public function usuario()
    {
        //User::class hace referencia al modelo User, el primer 'usuarioid' es la clave foránea en la tabla perfil y el segundo 'usuarioid' es la clave primaria en la tabla usuarios.
        return $this->belongsTo(User::class, 'usuarioid', 'usuarioid');
    }
}