import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  public showGrid: boolean;
  public todayDate: any;
  public gridData = [];
  public psURL: string = "http://172.16.6.140/OptiAdmin";
  public defaultCompnyComboValue: any = [{ OPTM_COMPID: "Select Company" }];
  public listItems: Array<string> = this.defaultCompnyComboValue;

  modalRef: BsModalRef;

  constructor(private auth:AuthenticationService, private modalService: BsModalService) { }

  ngOnInit() {
  
  }

  OnSignIn(){
    this.showGrid = true;
    this.todayDate =  new Date();
   // this.todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');

    /*this.gridData = [{

      'date': this.todayDate,
      'signIn': ,
      'signOut': 
    }]*/

  }

  OnSignOut(){
    this.showGrid = false;
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
    

