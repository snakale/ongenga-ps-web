import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../../models/user.interface';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export interface UsersState extends EntityState<User> {
    selectedUserId: number | null;
    loggedInUser: User | null;
}

export const initialState: UsersState = usersAdapter.getInitialState({ 
  selectedUserId: null,
  loggedInUser: null
});

// Default Selectors

export const getSelectedUserId = (state: UsersState) => state.selectedUserId;
export const getLoggedInUserId = (state: UsersState) => state.loggedInUser.id;

export const getUsersState = createFeatureSelector<UsersState>('user');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal 
} = usersAdapter.getSelectors(getUsersState);

export const getSelectedUser = createSelector<UsersState, any, any, User>(selectEntities, getSelectedUserId,
  (entities, id) => entities[id]
);

export const getLoggedInUser = createSelector<UsersState, any, any, User>(selectEntities, getLoggedInUserId,
  (entities, id) => entities[id]
);

/*export const {
  selectIds: selectUserIds, // select the array of user ids
  selectEntities: selectUserEntities, // select the dictionary of user entities
  selectAll: selectAllUsers, // select the array of users
  selectTotal: selectUserTotal, // select the total user count
} = adapter.getSelectors();*/
