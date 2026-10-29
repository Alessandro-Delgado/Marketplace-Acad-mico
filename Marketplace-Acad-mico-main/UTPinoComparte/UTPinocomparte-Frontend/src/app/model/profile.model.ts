import { User } from "./user.model";

export interface Profile{
    perfilid: number;
    nom: string;
    appell: string;
    telef: string;
    img_perfil: string;
    historialid?: number;
    usuarioid: number;
    
    // Aquí reutilizamos tu modelo User existente
    usuario?: User;
}