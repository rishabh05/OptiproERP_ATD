import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RecordModel } from 'src/app/DemoData/Data';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public loginId: string;
  public password: string;
  public showLoader: boolean;
  public modelSource: any = [];
  public assignedCompanies: any = [];
  public selectedValue: any = [];
  public showGrid: boolean = false;
  public todayDate: any;
  public gridData = [];
  public EntryDate:any;
  public status: number;
  public endDate: any;
  public imported: boolean;
  public importDate: any;
  public modifyDate: any;
  public empId:number;
  public recordModel: RecordModel[]; 
  public disableDropDown : boolean = true;
  public disablePassword: boolean= true;

  public saveSignInTime: any;
  
  //public psURL: string = "http://172.16.6.140/OptiAdmin";
  public psURL: string = "";
  public adminDBName: string = "OPTIPROADMIN";
  public defaultCompnyComboValue: any = [{ OPTM_COMPID: "Select Company" }];
 // public listItems: Array<string> = this.defaultCompnyComboValue;
  public listItems: any = [] = this.defaultCompnyComboValue;
  public selectComp:any;

  public showSignIn: boolean;
  public showSignOut: boolean;
  public showInTimeException: any;
  public OutDateTime:any;
  public OutDateTimeArray: any [];

  public clickSignIn: boolean = false;
  modalRef: BsModalRef;

  constructor(private auth:AuthenticationService, private modalService: BsModalService) { }
  
  mytime: Date = new Date();

  ngOnInit() {
    this.getPSURL();
    //this.selectedValue = this.defaultCompnyComboValue[0];    
    this.listItems = this.defaultCompnyComboValue;
    this.selectedValue = this.listItems[0];
  }

  getPSURL() {
    this.auth.getPSURL(this.adminDBName).subscribe(
      data => {
        if (data != null) {
          this.psURL = data;
          //For code analysis remove in live enviorments.
          //this.psURL = "http://localhost:9500/";
          //this.psURL = "http://172.16.6.140/OptiAdmin";
        }
      },
      error => {
        //this.toastr.error('', 'There was some error', this.baseClassObj.messageConfig);
        alert('There was an error in getting psURL:  '+error);
        this.showLoader = false;
      }
    )
  }

  onExceptionClick(){    
    this.OutDateTime = '';
    for (let i = 0; i < this.recordModel.length; i++) {
      if(this.recordModel[i].OPTM_ENDDATETIME ==  null){
        this.showInTimeException = this.recordModel[i].OPTM_STARTDATETIME; 
        break;
     }
   } 

  //  this.auth.getMinutes(this.selectedValue.OPTM_COMPID,this.showInTimeException).subscribe(
  //   data => {
  //     console.log(data);
  //   });

  }

  onUpdate(){
    this.todayDate = new Date();
    //let EndDateTimeNew = new Date();
    if(this.OutDateTime == undefined || this.OutDateTime == ''){   
      alert('Please insert SignOut Time');
      return;
    } 
    else if(this.OutDateTime < new Date(this.showInTimeException)){
      alert("Sign Out Time cannot be less than Sign In Time");
      return;
    }
    // else if(this.OutDateTime.getDate() == new Date(this.showInTimeException).getDate()){
    //   if(this.OutDateTime.getMinutes() == new Date(this.showInTimeException).getMinutes()){
    //     alert("There must be difference of 1 minute between Sign In and Sign Out Time");
    //     return;
    //   }
    // }  

    // else if(this.OutDateTime.getDate() == this.saveSignInTime.getDate()){
    //   if(this.OutDateTime.getMinutes() == this.saveSignInTime.getMinutes()){
    //     alert("There must be difference of 1 minute between Sign In and Sign Out Time");
    //     return;
    //   }
    //  }
    else if(this.OutDateTime > this.todayDate){
      alert("Sign Out Time cannot be greater than Current Date and Time");
      return;
    }
    else {
      this.status = 3;
      this.auth.updateRecord(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.endDate,this.endDate,this.OutDateTime,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
        data => {
          console.log(data);      
          this.OutDateTime = '';
          this.showSignIn = true;
          this.showSignOut = false;
          this.showGrid = true;
         document.getElementById("closeButton").click();
         this.GetRecord();
        });  
    }   
  }

  OnSignIn(){

    this.clickSignIn = true;

    localStorage.setItem('selectedComp', this.selectedValue.OPTM_COMPID);      
    localStorage.setItem('loggedInUser', this.loginId);
    
   this.todayDate =  new Date();
   // this.EntryDate = Date.now();
   this.EntryDate = new Date();  
   
   this.saveSignInTime = new Date();
   
   this.auth.submitSignIn(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.EntryDate,this.todayDate,this.endDate,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
   data => {
    console.log(data);    
    this.recordModel = data.Table;
    this.showGrid = true;
    this.showSignIn = false;
    this.showSignOut = true;
    this.clickSignIn = false;
   });
  }

  OnSignOut(){
    //this.onExceptionClick();   

    // this.auth.getServerDate(this.selectedValue.OPTM_COMPID).subscribe(
    //   data => {
    //     console.log(data);
    // });
    this.clickSignIn = false;

    let EndDateTimeNew = new Date();

    if(EndDateTimeNew.getDate() == this.saveSignInTime.getDate()){
      if(EndDateTimeNew.getMinutes() == this.saveSignInTime.getMinutes()){
        alert("There must be difference of 1 minute between Sign In and Sign Out Time");
        return;
      }
     }
   //else {
    this.showGrid = false;
    //this.todayDate =  new Date();
    this.status = 2;
    
    this.auth.submitSignOut(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.endDate,this.endDate,EndDateTimeNew,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
    data => {
      console.log(data);
      this.showGrid = false;
      this.showSignIn = true;
    });
 // }
  }

  OnUserIdBlur(){
   if( this.loginId == "" ||  this.loginId == undefined){
     alert("Please enter User Id");
     return;
   }
   else {
      this.disablePassword = false;
   }
  }

  OnDropDownBlur(event){
    if(this.selectedValue == undefined || this.selectedValue == '' || this.selectedValue == null){
      return;
    }
    if(this.selectedValue.OPTM_COMPID == 'Select Company'){
      this.showGrid = false;
      this.showSignOut = false;
      return;
    }
    this.auth.getStatusForButtons(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID).subscribe(
    data => {
      console.log(data);
      
      if(data == null || data == undefined){
        alert("Table does not exist in this company");
        this.showGrid = false;
      //  this.showSignIn = false;
        this.showSignOut = false;
        return;
      }
      else{
      if(data == [] || data.length == 0 || data[0].OPTM_STATUS == 2 || data[0].OPTM_STATUS == 3){
        this.showSignIn = true;
        this.showSignOut = false;
      }
      else if(data[0].OPTM_STATUS == 1){
        this.showGrid = true;
        this.showSignIn = false;
        this.showSignOut = true;
        this.GetRecord();
      }
    }
    });
  }

  GetRecord(){
    this.auth.getRecord(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID).subscribe(
      data => {
        console.log(data);
        this.recordModel = data;          
      });
  }

 
  OnPasswordBlur(){

    //if(this.password != null && this.password != undefined && this.password != ''){
      if (this.loginId == "" ||  this.loginId == undefined || this.password == "" || this.password == undefined) {
        alert("User Id or Password is blank");
        return;
      }
      
      else{

      this.auth.login(this.loginId, this.password, this.psURL).subscribe(
        data => {
          this.modelSource = data;

          if (this.modelSource != null && this.modelSource.Table.length > 0 && this.modelSource.Table[0].OPTM_ACTIVE == 1) {
            this.getCompanies();
            
          }
          else{
            this.listItems = this.defaultCompnyComboValue;
            this.selectedValue = this.listItems[0];
            //this.OnDropDownBlur(0);
          }       

         this.disableDropDown = false;         
        },
        error => {
          alert('There was some error');
          this.showLoader = false;
        }       
      );

      }
  
      }

      getCompanies(){
        this.auth.getCompany(this.loginId, this.psURL).subscribe(
          data =>
           {
             
            this.modelSource = data;
            if (this.modelSource != undefined && this.modelSource != null && this.modelSource.Table.length > 0)
            {
              //Show the Company Combo box          
              //this.assignedCompanies = data.Table;
              this.assignedCompanies = data.Table;
              //if (this.assignedCompanies != null) {
                if (this.assignedCompanies != null) {
                //If comp found   
                
                if (localStorage.getItem('loggedInUser') != null && localStorage.getItem('loggedInUser') != undefined 
                && localStorage.getItem('loggedInUser') == this.loginId) {

                  this.listItems = this.assignedCompanies;
                  this.listItems.unshift({ OPTM_COMPID: "Select Company" })

                for (let i = 0; i < this.listItems.length; i++) {
                  if(this.listItems[i].OPTM_COMPID ==  localStorage.getItem('selectedComp')){
                    this.selectedValue = this.listItems[i]; 
                    this.OnDropDownBlur(0);                    
                 }
               }                        
              }
               else {
                 if(this.assignedCompanies.length == 1){
                  this.listItems = this.assignedCompanies;                  
                  this.selectedValue = this.assignedCompanies[0]; 
                  this.listItems.unshift({ OPTM_COMPID: "Select Company" })                 
                  this.OnDropDownBlur(0); 
                 }
               else{
                this.listItems = this.assignedCompanies;
                this.listItems.unshift({ OPTM_COMPID: "Select Company" })
                this.selectedValue = this.listItems[0]; 
                this.showGrid = false;
                this.showSignOut = false;                               
               }               
              
              }                             
              }
              else {
                alert("No Company is assigned to the user");
              }
            
            }
    
          }
          
        )

      }

      openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
          Object.assign({}, { class: 'modal-dialog-centered' }));
          this.onExceptionClick();
      }
    }
    

