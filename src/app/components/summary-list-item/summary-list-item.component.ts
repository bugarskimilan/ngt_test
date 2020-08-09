import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListItemModel } from 'src/app/store';

@Component({
  selector: 'app-summary-list-item',
  templateUrl: './summary-list-item.component.html',
  styleUrls: ['./summary-list-item.component.scss'],
})
export class SummaryListItemComponent implements OnInit {
  @Input() item: ListItemModel;
  @Output() onSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  onclick() {
    this.onSelected.emit(this.item.id);
  }

  ngOnInit(): void {}
}
