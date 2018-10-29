import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SchoolSubject } from '../../models/subject.interface';

export const schoolSubjectsAdapter: EntityAdapter<SchoolSubject> = createEntityAdapter<SchoolSubject>();

export interface SchoolSubjectsState extends EntityState<SchoolSubject> {
  selectedSubjectId: number;
}

export const initialState: SchoolSubjectsState = schoolSubjectsAdapter.getInitialState({ 
  selectedSubjectId: null
});

export const getSchoolSubjectsState = createFeatureSelector<SchoolSubjectsState>('subject');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal 
} = schoolSubjectsAdapter.getSelectors(getSchoolSubjectsState);

export const getSelectedSubjectId = (state: SchoolSubjectsState) => state.selectedSubjectId;

export const getSelectedSubject = createSelector<SchoolSubjectsState, any, any, SchoolSubject>(selectEntities, getSelectedSubjectId,
  (entities, id) => entities[id]
);
