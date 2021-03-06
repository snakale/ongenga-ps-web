import { SchoolTerm } from '../enums/school-term.enum';
import { User } from './user.interface';

export interface Mark {
    id?: number;
    studentId: number;
    subjectId: number;
    ca_mark: number;
    exam_mark: number;
    final_mark?: number;
    year?: number;
    term?: SchoolTerm;
}

export interface MarksSearchParams {
    teacher: User;
    year: number;
    term: number;
}
