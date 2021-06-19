interface SubjectAndNumberOfClasses {
  subjectCode: string;
  subjectName: string;
  numberOfClasses: number;
}

export interface WorkloadReportResponse {
  [name: string]: SubjectAndNumberOfClasses[];
}
