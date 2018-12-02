import { SchoolGrade } from '../enums/grades.enum';
import { SchoolClass } from '../enums/class.enum';

export interface AcademicClass {
    grade: SchoolGrade;
    schoolClass: SchoolClass;
    label: string;
}
