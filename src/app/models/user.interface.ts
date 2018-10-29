import { UserRoles } from '../enums/roles.enum';
import { SchoolGrade } from '../enums/grades.enum';
import { SchoolClass } from '../enums/class.enum';

export interface User {
    id: number;
    names: string;
    surname: string;
    email: string;
    role: UserRoles;
    teacherGrade?: SchoolGrade;
    teacherClass?: SchoolClass;
}
