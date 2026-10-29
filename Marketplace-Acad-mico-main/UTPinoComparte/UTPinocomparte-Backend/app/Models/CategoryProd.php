<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryProd extends Model
{
    protected $table = 'categoria_prod';
    protected $primaryKey = 'cat_prodid';
    public $timestamps = false;

    protected $fillable = ['nombre'];
}