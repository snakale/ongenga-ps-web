import { SchoolClass } from '../enums/class.enum';
import { SchoolGrade } from '../enums/grades.enum';

export interface Student {
    id: number;
    names: string;
    surname: string;
    registerTeacherId: number;
    grade: SchoolGrade;
    studentClass: SchoolClass;
    gender: string;
    parent1_id?: number;
    parent2_id?: number;
}
