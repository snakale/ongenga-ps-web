import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { Student } from '../../../models/student.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ViewEncapsulation } from '@angular/core';
import { Mark } from 'src/app/models/mark.interface';
import { SchoolSubject } from 'src/app/models/subject.interface';
import { SchoolTerm } from 'src/app/enums/school-term.enum';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';  
import { SubjectClassAverage } from 'src/app/models/subject-class-average.interface';
import { AcademicClass } from 'src/app/models/academic-class.interface';

@Component({
  selector: 'app-academic-report',
  templateUrl: './academic-report.component.html',
  styleUrls: ['./academic-report.component.scss', './bootstrap-grid.min.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AcademicReportComponent implements OnInit, OnDestroy {

  @ViewChild('studentAcademicReport') reportContent: ElementRef;

  @Input() students: Student[];
  @Input() schoolSubjects: SchoolSubject[];
  @Input() trigger: BehaviorSubject<Mark[]>;
  @Input() academicTrimester: SchoolTerm;
  @Input() academicClass: AcademicClass;

  subjectClassAverages: SubjectClassAverage[];

  triggerSubscription: Subscription;

  reportState: ReportState;

  ngOnInit() {

    this.triggerSubscription = this.trigger
      .pipe( 
        tap( newMarks => {
          if (newMarks !== null) {
            this.createPDFReports(newMarks);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.triggerSubscription.unsubscribe();
  }

  calculateSubjectClassAverages(marks: Mark[]): SubjectClassAverage[] {

    const averages: SubjectClassAverage[] = [];

    this.schoolSubjects.forEach( (schoolSubject: SchoolSubject) => {

      let total = 0;
      let count = 0;

      for (let k = 0; k < marks.length; k++) {
        if (marks[k].subjectId === schoolSubject.id) {
          total += ( marks[k].ca_mark + marks[k].exam_mark ) / 2;
          count++;
        }
      }

      averages.push({subjectId: schoolSubject.id, average: total / count });

    });

    return averages;
    
  }

  createPDFReports(marks: Mark[]) {
    
    this.subjectClassAverages = this.calculateSubjectClassAverages(marks);
    const timestamp = + new Date();

   
    this.students.forEach( (student: Student) => {

      // Set report template variables
      // this.reportState.DoB = student.

      // Beginning PDF generation
      const stName = (`${student.names}-${student.surname}`).replace(' ', '');
      this.downloadPDFReport(`${timestamp}-${stName}`);
    });

    
  }

  downloadPDFReport(documentName: string) {

    html2canvas(this.reportContent.nativeElement).then(canvas => {  
      // Few necessary setting options  
      const imgWidth = 208;   
      const pageHeight = 295;    
      const imgHeight = canvas.height * imgWidth / canvas.width;  
      const heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png');  
      const pdfDoc = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      const position = 0;  
      pdfDoc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);  
      pdfDoc.save('MYPdf.pdf'); // Generated PDF   
    });  

  }

}

interface ReportState {
  DoB: string;
}
