import Student from '../models/Student';

export interface StudentListingResponse {
  count?: string;
  rows?: Student[];
  students?: Student[];
}
