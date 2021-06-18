import Student from '../models/Student';

export interface StudentListingResponse {
  count?: string;
  students?: Student[];
}
