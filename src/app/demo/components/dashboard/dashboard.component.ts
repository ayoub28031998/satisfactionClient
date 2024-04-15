import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute } from '@angular/router';
import { FicheService } from 'src/app/services/fiche.services';
import { Pays } from 'src/app/models/pays';
import { Ville } from 'src/app/models/ville';
import { NoteClientSurVisite } from 'src/app/models/noteClientSurVisite';
import { HttpErrorResponse } from '@angular/common/http';
import { ReclamationClient } from 'src/app/models/reclamationClient';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  

    subscription!: Subscription;
    tel1Error: boolean = false;
    mailError: boolean = false;
    msgs: Message[] = [];
    fichelunette: any[];
    reclamationClient: ReclamationClient = {};



    constructor(private route: ActivatedRoute, private ficheService: FicheService, private service: MessageService) { }

    fiche: any = {};
    pays: Pays[] = [];
    villes: Ville[] = [];
    numfiche: any = {}
    numeroVisite: any = {}
    noteClient: NoteClientSurVisite = {
        numeroFiche: '',
        numeroVisiteLunette: 0,
        satistfactionAccueil: 100,
        qualiteConseil: 100,
        qualiteProduit: 100,
        delaiLivraison: 100,
        recommandation: 100,
        pieceJointe: '',
        dateCreation: undefined,
        nomPrenom: '',
        dateVisite: undefined,
        tauxSatisfaction: 100,
        reclamation: '',
        suggestion: ''
    };
    note: boolean = false;
    remplir: boolean = true;
    dejaremplir: boolean = false;
    envoyer: boolean = false;


    ngOnInit() {
        this.dejaremplir = false;
        this.remplir = true;
        this.envoyer = false;

        this.route.params.subscribe(params => {
            this.numfiche = params['param1'];
            this.numeroVisite = params['param2'];

            if (this.numfiche && this.numfiche.includes("%2F")) {
                // Replace "%" with "/" at the 6th position
                this.numfiche = this.numfiche.substr(0, 5) + '/' + this.numfiche.substr(8);
                console.log(this.numfiche)
            }

            this.ficheService.getPays().then((pays: any) => {
                this.pays = pays
                console.log(this.pays)
            });
            this.ficheService.getVilles().then((villes: any) => {
                this.villes = villes
                console.log(this.villes)
            });
            this.ficheService.getFicheByNumeroFiche(this.numfiche).then((fiche: any) => {
                this.fiche = fiche
                console.log(this.fiche)
                if (this.fiche[0].dateNaissance) {
                    const dateParts = this.fiche[0].dateNaissance.split('/');

                    // Ensure dateParts has three elements (day, month, year)
                    if (dateParts.length === 3) {
                        const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

                        // Check if formattedDate is a valid Date
                        if (!isNaN(formattedDate.getTime())) {
                            this.fiche[0].dateNaissance = formattedDate.toISOString().split('T')[0];
                            console.log(this.fiche[0].dateNaissance);
                        } else {
                            console.error('Invalid date format');
                        }
                    } else {
                        console.error('Invalid date format');
                    }
                }

            });
        });




        this.ficheService.getNoteClientSurVisite(this.numfiche, this.numeroVisite).subscribe(
            (response) => {
                console.log("note clients");
                console.log(response);

                if (response[0].numeroFiche == this.numfiche) {
                    this.remplir = false;
                    this.dejaremplir = true;
                    console.log("egale true ");
                }
            }
        );

    }


    // Méthode pour sauvegarder les données
    async save() {
        this.tel1Error = false;
        this.mailError = false;
        this.fiche = this.fiche[0];

        // if (!this.fiche.tel1 || !this.fiche.mail) {
        //     this.handleEmptyFields();
        //     return;
        // }

        console.log("submit");
        console.log(this.fiche);
        console.log(this.noteClient);

        await this.updateFiche();

        this.setNoteClientDetails();

        await this.addNoteClient();

        if (this.noteClient.tauxSatisfaction < 50) {
            await this.handleLowSatisfaction();
        }

        this.resetFlags();
    }

    // Méthode pour gérer les champs vides
    handleEmptyFields() {
        if (!this.fiche.tel1) {
            this.showErrorTelViaMessages();
            this.tel1Error = true;
        }

        if (!this.fiche.mail) {
            this.showErrorMailViaMessages();
            this.mailError = true;
        }
    }

    // Méthode pour mettre à jour la fiche
    async updateFiche() {
        await this.ficheService.partialUpdateFiche(this.fiche.numeroFiche, this.fiche).toPromise();
        console.log("updated success");
    }

    // Méthode pour définir les détails du client
    setNoteClientDetails() {
        this.noteClient.nomPrenom = this.fiche.nom + ' ' + this.fiche.prenom;
        this.noteClient.numeroFiche = this.fiche.numeroFiche;
        this.noteClient.numeroVisiteLunette = this.numeroVisite;
        this.noteClient.dateCreation = new Date();
        this.noteClient.tauxSatisfaction = ((parseFloat(this.noteClient.qualiteConseil.toString()) + parseFloat(this.noteClient.satistfactionAccueil.toString()) + parseFloat(this.noteClient.qualiteProduit.toString()) + parseFloat(this.noteClient.delaiLivraison.toString()) + parseFloat(this.noteClient.recommandation.toString())) / 5);
        console.log(this.noteClient.tauxSatisfaction);
        const formattedDate = this.formatDate(this.noteClient.dateCreation);
        console.log(formattedDate);
    }

    // Méthode pour ajouter la note du client
    async addNoteClient() {
        await this.ficheService.addNoteClient(this.noteClient).toPromise().then(
            (response) => {
                console.log('Note added successfully:', response);
            },
            (error) => {
                console.error('Error adding note:', error);
                if (error instanceof HttpErrorResponse) {
                    console.error('Status:', error.status);
                    console.error('Body:', error.error);
                }
            }
        );
    }

    // Méthode pour gérer les cas de faible satisfaction
    async handleLowSatisfaction() {
        try {
            const response = await this.ficheService.getFicheLunetteByNumFicheNumVisite(this.numfiche, this.numeroVisite);
            this.fichelunette = response;
            console.log(this.fichelunette[0].codeDepot);
        } catch (error) {
            // Gérer l'erreur si nécessaire
        }

        this.setReclamationClientDetails();

        try {
            const response = await this.ficheService.addReclamationClient(this.fichelunette[0].codeDepot, this.reclamationClient);
            console.log("reclamation client");
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    // Méthode pour définir les détails de la réclamation client
    setReclamationClientDetails() {
        this.reclamationClient.DateReclamation = this.noteClient.dateCreation;
        this.reclamationClient.Description = this.noteClient.reclamation;
        this.reclamationClient.NumeroVisite = this.numeroVisite;
        this.reclamationClient.NumeroFiche = this.numfiche;
        this.reclamationClient.Observation = this.noteClient.reclamation;
        this.reclamationClient.CodeArticle = "";
        this.reclamationClient.DesignationArticle = "";
        this.reclamationClient.DecissionDe = "";
        this.reclamationClient.DateResolution = new Date();
        this.reclamationClient.EnChargePar = "";
        this.reclamationClient.Resolution = "";
        this.reclamationClient.TypeArticle = "";
    }

    // Méthode pour réinitialiser les indicateurs
    resetFlags() {
        this.remplir = false;
        this.dejaremplir = false;
        this.envoyer = true;
    }


    showErrorTelViaMessages() {
        this.msgs.push({ severity: 'error', summary: 'Erreur Message', detail: 'Numéro téléphone obligatoire' });
        this.tel1Error = true;
    }

    showErrorMailViaMessages() {
        this.msgs.push({ severity: 'error', summary: 'Erreur Message', detail: 'Email obligatoire' });
        this.mailError = true;
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}

