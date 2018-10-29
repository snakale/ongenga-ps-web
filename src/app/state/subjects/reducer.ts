import { SchoolSubjectActionsUnion, SchoolSubjectActionTypes } from './actions';
import { initialState, SchoolSubjectsState, schoolSubjectsAdapter } from './adaptor';

export function SchoolSubjectsReducer(state = initialState, action: SchoolSubjectActionsUnion): SchoolSubjectsState {
  switch (action.type) {

    case SchoolSubjectActionTypes.SET_SCHOOL_SUBJECTS: {
      return schoolSubjectsAdapter.addAll(action.payload.subjects, state);
    }

    case SchoolSubjectActionTypes.ADD_SUBJECT: {
      return schoolSubjectsAdapter.addOne(action.payload.subject, state);
    }

    case SchoolSubjectActionTypes.UPSERT_SUBJECT: {
      return schoolSubjectsAdapter.upsertOne(action.payload.subject, state);
    }

    case SchoolSubjectActionTypes.ADD_SUBJECTS: {
      return schoolSubjectsAdapter.addMany(action.payload.subjects, state);
    }

    case SchoolSubjectActionTypes.UPSERT_SUBJECTS: {
      return schoolSubjectsAdapter.upsertMany(action.payload.subjects, state);
    }

    case SchoolSubjectActionTypes.UPDATE_SUBJECT: {
      return schoolSubjectsAdapter.updateOne(action.payload.subject, state);
    }

    case SchoolSubjectActionTypes.UPDATE_SUBJECTS: {
      return schoolSubjectsAdapter.updateMany(action.payload.subjects, state);
    }

    case SchoolSubjectActionTypes.DELETE_SUBJECT: {
      return schoolSubjectsAdapter.removeOne(action.payload.id, state);
    }

    case SchoolSubjectActionTypes.DELETE_SUBJECTS: {
      return schoolSubjectsAdapter.removeMany(action.payload.ids, state);
    }

    /*case SchoolSubjectActionTypes.LOAD_SCHOOL_SUBJECTS: {
      return schoolSubjectsAdapter.addAll(action.payload.users, state);
    }*/

    case SchoolSubjectActionTypes.CLEAR_SUBJECTS: {
      return schoolSubjectsAdapter.removeAll({ ...state, selectedUserId: null });
    }

    default: {
      return state;
    }
  }
}


