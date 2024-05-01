import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EstimatesService } from './estimates.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialog/delete/delete.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { TableExportUtil, TableElement } from '@shared';
import { formatDate, NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatDividerModule } from '@angular/material/divider';
import * as moment from 'moment';
import { TasksModel } from '../all-projects/core/project.model';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../all-projects/core/project.service';
import { RowHeightCache } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estimates',
  templateUrl: './estimates.component.html',

  styleUrls: ['./estimates.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
  MatDividerModule,
  FormDialogComponent
  ],
 
  
})
export class EstimatesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{

  tasks: TasksModel[] = [];
  columns: string[] = ['NomTask', 'description', 'statut', 'priority','FinishDate','startDate','actions'];
  exampleDatabase?: EstimatesService;

  selection = new SelectionModel<TasksModel>(true, []);
  index?: number;
  id?: string;
  p!:any
_id!:any
  t!:any
  dataSource2!: MatTableDataSource<any>;
  constructor(
    private actR : ActivatedRoute,
    public httpClient: HttpClient,
    private projectService: ProjectService,
    public dialog: MatDialog,
    public estimatesService: EstimatesService,
    private snackBar: MatSnackBar,private cdr: ChangeDetectorRef
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  ngOnInit() {
    this.loadData();
    this.actR.params.subscribe(params => {
      this._id = params['_id'];
     this.projectService.getProjectById(this._id).subscribe(data => {
      this.p = data;
  
     });
   });
   this.dataSource2.filterPredicate = (data: any, filter: string) => {
    return data.NomTask.toLowerCase().includes(filter);
  };
    this.estimatesService.getTasks().subscribe({
      next: (data: any) => {
        this.tasks = data;
      
      },
      error: (error) => {
    
      }
    });
    

  }
  loadData() {
    this.actR.params.subscribe(params => {
      this._id = params['_id'];
     this.projectService.getProjectById(this._id).subscribe(data => {
      this.dataSource2 =  new MatTableDataSource(data.tasks);
  
     });
   });
 
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

 
  }
  refresh() {
this.ngOnInit()
  }
  addNew(idProject:string) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
   idP:this._id,
       action: 'add',
         idProject:idProject ,
         tasks :this.p.tasks   ,
         task:this.t      
      },
      direction: tempDirection,
    });
    this.subs.sink =  dialogRef.afterClosed().subscribe(result => {
  
      if (result) {
       

        this.dataSource2=  result

      }
    });
  }
  editCall(row: TasksModel) {
    this.id = row._id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(FormDialogComponent, {
      data: {
        // estimates: row,
        taskId:row._id,
        action: 'edit',
        task:row,
      tasks :this.p.tasks   },
      direction: tempDirection,
    });

  }
  public deleteItem(row: any): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-le!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.estimatesService.deleteTask(row._id).subscribe(() => {
          Swal.fire(
            'Supprimé!',
            'Votre task a été supprimé.',
            'success'
          );
          this.ngOnInit(); // Ou une autre méthode pour actualiser la liste des projets
        }, (error) => {
          // Gérer l'erreur ici, par exemple :
          Swal.fire(
            'Erreur!',
            'La suppression du task a échoué.',
            'error'
          );
        });
      }
    });
  }




  // export table data in excel file


  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
