import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Mark } from '../../../models/mark.interface';
import { SchoolSubject } from '../../../models/subject.interface';
import { Student } from '../../../models/student.interface';

@Component({
  selector: 'app-class-mark-sheet',
  templateUrl: './class-mark-sheet.component.html',
  styleUrls: ['./class-mark-sheet.component.scss']
})
export class ClassMarkSheetComponent implements OnInit, OnChanges {

  @Input() students: Student[];
  @Input() schoolSubjects: SchoolSubject[];
  @Input() busyfetchingMarks: boolean;
  @Input() markSheetError: boolean;
  @Input() AcademicClass: string;
  @Input() AcademicYear: number;
  @Input() AcademicTrimester: string;
  @Input() termMarks: Mark[];
  @Input() markSheetInitialised: boolean;

  @Output() retryFetchMarks = new EventEmitter<any>();
  @Output() saveMarks = new EventEmitter<Mark[]>();

  columnDefs = [];
  rowData = [];

  constructor(
  ) {}

  ngOnChanges(changes: SimpleChanges) {

    // After completing data fetch
    if (changes.busyfetchingMarks && changes.busyfetchingMarks.currentValue === false &&  
      changes.busyfetchingMarks.currentValue !== changes.busyfetchingMarks.previousValue) {

      // Create columns for the grid
      this.createColumns();

      // Populate grid
      this.populateDataGrid();
    }
  }

  ngOnInit() { }

  populateDataGrid() {

    this.rowData = [];

    // If no data for the term yet
    if ( this.objectNotEmptyOrNull(this.termMarks) ) {
      
      console.log('There are marks');

    } else {
      for (let i = 0; i < this.students.length; i++ ) {
        this.rowData.push(
          { name: `${this.students[i].names} ${this.students[i].surname}` }
        );
      }
    }
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  createColumns() {

    this.columnDefs = [{ headerName: 'Name', field: 'name' }];

    for (let k = 0; k < this.schoolSubjects.length; k++) {
      this.columnDefs.push({
        headerName: this.schoolSubjects[k].name,  
        children: [
          { headerName: 'CA', editable: true, field: `ca${this.schoolSubjects[k].id}`},
          { headerName: 'Exam', editable: true, field: `exam${this.schoolSubjects[k].id}`}
        ]
      });
    }
  }
  
  retryFetchMarkSheet() {
    this.retryFetchMarks.emit(null);
  }

  objectNotEmptyOrNull(testObject): boolean {
    try {
      if (testObject[0] && testObject[0].id) {
        return true;
      } else {
        return false;
      } 
    } catch (e) {
      return false;
    }
  }
}
