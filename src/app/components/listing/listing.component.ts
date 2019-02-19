import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
 public language: any = [];
 
 @Input() gridData :any;
        CurrentDateFormat: any;
  //@Output()emitPass: EventEmitter<number> = new EventEmitter<number>();

  
  constructor() { }

  ngOnInit() {
  
    this.language = JSON.parse(window.localStorage.getItem('language'));
    // if(this.CurrentDateFormat == 'DD/MM/YY'){
    //   this.CurrentDateFormat = 'dd/MM/yyyy';
    // }
    //alert(this.CurrentDateFormat);
    //this.CurrentDateFormat = 'dd/MM/yyyy ';

    console.log("--->",this.gridData);
    //console.log("--->",this.CurrentDateFormat);
  }


}
