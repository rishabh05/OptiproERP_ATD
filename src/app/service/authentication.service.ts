import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //public serviceUrl: string = 'http://localhost:25875/';
  public serviceUrl: string = 'http://localhost:38866/';

  constructor(private httpClient : HttpClient) { }

   //defining properties for the call 
   httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json'
      })
    };

  //Login function to hit login API
  login(loginId:string,password:string,psURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ Login: JSON.stringify([{ User: loginId, Password: password, IsAdmin: false }]) };
  //Return the response form the API  
  return this.httpClient.post(psURL+"/api/login/ValidateUserLogin",jObject,this.httpOptions);
  }

   //This function will get Company acc. to User
   getCompany(loginId:string,psURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ Username: JSON.stringify([{ Username: loginId ,Product: "SFES"}]) };
    //Return the response form the API  
    return this.httpClient.post(psURL+"/api/login/GetCompaniesAndLanguages",jObject,this.httpOptions)
  }

  //Get psURL
  getPSURL(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { PSURL: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
    //Return the response form the API  
    return this.httpClient.post(this.serviceUrl + "/Login/GetPSURL", jObject, this.httpOptions);  
  }

  getRecord(CompanyDBID:string,EmpId:number):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ ATDRecord: JSON.stringify([{ CompanyDBID: CompanyDBID, EmpId: EmpId
  }]) };
  //Return the response form the API  
  return this.httpClient.post(this.serviceUrl +"/Login/GetRecord",jObject,this.httpOptions);
  }  
   
  submitSignIn(CompanyDBID:string,EmpId:number,
    EntryDate:Date,StartDateTime:any,EndDateTime:any,Status:number,
    Imported:boolean,ImportDate:Date,ModifyDate:Date,UserId:any):Observable<any>{

   let StartDateTimeNew = new Date(StartDateTime).toLocaleString();

  //JSON Obeject Prepared to be send as a param to API
  let jObject:any={ ATDRecord: JSON.stringify([{ 
    CompanyDBID: CompanyDBID, 
    EmpId: EmpId, 
    EntryDate:EntryDate,
    StartDateTime:StartDateTimeNew,
    //EndDateTime:'',
    Status:1,
    Imported:'N',
    ImportDate:'',
    ModifyDate:'',
    UserId:UserId    
  }]) };

  //Return the response form the API  
  return this.httpClient.post(this.serviceUrl +"/Login/SubmitRecord",jObject,this.httpOptions);
  }  

  getStatusForButtons(CompanyDBID:string,EmpId:number):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ ATDRecord: JSON.stringify([{ CompanyDBID: CompanyDBID, EmpId: EmpId
  }]) };
  //Return the response form the API  
  return this.httpClient.post(this.serviceUrl +"/Login/GetStatus",jObject,this.httpOptions);
  }

  submitSignOut(CompanyDBID:string,EmpId:number,
    EntryDate:Date,StartDateTime:any,EndDateTime:any,Status:number,
    Imported:boolean,ImportDate:Date,ModifyDate:Date,UserId:any):Observable<any>{

   let EndDateTimeNew = new Date(EndDateTime).toLocaleString();

  //JSON Obeject Prepared to be send as a param to API
  let jObject:any={ ATDRecord: JSON.stringify([{ 
    CompanyDBID: CompanyDBID, 
    EmpId: EmpId, 
    EntryDate:'',
    StartDateTime:'',
    EndDateTime:EndDateTimeNew,
    Status:Status,
    Imported:'N',
    ImportDate:'',
    ModifyDate:'',
    UserId:UserId    
  }]) };

  //Return the response form the API  
  return this.httpClient.post(this.serviceUrl +"/Login/SignOutRecord",jObject,this.httpOptions);
  }

  //Get Server Date
  getServerDate(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ ATDRecord: JSON.stringify([{ 
     CompanyDBID: CompanyDBID
   }])};
 //Return the response form the API  
 return this.httpClient.post(this.serviceUrl+"/Login/GetServerDate",jObject,this.httpOptions);
 }

 //Get Server Date
 getMinutes(CompanyDBID:string,OutDateTime:any):Observable<any>{
  //JSON Obeject Prepared to be send as a param to API
  let jObject:any={ ATDRecord: JSON.stringify([{ 
   CompanyDBID: CompanyDBID,
   OutDateTime:OutDateTime
 }])};
//Return the response form the API  
return this.httpClient.post(this.serviceUrl+"/Login/GetMinutes",jObject,this.httpOptions);
}

  updateRecord(CompanyDBID:string,EmpId:number,
    EntryDate:Date,StartDateTime:any,EndDateTime:any,Status:number,
    Imported:boolean,ImportDate:Date,ModifyDate:Date,UserId:any):Observable<any>{

   let EndDateTimeNew = new Date(EndDateTime).toLocaleString();

  //JSON Obeject Prepared to be send as a param to API
  let jObject:any={ ATDRecord: JSON.stringify([{ 
    CompanyDBID: CompanyDBID, 
    EmpId: EmpId, 
    EntryDate:'',
    StartDateTime:'',
    EndDateTime:EndDateTimeNew,
    Status:Status,
    Imported:'N',
    ImportDate:'',
    ModifyDate:'',
    UserId:UserId    
  }]) };

  //Return the response form the API  
  return this.httpClient.post(this.serviceUrl +"/Login/UpdateRecord",jObject,this.httpOptions);
  }

}
