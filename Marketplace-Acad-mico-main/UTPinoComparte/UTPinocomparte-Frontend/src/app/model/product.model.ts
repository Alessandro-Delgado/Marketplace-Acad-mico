import { CategoryProd } from "./category.model";

export interface Product {
    productoid: number;
    nom_prod: string;
    img_prod: string;
    precio: number;
    stock: number;
    estado: string;
    cat_prodid: number;
    categoria?: CategoryProd; // Opcional, si Laravel hace un eager loading con "with('categoria')"
}