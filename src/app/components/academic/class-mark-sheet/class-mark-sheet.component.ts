import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Mark } from '../../../models/mark.interface';
import { SchoolSubject } from '../../../models/subject.interface';
import { Student } from '../../../models/student.interface';
import { SchoolTerm } from 'src/app/enums/school-term.enum';

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
  @Input() AcademicTrimester: SchoolTerm;
  @Input() termMarks: Mark[];
  @Input() markSheetInitialised: boolean;

  @Output() retryFetchMarks = new EventEmitter<any>();
  @Output() saveMarks = new EventEmitter<Mark[]>();
  @Output() printPDFReport = new EventEmitter<Mark[]>();

  columnDefs = [];
  rowData = [];
  @ViewChild('marksGrid', {read: ElementRef}) marksGridRef: ElementRef;

  constructor() {}

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

      const studentRow = { 
        studentId: this.students[i].id,
        name: `${this.students[i].names} ${this.students[i].surname}` 
      };

      for (let k = 0; k < this.schoolSubjects.length; k++) { 

        const studentSubjectMark = this.termMarks
          .find(mark => mark.studentId === this.students[i].id && mark.subjectId === this.schoolSubjects[k].id);

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

  numberToPercentageFormatter({value}) {
    return value + ' %';
  }

  numberParser({newValue, oldValue}) {
    if ( isNaN(newValue) ) {
      return oldValue;
    } else {
      if ( newValue < 0 || newValue > 100 ) {
        return oldValue;
      }
      return newValue;
    }
  }

  createColumns() {

    this.columnDefs = [
      { headerName: 'Name', field: 'name' },
      { headerName: 'studentId', field: 'studentId', hide: true }
    ];

    for (let k = 0; k < this.schoolSubjects.length; k++) {
      this.columnDefs.push({
        headerName: this.schoolSubjects[k].name,  
        children: [
          { 
            headerName: 'CA', 
            editable: true, 
            field: `ca${this.schoolSubjects[k].id}`, 
            valueFormatter: this.numberToPercentageFormatter,
            valueParser: this.numberParser
          },
          { 
            headerName: 'Exam', 
            editable: true, 
            field: `exam${this.schoolSubjects[k].id}`,
            valueFormatter: this.numberToPercentageFormatter,
            valueParser: this.numberParser
          }
        ]
      });
    }
  }
  
  retryFetchMarkSheet() {
    this.retryFetchMarks.emit(null);
  }

  exportMarksToExcel() {

  }

  printReports() {
    const marks: Mark[] = this.getMarksArray();
    this.printPDFReport.emit(marks);
  }

  getMarksArray(): Mark[] {
    const marks: Mark[] = [];

    for (let k = 0 ; k < this.rowData.length; k++) {
      const studentRow = this.rowData[k];

      for (let i = 0; i < this.schoolSubjects.length; i++) {
        const subjectId = this.schoolSubjects[i].id;
        marks.push({
          studentId: studentRow.studentId,
          subjectId: subjectId,
          ca_mark: studentRow[`ca${subjectId}`],
          exam_mark: studentRow[`exam${subjectId}`],
        });
      }
    }

    return marks;
  }

  saveMarkSheet() {

    const marks: Mark[] = this.getMarksArray();
    this.saveMarks.emit(marks);

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
