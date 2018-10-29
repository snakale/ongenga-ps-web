import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { Student } from '../../models/student.interface';

export const studentsAdapter: EntityAdapter<Student> = createEntityAdapter<Student>();

export interface StudentsState extends EntityState<Student> {
  selectedStudentId: number;
}

export const initialState: StudentsState = studentsAdapter.getInitialState({ 
  selectedStudentId: null
});

export const getStudentsState = createFeatureSelector<StudentsState>('students');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal 
} = studentsAdapter.getSelectors(getStudentsState);

