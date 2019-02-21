//this list for Sign In and Sign Out Time.
export class RecordModel {
    OPTM_ENTRYDATE: string;
    OPTM_STARTDATETIME: string;
    OPTM_ENDDATETIME: string;
    DifferenceCal: any;
    CurrentDateFormat: any;
    CurrentEntryDate: string;


   public constructor (Date, SignInTime, SignOutTime, diffCal, CurrentDateFormat, CurrentEntryDate) {
       this.OPTM_ENTRYDATE = Date;
       this.OPTM_STARTDATETIME = SignInTime;
       this.OPTM_ENDDATETIME = SignOutTime;
       this.DifferenceCal = diffCal;
       this.CurrentDateFormat = CurrentDateFormat;
       this.CurrentEntryDate = CurrentEntryDate;
   }
}
