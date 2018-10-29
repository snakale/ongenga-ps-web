import { StudentActionsUnion, StudentActionTypes } from './actions';
import { initialState, StudentsState, studentsAdapter } from './adaptor';

export function StudentsReducer(state = initialState, action: StudentActionsUnion): StudentsState {
  switch (action.type) {

    case StudentActionTypes.SET_STUDENTS: {
      return studentsAdapter.addAll(action.payload.students, state);
    }

    case StudentActionTypes.ADD_STUDENT: {
      return studentsAdapter.addOne(action.payload.student, state);
    }

    case StudentActionTypes.UPSERT_STUDENT: {
      return studentsAdapter.upsertOne(action.payload.student, state);
    }

    case StudentActionTypes.ADD_STUDENTS: {
      return studentsAdapter.addMany(action.payload.students, state);
    }

    case StudentActionTypes.UPSERT_STUDENTS: {
      return studentsAdapter.upsertMany(action.payload.students, state);
    }

    case StudentActionTypes.UPDATE_STUDENT: {
      return studentsAdapter.updateOne(action.payload.student, state);
    }

    case StudentActionTypes.UPDATE_STUDENTS: {
      return studentsAdapter.updateMany(action.payload.students, state);
    }

    case StudentActionTypes.DELETE_STUDENT: {
      return studentsAdapter.removeOne(action.payload.id, state);
    }

    case StudentActionTypes.DELETE_STUDENTS: {
      return studentsAdapter.removeMany(action.payload.ids, state);
    }

    /*case StudentActionTypes.LOAD_SCHOOL_SUBJECTS: {
      return studentsAdapter.addAll(action.payload.users, state);
    }*/

    case StudentActionTypes.CLEAR_STUDENTS: {
      return studentsAdapter.removeAll({ ...state, selectedUserId: null });
    }

    default: {
      return state;
    }
  }
}


