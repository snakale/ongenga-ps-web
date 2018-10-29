import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../../services/students.service';
import { Mark } from '../../../models/mark.interface';

@Component({
  selector: 'app-student-marks',
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.scss']
})
export class StudentMarksComponent implements OnInit {

  studentId: number;
  fetchingMarks = true;
  studentMarks: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private studentsService: StudentsService
  ) {}

  async ngOnInit() {
    this.studentId = +this.activatedRoute.snapshot.params.id;
    this.studentMarks = await this.studentsService.getStudentMarks(this.studentId);
  }

  sortMarks(marks: Mark[]) {
    // Sort by year and term
  }

  updateMark() {
    
  }

  updateMarks() {

  }

}
