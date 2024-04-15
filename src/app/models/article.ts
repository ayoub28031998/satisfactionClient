export interface Article {
    codeArticle?: string;
    codeFamille?: string;
    codeSousFamille?: string;
    codeType?: string;
    codeMarque?: string;
    codeUnite?: string;
    codeUniteVente?: string | null;
    valeurUniteVente?: number;
    designation?: string;
    dernierPrixAchatHt?: number;
    dernierTauxRemise?: number;
    prixAchatHt?: number;
    marge?: number;
    prixVenteHt?: number;
    codeTva?: string;
    prixVenteTtc?: number;
    liteTauxRemise?: number;
    fodec?: boolean;
    stockable?: boolean;
    actif?: boolean;
    tailleCouleur?: boolean;
    observation?: string;
    numeroSerie?: boolean;
    codeBarre?: string;
    imageCodeBarre?: Uint8Array ;
    logo?: Uint8Array ;
    prixVenteNetHt?: number | null;
    prixVenteTtcsansRemise?: number;
    prixAchatTtcsansRemise?: number;
    codeRayon?: string;
    etage?: string;
    codeDepot?: string;
    grammage?: boolean;

}
export interface LigneBonCommandeVente
{}
export interface LigneFactureVente
{}

export interface Stock {
    codeDepot?: string;
    codeArticle?: string;
    quantite?: number;
    prixUnitaireAchat?: number;
    quaniteMinimale?: number;
    quantiteMaximale?: number;
    libelle?:string;
}
