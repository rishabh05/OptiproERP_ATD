//this list for Sign In and Sign Out Time.
export class RecordModel {
   Date: string;
   SignInTime: string;
   SignOutTime: string;

   public constructor (Date, SignInTime, SignOutTime) {
       this.Date = Date;
       this.SignInTime = SignInTime;
       this.SignOutTime = SignOutTime;
   }
}
