
import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { SchoolGrade } from '../../../enums/grades.enum';
import { Student } from '../../../models/student.interface';
import { User } from '../../../models/user.interface';
import { SchoolClass } from 'src/app/enums/class.enum';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnChanges {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) dataTable: MatTable<Student>;
  dataSource: MatTableDataSource<Student>; // DataTableDataSource;

  gradeEnumType = SchoolGrade;
  classEnumType = SchoolClass;

  @Input() listEditable: boolean;
  @Input() students: Student[];
  @Input() teachers: User[];
  @Output() studentClicked = new EventEmitter<Student>();
  @Output() addNewStudentClicked = new EventEmitter<void>();
  @Output() removeStudent = new EventEmitter<Student>();

  displayedColumns = ['names', 'surname', 'register_teacher_id', 'grade', 'student_class', 'gender', 'edit'];

  ngOnChanges(changes: SimpleChanges) {

    const studentsDataPassed = this.objectNotEmptyOrNull(this.students); 
    const teachersDataPassed = this.objectNotEmptyOrNull(this.teachers); 
    
    if ( studentsDataPassed && teachersDataPassed ) {
      this.dataSource = new MatTableDataSource(); 
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.data = this.students; 
    }

    // If user is not allowed to edit data in column, remove edit column
    if (changes.listEditable && changes.listEditable.currentValue === false) {
      const editCol = this.displayedColumns.indexOf('edit');
      if (editCol > -1) {
        this.displayedColumns.splice(editCol, 1);
      }
    }
  }

  mapTeacherIdToTeacherNames(teacherId: number, teachers: User[]) {
    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      if (teacherId === teachers[i].id) {
        return `${teacher.names} ${teacher.surname}`;
      }
    }
  }

  studentsAvailable() {
    return this.students && this.students !== null && this.objectNotEmptyOrNull(this.students);
  }

  teachersAvailable() {
    return this.teachers && this.teachers !== null;
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

  selectStudent(sub: Student) {
    this.studentClicked.emit(sub);
  }

  addNewStudent() {
    this.addNewStudentClicked.emit();
  }

  deleteStudent(student) {
    this.removeStudent.emit(student);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
