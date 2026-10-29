<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Consultar todos los productos
    public function index()
    {
        $productos = Product::with('categoria')
        ->get()
        ->makeVisible(['usuarioid']);

    return response()->json($productos);
}
    // Registrar un producto nuevo
    public function store(Request $request)
    {
        $reglas = [
            'nom_prod' => 'required|string|max:150',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'estado' => 'required|string|max:20',
            'cat_prodid' => 'required|integer|exists:categoria_prod,cat_prodid',
            'tipo_publicacion' => 'required|in:venta,intercambio',
            'img_prod' => 'nullable',
        ];

        if ($request->hasFile('img_prod')) {
            $reglas['img_prod'] =
                'nullable|image|mimes:jpeg,png,jpg,webp|max:2048';
        } else {
            $reglas['img_prod'] = 'nullable|string|max:255';
        }

        $datos = $request->validate($reglas);

        // En intercambios, el precio se guarda en cero
        if ($datos['tipo_publicacion'] === 'intercambio') {
            $datos['precio'] = 0;
        }

        // Guardar la imagen si se envió un archivo
        if ($request->hasFile('img_prod')) {
            $datos['img_prod'] = $request
                ->file('img_prod')
                ->store('productos', 'public');
        }

        // El vendedor se obtiene del usuario autenticado
        $datos['usuarioid'] = $request->user()->usuarioid;

        $producto = Product::create($datos);

        return response()->json([
            'message' => 'Producto publicado correctamente.',
            'producto' => $producto->load('categoria'),
        ], 201);
    }

    // Consultar un producto por su ID
    public function show(string $id)
    {
        $producto = Product::with('categoria')
            ->findOrFail($id);

        return response()->json($producto);
    }
}
