import { retrieveWorkloadReport } from 'services/WorkloadReportService';

describe('testing WorkloadReportService', () => {
  test('retrieveWorkloadReport should return correct API response based on database data', async () => {
    expect(await retrieveWorkloadReport()).toEqual({
      'Teacher 1': [
        {
          numberOfClasses: 2,
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
        },
        { numberOfClasses: 2, subjectCode: 'SCI', subjectName: 'Science' },
      ],
      'Teacher 2': [
        {
          numberOfClasses: 1,
          subjectCode: 'MATHS',
          subjectName: 'Mathematics',
        },
      ],
      'Teacher 3': [
        { numberOfClasses: 1, subjectCode: 'SCI', subjectName: 'Science' },
      ],
    });
  });
});
