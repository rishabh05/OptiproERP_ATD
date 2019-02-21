import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RecordModel } from 'src/app/DemoData/Data';
import { ToastrService } from 'ngx-toastr';
import { Common } from 'src/app/CommonFolder/Common';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  private Commonser = new Common();
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
  public CurrentTimeFormat: string;
  public OutDateTimeArray: any = [];
  public saveSignInTime: any;
  public language: any = [];
  public arrConfigData: any[];  
  
  //public psURL: string = "http://172.16.6.140/OptiAdmin";
  public psURL: string = "";
  public adminDBName: string = "OPTIPROADMIN";
  public defaultCompnyComboValue: any = [];
 // public listItems: Array<string> = this.defaultCompnyComboValue;
  public listItems: any = [] = this.defaultCompnyComboValue;
  public selectComp:any;

  public showSignIn: boolean;
  public showSignOut: boolean;
  public showInTimeException: any;
  public OutDateTime:any;
  public CurrentDateFormat: string;
  public SAPDateFormat : any = [];

  public clickSignIn: boolean = false;
  modalRef: BsModalRef;

  constructor(private auth:AuthenticationService, private modalService: BsModalService, private toastr: ToastrService,
    private httpClientSer: HttpClient) { }

  public fileURL = this.Commonser.get_current_url() + '/assets';
  
  mytime: Date = new Date();

  ngOnInit() {
    this.disablePassword = true;
    //this.getPSURL();
    //this.selectedValue = this.defaultCompnyComboValue[0];    
    // this.listItems = this.defaultCompnyComboValue;
    // this.selectedValue = this.listItems[0];

    this.httpClientSer.get(this.fileURL + '/configuration.json').subscribe(
      data => {
        this.arrConfigData = data as string[];
        window.localStorage.setItem('arrConfigData', JSON.stringify(this.arrConfigData[0]));

        this.loadLanguage(this.arrConfigData[0].language);
        
        
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
   
  }

 

  //This will load the lang file
  public loadLanguage(langParam) {
    this.httpClientSer.get(this.fileURL + '/i18n/' + langParam + '.json').subscribe(
      data => {
        window.localStorage.setItem('language', JSON.stringify(data));
        this.language = JSON.parse(window.localStorage.getItem('language'));
        this.defaultCompnyComboValue = [{ OPTM_COMPID: this.language.selectcompany }];
        this.listItems = this.defaultCompnyComboValue;
        this.selectedValue = this.listItems[0];
        //this.language.username
        this.getPSURL();
      },
      error => {
        this.toastr.error('', this.language.error_reading_file, this.Commonser.messageConfig.iconClasses.error);
        this.showLoader = false;
      }
    );
  }

  getPSURL() {
    this.auth.getPSURL(this.arrConfigData[0].optiProAttendanceAPIURL,this.adminDBName).subscribe(
      data => {
        if (data != null) {
          this.psURL = data;
          //For code analysis remove in live enviorments.
          //this.psURL = "http://localhost:9500/";
          //this.psURL = "http://172.16.6.140/OptiAdmin";
         
        }
      },
      error => {
        this.toastr.error('', this.language.error_getting_psurl +error, this.Commonser.messageConfig.iconClasses.error);
        this.showLoader = false;
      }
    )
  }

  onExceptionClick(){  

    this.OutDateTime = '';
    for (let i = 0; i < this.recordModel.length; i++) {
      if(this.recordModel[i].OPTM_ENDDATETIME ==  null){
        this.showInTimeException = this.recordModel[i].OPTM_STARTDATETIME; 
        console.log(this.showInTimeException);
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
      this.toastr.error('', this.language.alert_enter_signouttime, this.Commonser.messageConfig.iconClasses.error);
      return;
    } 

    this.auth.getServerDate(this.arrConfigData[0].optiProAttendanceAPIURL,this.selectedValue.OPTM_COMPID).subscribe(
      data => {
        
        if(this.OutDateTime > new Date(data[0].DATEANDTIME)){
          this.toastr.error('', this.language.alert_signouttime_notgreater, this.Commonser.messageConfig.iconClasses.error);
          return;
        }

        if(this.OutDateTime.getDate() == new Date(this.showInTimeException).getDate()){
          if(this.OutDateTime.getMinutes() == new Date(this.showInTimeException).getMinutes()){
          this.toastr.error('', this.language.alert_difference_oneminute, this.Commonser.messageConfig.iconClasses.error);
          return;
          }
        }     
        
        if(this.OutDateTime < new Date(this.showInTimeException)){      
          console.log(this.OutDateTime);
          console.log(new Date(this.showInTimeException));

          this.toastr.error('', this.language.alert_signouttime_notless, this.Commonser.messageConfig.iconClasses.error);
          return;        
        }  

        this.status = 3;
        this.auth.updateRecord(this.arrConfigData[0].optiProAttendanceAPIURL,this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.endDate,this.endDate,this.OutDateTime,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
          data => {
            console.log(data);      
            this.OutDateTime = '';
            this.showSignIn = true;
            this.showSignOut = false;
            this.showGrid = true;
           document.getElementById("closeButton").click();
           this.GetRecord();
          });
        
    });

}

  OnSignIn(){

    if(this.selectedValue.OPTM_COMPID == 'Select Company'){
      this.toastr.error('', this.language.alert_enter_company, this.Commonser.messageConfig.iconClasses.error);      
      return;
    }

    this.clickSignIn = true;

    localStorage.setItem('selectedComp', this.selectedValue.OPTM_COMPID);      
    localStorage.setItem('loggedInUser', this.loginId);
    
   this.todayDate =  new Date();
   // this.EntryDate = Date.now();
   this.EntryDate = new Date();  
   
   this.saveSignInTime = new Date();
   
   this.auth.submitSignIn(this.arrConfigData[0].optiProAttendanceAPIURL, this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.EntryDate,this.todayDate,this.endDate,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
   data => {
    console.log(data);    
    this.recordModel = data.Table;
    this.showGrid = true;
    this.showSignIn = false;
    this.showSignOut = true;
    this.clickSignIn = false;
    for(let i=0 ;i<this.recordModel.length;i++){
      this.recordModel[i].CurrentDateFormat = this.SAPDateFormat[0];
      if(this.recordModel[i].OPTM_ENDDATETIME != null){
        let diffStDt: any = new Date(this.recordModel[i].OPTM_STARTDATETIME).getTime();
        let diffEdDt: any = new Date(this.recordModel[i].OPTM_ENDDATETIME).getTime();
        let difftime = new Date(diffEdDt - diffStDt)
        //let calTime = time / (3600 * 1000);
        
       // this.recordModel[i].DifferenceCal = Math.round(calTime * 100.0)/100.0;
       

       let diffHours = (difftime.getUTCHours());
       let diffMinutes = (difftime.getUTCMinutes());
       var showHours;
       var showMinutes ;
     
     if(diffHours<10){
       showHours = '0'+diffHours;
     }
     else{
       showHours = diffHours;
     }

     if(diffMinutes<10){
       showMinutes = '0'+diffMinutes;
     }
     else{
       showMinutes = diffMinutes;
     }

     this.recordModel[i].DifferenceCal = showHours+ ':'+ showMinutes;  
      } 
    }
    console.log(this.SAPDateFormat);
   });
  }

  OnSignOut(){
   
    this.clickSignIn = false;

     let EndDateTimeNew = new Date();
    
    if(this.saveSignInTime != undefined)
     {
    if(EndDateTimeNew.getDate() == this.saveSignInTime.getDate()){
      if(EndDateTimeNew.getMinutes() == this.saveSignInTime.getMinutes()){
        this.toastr.error('', this.language.alert_difference_oneminute , this.Commonser.messageConfig.iconClasses.error);
        return;
      }
     }
    }
   //else {
    this.showGrid = false;
    //this.todayDate =  new Date();
    this.status = 2;
    
    this.auth.submitSignOut(this.arrConfigData[0].optiProAttendanceAPIURL,this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.endDate,this.endDate,EndDateTimeNew,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
    data => {
      console.log(data);
      this.showGrid = false;
      this.showSignIn = true;
    });
 // }
  }

  OnUserIdBlur(){
   if( this.loginId == "" ||  this.loginId == undefined){
     //alert("Please enter User Id");
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
    
    
    this.auth.getStatusForButtons(this.arrConfigData[0].optiProAttendanceAPIURL,this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID).subscribe(
    data => {
      console.log(data);
      
      if(data == null || data == undefined){
        this.toastr.error('', this.language.alert_table_notexists, this.Commonser.messageConfig.iconClasses.error);
        this.showGrid = false;
        this.showSignOut = false;
        this.showSignIn = false;
        return;
      }
      else{

        this.auth.GetSAPDateFormat(this.arrConfigData[0].optiProAttendanceAPIURL,this.selectedValue.OPTM_COMPID).subscribe(
          dataNew => {
         
            switch(dataNew[0].DateVal){            
            case '0':
            this.CurrentDateFormat = 'dd/MM/yy';
            break;

            case '1':
            this.CurrentDateFormat = 'dd/MM/yyyy';
            break;

            case '2':
            this.CurrentDateFormat = 'MM/dd/yy';
            break;

            case '3':
            this.CurrentDateFormat = 'MM/dd/yyyy';
            break;

            case '4':
            this.CurrentDateFormat = 'yyyy/MM/dd';
            break;

            case '5':
            this.CurrentDateFormat = 'dd/MMMM/yyyy';
            break;

            case '6':
            this.CurrentDateFormat = 'yy/MM/dd';
            break;
          }
          
          switch(dataNew[0].TimeVal){            
            case '0': 
            this.CurrentTimeFormat = 'HH:mm';
            break;

            case '1':
            this.CurrentTimeFormat = 'h:mm a';
            break;
          }

          this.SAPDateFormat.push({DateFormat: this.CurrentDateFormat + ' ' + this.CurrentTimeFormat });

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
        });
     }
    });
  }

  GetRecord(){  

   console.log(this.CurrentDateFormat);                
    this.auth.getRecord(this.arrConfigData[0].optiProAttendanceAPIURL,this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID).subscribe(
      data => {
        console.log(data);
        this.recordModel = data;        

        for(let i=0 ;i<this.recordModel.length;i++){
          this.recordModel[i].CurrentDateFormat = this.SAPDateFormat[0]; 
          
          if(this.recordModel[i].OPTM_ENDDATETIME != null){
          let diffStDt: any = new Date(this.recordModel[i].OPTM_STARTDATETIME).getTime();
          let diffEdDt: any = new Date(this.recordModel[i].OPTM_ENDDATETIME).getTime();
          let difftime = new Date(diffEdDt - diffStDt);
          // let calTime = time / (3600 * 1000);
          
          // this.recordModel[i].DifferenceCal = Math.round(calTime * 100.0)/100.0;

          let diffHours = (difftime.getUTCHours());
          let diffMinutes = (difftime.getUTCMinutes());
          var showHours;
          var showMinutes ;
        
        if(diffHours<10){
          showHours = '0'+diffHours;
        }
        else{
          showHours = diffHours;
        }

        if(diffMinutes<10){
          showMinutes = '0'+diffMinutes;
        }
        else{
          showMinutes = diffMinutes;
        }

        this.recordModel[i].DifferenceCal = showHours+ ':'+ showMinutes;

          }
        }              
      });    
  }

 
  OnPasswordBlur(){

    //if(this.password != null && this.password != undefined && this.password != ''){
      if (this.loginId == "" ||  this.loginId == undefined || this.password == "" || this.password == undefined) {
       // alert("User Id or Password is blank");
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
            this.toastr.error('', this.language.alert_incorrect_useridpassword, this.Commonser.messageConfig.iconClasses.error);
            //this.OnDropDownBlur(0);
          }       

         this.disableDropDown = false;         
        },
        error => {
          this.toastr.error('', this.language.error_login, this.Commonser.messageConfig.iconClasses.error);
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
              this.assignedCompanies = data.Table;              
                if (this.assignedCompanies != null) {
                              
                if (localStorage.getItem('loggedInUser') != null && localStorage.getItem('loggedInUser') != undefined 
                && localStorage.getItem('loggedInUser') == this.loginId) {

                  this.listItems = this.assignedCompanies;
                  this.listItems.unshift({ OPTM_COMPID: this.language.selectcompany })

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
                  this.listItems.unshift({ OPTM_COMPID: this.language.selectcompany })                 
                  this.OnDropDownBlur(0); 
                  
                 }
               else{
                this.listItems = this.assignedCompanies;
                this.listItems.unshift({ OPTM_COMPID: this.language.selectcompany })
                this.selectedValue = this.listItems[0]; 
                this.showGrid = false;
                this.showSignOut = false;                               
               }               
              
              }                             
              }
              else {
               this.toastr.error('', this.language.alert_nocompany_assigned, this.Commonser.messageConfig.iconClasses.error);
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
    

