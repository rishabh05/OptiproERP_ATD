//this list for Sign In and Sign Out Time.
export class RecordModel {
    OPTM_ENTRYDATE: string;
    OPTM_STARTDATETIME: string;
    OPTM_ENDDATETIME: string;
    DifferenceCal: number;

   public constructor (Date, SignInTime, SignOutTime, diffCal) {
       this.OPTM_ENTRYDATE = Date;
       this.OPTM_STARTDATETIME = SignInTime;
       this.OPTM_ENDDATETIME = SignOutTime;
       this.DifferenceCal = diffCal;
   }
}
