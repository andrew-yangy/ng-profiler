import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentInfoComponent implements OnInit {
  @Input() node;
  constructor() {
  }

  ngOnInit(): void {
  }

}
