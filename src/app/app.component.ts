import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  CellValueChangedEvent,
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  SelectionChangedEvent,
  GridApi,
} from 'ag-grid-community';
import { ChampionService } from './champion.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';

// Row Data Interface
interface IRow {
  title: string;
  id: number;
  name: string;
  key: string;
}

// Image Champion Cell Renderer Component
@Component({
  selector: 'app-company-logo-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span *ngIf="value">
      <img
        [alt]="value"
        [src]="
          'https://raw.githubusercontent.com/davidherasp/lol_images/master/champion-squares/' +
          value +
          '.png'
        "
      />
      <p>{{ value }}</p>
    </span>
  `,
  styles: [
    'img {display: block; width: 25px; height: auto; max-height: 50%; margin-right: 12px; filter: brightness(1.2);} span {display: flex; height: 100%; width: 100%; align-items: center} p { text-overflow: ellipsis; overflow: hidden; white-space: nowrap }',
  ],
})
export class ImageRenderChamp implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;
  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}

@Component({
  selector: 'my-app',
  template: `
    <h1>{{ title }}</h1>
    <div class="content">
      <!-- The AG Grid component, with Dimensions, CSS Theme, Row Data, and Column Definition -->
      <ag-grid-angular
        style="width: 100%; height: 550px;"
        [class]="themeClass"
        [rowData]="rowData"
        [columnDefs]="colDefs"
        (gridReady)="onGridReady($event)"
        [defaultColDef]="defaultColDef"
        [pagination]="true"
        (cellValueChanged)="onCellValueChanged($event)"
        (selectionChanged)="onSelectionChanged($event)"
        [rowSelection]="'multiple'"
      >
      </ag-grid-angular>
    </div>
  `,
})
export class AppComponent {
  title = 'Test Angular Capital Management Funds';
  constructor(
    private http: HttpClient,
    private championService: ChampionService
  ) {}
  themeClass = 'ag-theme-quartz';

  // Row Data: The data to be displayed.
  rowData: IRow[] = [];

  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef<IRow>[] = [
    { field: 'name', checkboxSelection: true },
    {
      field: 'key',
      cellRenderer: ImageRenderChamp,
    },

    { field: 'title' },
    { field: 'id', width: 75 },
  ];

  // Default Column Definitions: Apply configuration across all columns
  defaultColDef: ColDef = {
    filter: true,
    editable: true,
  };
  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(`New Cell Value: ${event.value}`);
  };

  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log('Row Selected!');
  };
  onGridReady(params: GridReadyEvent) {
    const api: GridApi = params.api;
    this.championService.getChampions().subscribe((champions) => {
      this.rowData = champions;
      api.setGridOption('rowData', this.rowData);
    });
  }
}
