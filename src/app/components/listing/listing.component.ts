import { Component, OnInit } from '@angular/core';
import { data } from '../../DemoData/Data';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public gridData: any[] = data;

}
