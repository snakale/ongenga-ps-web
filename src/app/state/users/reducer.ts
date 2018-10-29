import { UserActionsUnion, UserActionTypes } from './actions';
import { initialState, UsersState, usersAdapter } from './adaptor';

export function UsersReducer(state = initialState, action: UserActionsUnion): UsersState {
  switch (action.type) {

    case UserActionTypes.SET_LOGGED_IN_USER: {
        return { ...state, loggedInUser: action.payload }; 
    }

    case UserActionTypes.LOG_USER_OUT: {
        return { ...state, loggedInUser: null };
    }

    case UserActionTypes.SET_SELECTED_USER: {
      return {...state, selectedUserId: action.payload };
    }

    case UserActionTypes.ADD_USER: {
      return usersAdapter.addOne(action.payload.user, state);
    }

    case UserActionTypes.UPSERT_USER: {
      return usersAdapter.upsertOne(action.payload.user, state);
    }

    case UserActionTypes.ADD_USERS: {
      return usersAdapter.addMany(action.payload.users, state);
    }

    case UserActionTypes.UPSERT_USERS: {
      return usersAdapter.upsertMany(action.payload.users, state);
    }

    case UserActionTypes.UPDATE_USER: {
      return usersAdapter.updateOne(action.payload.user, state);
    }

    case UserActionTypes.UPDATE_USERS: {
      return usersAdapter.updateMany(action.payload.users, state);
    }

    case UserActionTypes.DELETE_USER: {
      return usersAdapter.removeOne(action.payload.id, state);
    }

    case UserActionTypes.DELETE_USERS: {
      return usersAdapter.removeMany(action.payload.ids, state);
    }

    case UserActionTypes.LOAD_USERS: {
      return usersAdapter.addAll(action.payload.users, state);
    }

    case UserActionTypes.CLEAR_USERS: {
      return usersAdapter.removeAll({ ...state, selectedUserId: null });
    }

    default: {
      return state;
    }
  }
}


