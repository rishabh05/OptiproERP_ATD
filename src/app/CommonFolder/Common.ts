
export class Common {
    public href: any = window.location.href;
    public messageConfig: any = {
        closeButton: true,
        opacity: 1,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        // progressBar:true
        iconClasses: {
        error: 'alert alert-danger',
        info: 'alert alert-info ',
        success: 'alert alert-success ',
        warning: 'alert alert-warning'
        }
    }

    //This will get the path of app
    public get_current_url() {
        let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
            temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        return temp;
    }
}