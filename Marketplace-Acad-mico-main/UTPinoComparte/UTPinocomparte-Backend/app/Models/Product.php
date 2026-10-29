<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'producto';
    protected $primaryKey = 'productoid';
    public $timestamps = false;

   protected $fillable = [
    'nom_prod',
    'img_prod',
    'precio',
    'stock',
    'estado',
    'cat_prodid',
    'tipo_publicacion',
    'usuarioid',
];

    public function categoria()
    {
        return $this->belongsTo(
            CategoryProd::class,
            'cat_prodid',
            'cat_prodid'
        );
    }

    public function publicaciones()
    {
        return $this->hasMany(
            Publication::class,
            'productoid',
            'productoid'
        );
    }
}
