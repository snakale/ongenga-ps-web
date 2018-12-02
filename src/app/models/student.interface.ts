import { SchoolClass } from '../enums/class.enum';
import { SchoolGrade } from '../enums/grades.enum';
import { Parent } from './parent.interface';

export interface Student {
    id: number;
    names: string;
    surname: string;
    registerTeacherId: number;
    grade: SchoolGrade;
    studentClass: SchoolClass;
    dateOfBirth: Date;
    gender: string;
    parent1_id?: number;
    parent1?: Parent;
    parent2_id?: number;
    parent2: Parent;
}
