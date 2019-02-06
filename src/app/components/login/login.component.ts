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
  
  //public psURL: string = "http://172.16.6.140/OptiAdmin";
  public psURL: string = "";
  public adminDBName: string = "OPTIPROADMIN";
  public defaultCompnyComboValue: any = [{ OPTM_COMPID: "Select Company" }];
  public listItems: Array<string> = this.defaultCompnyComboValue;

  modalRef: BsModalRef;

  constructor(private auth:AuthenticationService, private modalService: BsModalService) { }

  ngOnInit() {
    this.getPSURL();
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
        alert('There was some error in getting psURL:  '+error);
        this.showLoader = false;
      }
    )
  }

  OnSignIn(){
    
    this.todayDate =  new Date();
   // this.EntryDate = Date.now();
   this.EntryDate = new Date();
    
   
   this.auth.submitSignIn(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.EntryDate,this.todayDate,this.endDate,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
   data => {
    console.log(data);
    
    this.recordModel = data.Table;
    this.showGrid = true;
   });
  }

  OnSignOut(){
    this.showGrid = false;
    
    /*this.auth.submitSignOut(this.selectedValue.OPTM_COMPID,this.selectedValue.OPTM_EMPID,this.EntryDate,this.todayDate,this.endDate,this.status,this.imported,this.importDate,this.modifyDate,this.loginId).subscribe(
    data => {
      console.log(data);
      
      //this.recordModel = data.Table;
      this.showGrid = false;
    });*/
  }

  OnPasswordBlur(){

    //if(this.password != null && this.password != undefined && this.password != ''){
      this.auth.login(this.loginId, this.password, this.psURL).subscribe(
        data => {
          this.modelSource = data;

          if (this.modelSource != null && this.modelSource.Table.length > 0 && this.modelSource.Table[0].OPTM_ACTIVE == 1) {
            this.getCompanies();
          }
          else{
            this.listItems = this.defaultCompnyComboValue;
            this.selectedValue = this.listItems[0];
          }
        },
        error => {
          alert('There was some error');
          this.showLoader = false;
        }
      );
  
      }

      getCompanies(){
        this.auth.getCompany(this.loginId, this.psURL).subscribe(
          data =>
           {
             
            this.modelSource = data;
            if (this.modelSource != undefined && this.modelSource != null && this.modelSource.Table.length > 0)
            {
              //Show the Company Combo box          
              this.assignedCompanies = data.Table;
              if (this.assignedCompanies != null) {
                //If comp found            
                this.selectedValue = this.assignedCompanies[0];            
                
              }
              else {
                
              }
            
            }
    
          }
          
        )

      }

      openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
          Object.assign({}, { class: 'modal-dialog-centered' }));
      }
    }
    

