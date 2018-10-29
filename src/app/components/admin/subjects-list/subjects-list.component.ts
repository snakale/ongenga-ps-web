
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { SchoolSubject } from '../../../models/subject.interface';
import { SchoolGrade } from '../../../enums/grades.enum';

@Component({
  selector: 'app-admin-subjects-list',
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.scss']
})
export class AdminSubjectsListComponent implements OnChanges {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) dataTable: MatTable<SchoolSubject>;
  dataSource: MatTableDataSource<SchoolSubject>; // DataTableDataSource;

  gradeEnumType = SchoolGrade;

  @Input() subjects: SchoolSubject[];
  @Output() subjectClicked = new EventEmitter<SchoolSubject>();
  @Output() addNewSubjectClicked = new EventEmitter<void>();
  @Output() removeSubject = new EventEmitter<SchoolSubject>();

  displayedColumns = ['name', 'grade', 'creation_date', 'last_update', 'edit'];

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.subjects.currentValue !== null ) {
      if ( changes.subjects.currentValue !== changes.subjects.previousValue && this.hasSchoolSubjectObject()) { 
        this.dataSource = new MatTableDataSource(); 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.subjects;    
      }
    }
  }

  subjectsAvailable() {
    return this.subjects && this.subjects !== null && this.hasSchoolSubjectObject();
  }

  hasSchoolSubjectObject(): boolean {
    try {
      if (this.subjects[0] && this.subjects[0].id) {
        return true;
      } else {
        return false;
      } 
    } catch (e) {
      return false;
    }
  }

  selectSubject(sub: SchoolSubject) {
    this.subjectClicked.emit(sub);
  }

  addNewSubject() {
    this.addNewSubjectClicked.emit();
  }

  deleteSubject(subject) {
    this.removeSubject.emit(subject);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
