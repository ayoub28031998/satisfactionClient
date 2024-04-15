import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Article, Stock } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.services';
interface Item {
    id?: number;
    name?: string;
   }
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {
    isEditing=false;
    items: Item[] = [];
    uploadedFiles: any[] = [];
    ArticleDialog=false;
    mode:string="Ajout";
    article:Article={};
    tvaItems:Item[]=[];
    AddModifyFournisseurDialog=false;
    displayDialogSousFamilleArticle=false;
    displayDialogueResponsable=false;
    displayDialogueRetenuSource=false;
    displayDialogFamille=false;
    displayDialogsecteurActivite=false;
    displayDialogville=false;
    displayDialogdevise=false;
    displayDialogpays=false;
    displayDialogsousRegion=false;
    displayDialogmodeReglement=false;
    displayDialogueFonctionContacts=false;
    searchTerm: string = '';
    source:string="";
    newCar = {
        id: '',
        name:''
      };
    selectedItem: Item | null = null;
    defaultInputValue = '0.000000';
    filteredItems: Item[] = [];
    filteredTvaItems: Item[] = [];
    MarqueArticlesItem:Item[] = [];
    stocks?:Stock[]=[];
    // stock?:Stock={};
        selectedCodeFamille: string='';
    defaultMarque:any|undefined;
    newStock:Stock={
        codeDepot:undefined,
        codeArticle:undefined,
        quantite:0,
        prixUnitaireAchat:0,
        quaniteMinimale:0,
        quantiteMaximale:0,
         libelle:undefined,


    }
    newCodeFamille:string="";

      constructor(private articleService:ArticleService,private messageService: MessageService) {}

    ngOnInit(): void {
       this.article.actif=true;
       this.article.stockable=true;
       this.article.fodec=false;
       this.article.dernierPrixAchatHt=0.000000;

       this.articleService.getTvaLook().then((tva:any)=>{
        this.tvaItems=tva ;
        console.log(this.tvaItems);
        this.article.codeTva=tva[0];


       });

       this.getMarque();

       const newStock:Stock={
        codeDepot:undefined,
        codeArticle:undefined,
        libelle:undefined,
        quantite:0,
        prixUnitaireAchat:0,
        quaniteMinimale:0,
        quantiteMaximale:0,

    };
      this.stocks.push(newStock);

    }
    getMarque(){
        this.articleService.getMarqueArticlesLook().then((famille:any)=>{
            this.MarqueArticlesItem=famille as Item[];
            const query="Aucun"
            this.defaultMarque=this.MarqueArticlesItem.filter(item => item.name?.toLowerCase()===(query.toLowerCase()))
            this.article.codeMarque=this.defaultMarque;
            console.log("code marque default",this.defaultMarque);

        });

    }
    //////////////////////////////////////////////////
    ajouterStock() {
        const lastStock = this.stocks[this.stocks.length - 1];
        if (this.isStockValid(lastStock)) {
          this.stocks.push(this.newStock);
          this.newStock ={
            codeDepot:undefined,
            codeArticle:undefined,
            libelle:undefined,

            quantite:0,
            prixUnitaireAchat:0,
            quaniteMinimale:0,
            quantiteMaximale:0,

        };

        }
      }
    isStockValid(stock: Stock): boolean {
        // Add any additional validation logic here.
        return !!(stock   && stock.codeDepot);
      }
      onEditCompleteStock(){
        const lastStock = this.stocks[this.stocks.length - 1];
        if ( lastStock.codeDepot !== undefined) {
            // Check if the last row is valid before adding a new row
            this.ajouterStock();
          }
      }
    //////////////////////////////////////////////////


    searchTvaItem(event: any){
        this.articleService.getTvaLook().then((tva:any)=>{
            this.tvaItems=tva as Item [];
            console.log(this.tvaItems);

           });
        const query = event.query;
        this.filteredTvaItems=this.tvaItems;


    }

    searchItems(event: any,source:string) {

        const query = event.query;
          if(source==="sousFamilleFournisseur"){
            this.filteredItems = this.items.filter(item => item.name?.toLowerCase().includes(query.toLowerCase())) }

         }
      showDetails(source:string)
      {
             if(source=="sousFamilleFournisseur")
            {
                this.filteredItems =
                this.items;this.displayDialogSousFamilleArticle=true}}
    Ajouter(){
        this.ArticleDialog=true;
    }
    cancel(){}
    validateInput() {

        if (typeof this.selectedItem === 'object' && this.selectedItem?.name) {
            const exists = this.filteredItems.some(item => item.name === this.selectedItem?.name);

            if (!exists) {
                this.selectedItem = null;
            }
        } else {
             this.selectedItem = null;
        }
      }
      newItem() {
        // this.isEditing = false;
        // this.modeFournisseur="new"
        // this.newCar = { id: '', name: '' };
        // this.AddModifyFournisseurDialog=true;

      }
      saveCar() {
        // this.saveCarSer(this.newCar).subscribe((data:any) => {
        //   this.displayDialog=false;
        //   this.getVoituresC();
        //   this.displayDialog=true;
        //   this.AddModifyFournisseurDialog=false;
        // });
      }

      updateItem() {
        // this.modeFournisseur="edit"
        // this.newCar = {
        //   id: this.selectedItem?.id?.toString() ?? '',
        //   name: this.selectedItem?.name ?? ''
        // };
        // this.isEditing = true;
        // this.AddModifyFournisseurDialog=true;

      }
      handleDoubleClickFournisseur(){
        this.displayDialogSousFamilleArticle=false;}

      lastClickTime: number = 0;
      handleSingleClickFournisseur(item: any,source:string) {
        console.log(source);
          const currentTime = new Date().getTime();
          const timeDiff = currentTime - this.lastClickTime;
          if (timeDiff < 250) {  // if the two clicks are less than 250ms apart
              this.handleDoubleClickFournisseur();
              return;
          }
          this.lastClickTime = currentTime;
          // Delay the single click action
          setTimeout(() => {
                if (new Date().getTime() - this.lastClickTime > 250) {
                if(source==="familleFournisseur"){this.article.codeSousFamille = item;}
               }
          }, 250);
      }
    //
      filterItems() {
        console.log(this.selectedItem);

          if (this.searchTerm) {
              this.filteredItems = this.items.filter(item => item.name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
          } else {
              this.filteredItems = [...this.items];
          }
      }
      save(){
        // console.log(this.article.codeFamilleArticle);
    }
    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
    selectedImage: any;
    onSelect(event: any) {
      if (event.files && event.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(event.files[0]);
      }
    }
      handleSourceUpdated(sourceUpdated:string){

        this.source=sourceUpdated;
        console.log("gangnsataa",this.source);

      }
      handleArticleUpdated(updatedArticle: any) {
        // Réagir à la mise à jour de l'article
        console.log(updatedArticle);
        if(this.source==="familleArticle"){
            this.article.codeFamille = updatedArticle.codeFamille;
            this.article.codeSousFamille=updatedArticle.codeFamille;
            const codeFamille:any=this.article.codeFamille
            this.articleService.getNEwCodeArticle(codeFamille.id.toString()).then((famille:any)=>{
            this.article.codeArticle=famille as string;
       });

        }
        else if (this.source==="marqueArticle"){
            console.log("mannnn",updatedArticle.codeMarque);

            this.article.codeMarque=updatedArticle.codeFamille;
        }
        else if(this.source==="typeArticle"){
            this.article.codeType=updatedArticle.codeFamille;
        }
        else if(this.source==="unite"){
            this.article.codeUnite=updatedArticle.codeFamille;
        }
        else if(this.source==="depotAchat"){
            this.article.codeDepot=updatedArticle.codeFamille;
        }
        else if(this.source==="depotAchatStock"){
            this.stocks[this.stocks.length - 1].codeDepot=updatedArticle.codeFamille.id;
            this.stocks[this.stocks.length - 1].libelle=updatedArticle.codeFamille.name
            this.stocks[this.stocks.length - 1].codeArticle=this.article.codeArticle;
            console.log(this.stocks[this.stocks.length - 1]);

        }
        console.log(this.article);

      }
}
