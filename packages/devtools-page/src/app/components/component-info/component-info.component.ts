import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessageMethod, MessageType } from "../../../../../communication/message.type";
import { Connection } from "../../channel/connection";

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
    this.form = this.fb.group(n.context);
  };
  _node;
  form: FormGroup;
  constructor(private fb: FormBuilder, private connection: Connection) {
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
    this.connection.bgConnection.postMessage({
      type: MessageType.APPLY_CHANGES,
      method: MessageMethod.Request,
      content: {
        ...this._node,
        context: this.form.value
      }
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.form.reset(this.node.context);
  }
}
