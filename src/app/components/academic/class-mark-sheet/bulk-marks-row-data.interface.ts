import { Mark } from '../../../models/mark.interface';

export interface BulkMarksRowData {
    studentId: number;
    studentName: string;
    studentSurname: string;
    marks: Mark[];
}
