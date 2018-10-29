
import { Component, OnInit, ViewChild, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { User } from '../../../models/user.interface';
import { UserRoles } from '../../../enums/roles.enum';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class AdminUsersListComponent implements OnChanges {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) dataTable: MatTable<User>;
  dataSource: MatTableDataSource<User>; // DataTableDataSource;

  @Input() users: User[];
  @Output() userClicked = new EventEmitter<User>();
  @Output() addNewUserClicked = new EventEmitter<void>();
  @Output() removeUser = new EventEmitter<User>();

  displayedColumns = ['names', 'surname', 'role', 'edit'];

  roleType = UserRoles;

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.users.currentValue !== null ) {
      if ( changes.users.currentValue !== changes.users.previousValue && this.hasUserObject()) { 
        this.dataSource = new MatTableDataSource(); // DataTableDataSource(this.paginator, this.sort);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.data = this.users;    
      }
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectUser(user: User) {
    this.userClicked.emit(user);
  }

  addNewUser() {
    this.addNewUserClicked.emit();
  }

  deleteUser(user) {
    this.removeUser.emit(user);
  }

  usersAvailable() {
    return this.users && this.users !== null && this.hasUserObject();
  }

  hasUserObject(): boolean {
    try {
      if (this.users[0] && this.users[0].id) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
