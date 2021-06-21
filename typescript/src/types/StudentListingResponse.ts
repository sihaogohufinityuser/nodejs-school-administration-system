import Student from '../models/Student';

export interface StudentListingResponse {
  count?: number;
  rows?: Student[];
  students?: Student[];
}
