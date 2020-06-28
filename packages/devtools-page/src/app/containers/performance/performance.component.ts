import { Component, OnInit } from '@angular/core';
import { ViewService } from "@devtools-page/core/view.service";

@Component({
  selector: 'performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {
  constructor(public viewService: ViewService) { }

  ngOnInit(): void {
  }
}
