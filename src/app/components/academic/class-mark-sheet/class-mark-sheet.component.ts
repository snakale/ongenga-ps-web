import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('marksGrid', {read: ElementRef}) marksGridRef: ElementRef;

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

    for (let i = 0; i < this.students.length; i++ ) {

      const studentRow = { name: `${this.students[i].names} ${this.students[i].surname}` };

      for (let k = 0; k < this.schoolSubjects.length; k++) { 

        const studentSubjectMark = this.termMarks
          .find(mark => mark.student_id === this.students[i].id && mark.subject_id === this.schoolSubjects[k].id);

        this.populateStudentMarksForSubject(
          studentRow, 
          this.schoolSubjects[k].id, 
          studentSubjectMark ? studentSubjectMark.ca_mark : 0, 
          studentSubjectMark ? studentSubjectMark.exam_mark : 0
        );
      }

      this.rowData.push(studentRow);
    }

  }

  populateStudentMarksForSubject(studentRowObject, subjectId, CAMark, ExamMark) {
    Object.defineProperty(studentRowObject, `ca${subjectId}`, {
      value: CAMark,
      writable: true
    });

    Object.defineProperty(studentRowObject, `exam${subjectId}`, {
      value: ExamMark,
      writable: true
    });

    return studentRowObject;
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    params.api.setDomLayout('autoHeight');
    this.marksGridRef.nativeElement.style.height = '';
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

  saveMarkSheet() {
    console.log( this.rowData );
  }

  printReports() {
    console.log('Print report...');
  }

  exportToExcel() {
    console.log('Exporting to excel');
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
