import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentInfoComponent implements OnInit {
  @Input()
  get node() {
    return this._node;
  }
  set node(n) {
    this._node = n;
    console.log(n.context);
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

  isEmpty(o) {
    return !Object.keys(o).length;
  }

  applyChanges() {
    console.log(this.form.value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.form.reset(this.node.context);
  }
}
