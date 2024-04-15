import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NoteClientSurVisite } from '../models/noteClientSurVisite';
import { ReclamationClient } from '../models/reclamationClient';

@Injectable({
  providedIn: 'root'
})
export class FicheService {
    urlApi:string=environment.urlApi;

  constructor(private http: HttpClient) { }

  getFicheByNumeroFiche(numFiche : string){
    console.log(numFiche)
    return this.http.post<any>(this.urlApi + "FicheByNumeroFiche", { NumeroFiche: numFiche }).toPromise();
  }

  getPays(){   
    return this.http.get<any>(this.urlApi + "Pays").toPromise();
  }

  getVilles(){   
    return this.http.get<any>(this.urlApi + "Villes").toPromise();
  }

  getVilleById(codeVille:string){   
    return this.http.get<any>(this.urlApi + "Villes/" + codeVille).toPromise();
  }


  partialUpdateFiche(numeroFiche: string, ficheMiseAJour: any): Observable<any> {
    const encodedNumeroFiche = encodeURIComponent(numeroFiche);
    //const url = `${this.urlApi}${encodedNumeroFiche}`;
    return this.http.put(this.urlApi + "Fiches/" +encodedNumeroFiche , ficheMiseAJour);
  }

  addNoteClient(note: NoteClientSurVisite): Observable<NoteClientSurVisite> {
     return this.http.post<NoteClientSurVisite>(this.urlApi + "NoteClientSurVisites/ajouterNoteClient",note);
  }
  
  getNoteClientSurVisite(numeroFiche: string, numeroVisite: number): Observable<NoteClientSurVisite[]> {
    const url = `${this.urlApi}NoteClientSurVisites/GetNoteClientSurVisite?numeroFiche=${numeroFiche}&numeroVisite=${numeroVisite}`;
    return this.http.get<NoteClientSurVisite[]>(url);
  }
  
  getFicheLunetteByNumFicheNumVisite(numeroFiche: string, numeroVisite: number): Promise<any[]> {
    const url = `${this.urlApi}FicheLunettes/FicheLunette?numeroFiche=${encodeURIComponent(numeroFiche)}&numeroVisite=${numeroVisite}`;
    return this.http.get<any[]>(url).toPromise();
  }


  addReclamationClient(codeDepot: string, reclamation: ReclamationClient): Promise<any> {
    const url = `${this.urlApi}ReclamationClients/ajouterReclamationClient/${codeDepot}`;

    return this.http.post<any>(url, reclamation)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            console.error('An error occurred:', error.error.message);
          } else {
            // L'erreur vient du serveur, analysez les erreurs de validation renvoyées
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${JSON.stringify(error.error)}`
            );
            // Afficher les erreurs de validation
            if (error.error && error.error.errors) {
              console.error('Validation errors:', error.error.errors);
            }
          }
          // Renvoyer une erreur observable avec une description de l'erreur
          return throwError('Something bad happened; please try again later.');
        })
      )
      .toPromise();
  }

 
}
