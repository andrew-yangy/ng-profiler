import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentInfoComponent implements OnInit {
  @Input()
  get node() {
    return this._node;
  }
  set node(n) {
    this._node = n;
    this.form = this.fb.group(n.context);
  };
  _node;
  form: FormGroup;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  checkType(value) {
    return typeof(value);
  }
}
