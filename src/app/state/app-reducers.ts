
import { ActionReducerMap } from '@ngrx/store';
import { ApplicationState } from './application-state.model';
import { UsersReducer } from './users/reducer';
import { SchoolSubjectsReducer } from './subjects/reducer';
import { StudentsReducer } from './students/reducer';

export const appReducers: ActionReducerMap<ApplicationState> = {
    users: UsersReducer,
    subjects: SchoolSubjectsReducer,
    students: StudentsReducer 
};
