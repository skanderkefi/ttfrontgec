import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../../dataservice/data.service";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-cmp3wmstegdevise',
  templateUrl: './cmp3wmstegdevise.component.html',
  styleUrls: ['./cmp3wmstegdevise.component.css']
})
export class Cmp3wmstegdeviseComponent implements OnInit {

  date={"startdate":"","enddate":""}
  fournisseur:any;
  selectedFile: File;
  Factures3wmTnd:any[]=[];
  firstn:any; 
  p:number=1;
  factureToValidate={"bordereau":"","createdBy":"","dateFact":"","id":"",
  "devise": "","direction":"","dossier": "" ,"factname":"","fournisseur":"",
  "status":"","montant":"","num_fact":"","num_po":"","objet":"",
  "pathPdf":"","periode_conso":"","structure":"","delai":"","datereception":"",
  "pieceJointe":"","idfiscale":"","raisonRefusAp":"","codeAp":"","whoApHasValidated":"",
  "datValidationParAp":""};

 factureToReject={"bordereau":"","createdBy":"","dateFact":"","id":"",
 "devise": "","direction":"","dossier": "" ,"factname":"","fournisseur":"",
 "status":"","montant":"","num_fact":"","num_po":"","objet":"",
 "pathPdf":"","periode_conso":"","structure":"","delai":"","datereception":"",
 "pieceJointe":"","idfiscale":"","raisonRefusAp":"","codeAp":"","whoApHasRefuse":"",
  "dateRefusParAp":""};

 
 

 
 
  constructor(public dataService:DataService) { }
 
  ngOnInit(): void {
    this.showFacture();
    this.whosconnected();

  }


  Search(){
    if(this.firstn ==""){
      this.ngOnInit();}
    else{
      this.Factures3wmTnd=this.Factures3wmTnd.filter(res=>{
        return res.num_po.toLocaleLowerCase().match(this.firstn.toLocaleLowerCase());
      })
    } 
  }
 
  
  showFacture(){
    this.dataService.showFacture3wm().subscribe((data: any[])=>{
      console.log(data);
      let j=0;
      for(let i=0; i<data.length; i++){
        if(data[i].dossier=="3WM STEG DEVISE" && data[i].status=="sentToAp")
        this.Factures3wmTnd[j]=data[i];
        j++;      }
      for(let i=0; i<this.Factures3wmTnd.length; i++){
        if(this.Factures3wmTnd[i]==null)
        this.Factures3wmTnd.splice(i,1)
      }
      for(let i=0; i<this.Factures3wmTnd.length; i++){
        if(this.Factures3wmTnd[i]==null)
        this.Factures3wmTnd.splice(i,1)
      }
      console.log(this.Factures3wmTnd);
    })
    
     
    } 

  

    factureRejectModal(factureToCreate){
      this.factureToReject= factureToCreate    }

    factureValidateModal(facture){
        this.factureToValidate=facture;
        }


      exportData(tableId: string) {
        this.dataService.exportToFile("facture", tableId);
      }

      convertToPdf() {
  
        const doc = new jsPDF()
        
        autoTable(doc, { html: '#Facture3wmtndTable' })
        doc.save('tableFacture.pdf')
        
        }

        key: string='id';
        reverse: boolean=false;
        sort(key){
          this.key=key;
          this.reverse= !this.reverse;
        }

        rejectFacture(){
          this.whosconnected();
          console.log("matricule = "+this.connectedUser.matricule);

          this.factureToReject.whoApHasRefuse=this.connectedUser.matricule;
          this.factureToReject.status="rejectedFromAp";
          this.factureToReject.dateRefusParAp=this.getToday();
          console.log(this.factureToReject);

          this.dataService.updateFacture3wm(this.factureToReject).subscribe((msg: any[])=>{
            console.log(msg);
            
          }) 
          // location.reload();
        }

        validateFacture(){

          this.whosconnected();
          console.log("connected from vald: "+ this.connectedUser);
          

          this.factureToValidate.whoApHasValidated=this.connectedUser.matricule;
          this.factureToValidate.status="validatedFromAp";
          this.factureToValidate.datValidationParAp=this.getToday();
          console.log(this.factureToValidate);
          this.dataService.updateFacture3wm(this.factureToValidate).subscribe((msg: any[])=>{
            console.log(msg);
          }) 
          // location.reload();
        }
 
      

      searchPerDate(){
       
        
        try{
          let startdate = formatDate(this.date.startdate,'yyyy-MM-dd','en_US');
          let enddate = formatDate(this.date.enddate,'yyyy-MM-dd','en_US');

          
          for(let i=0; i<this.Factures3wmTnd.length; i++){
            
            if (this.Factures3wmTnd[i].dateFact<=startdate || this.Factures3wmTnd[i].dateFact>=enddate){
               this.Factures3wmTnd.splice(i,1)
            }
          }
        
        }catch{
          console.log("no date found !!!!")
        }
         
      }
     

      Users:any[];
      connectedUser:any;
      whosconnected(){
    
        this.dataService.showUsers().subscribe((data: any[])=>{
          this.Users = data;
          
          for(let i=0;i<this.Users.length;i++){
            if (this.Users[i].isactive=="1" && this.Users[i].profil=="AP"){
              this.connectedUser=this.Users[i];
              console.log("connected inmethod:"+this.connectedUser);
              
            }
          }
          })
        }



        getToday():string{
          var d = new Date();
          var curr_date = d.getDate();
          var curr_month = d.getMonth();
          var curr_year = d.getFullYear()
          var months = new Array("Janvier", "Fevrier", "Mars",
            "Avril", "Mai", "Juin", "Juilllet", "Aout", "Septembre",
            "Octobre", "Novembre", "Decembre");  
      
          var today = curr_date + "-" + months[curr_month] + "-" + curr_year;
          return today;
        }
        
      
}
