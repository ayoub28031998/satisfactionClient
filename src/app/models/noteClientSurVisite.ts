export interface NoteClientSurVisite {
    numeroFiche: string;
    numeroVisiteLunette: number;
    satistfactionAccueil: number;
    qualiteConseil: number;
    qualiteProduit: number;
    delaiLivraison: number;
    recommandation: number;
    pieceJointe: string; // Assuming you store file paths or references here
    dateCreation: Date; // Adjust based on the actual data type in your database
    nomPrenom: string;
    dateVisite: Date; // Adjust based on the actual data type in your database
    tauxSatisfaction: number;
    reclamation: string;
    suggestion: string;
}
