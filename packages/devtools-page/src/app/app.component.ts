import { Component, OnInit } from '@angular/core';
import { NodeService } from "./core/node.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public node: NodeService) {}

  ngOnInit() {
  }

}
