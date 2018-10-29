import { UsersState } from './users/adaptor';
import { SchoolSubjectsState } from './subjects/adaptor';
import { StudentsState } from './students/adaptor';

export interface ApplicationState {
    users: UsersState;
    subjects: SchoolSubjectsState;
    students: StudentsState;
}
