DROP TABLE IF EXISTS TeacherStudentClassSubjectMapping;

CREATE TABLE IF NOT EXISTS TeacherStudentClassSubjectMapping (
    teacherId INT(10) NOT NULL,
    studentId INT(10) NOT NULL,
    classId INT(10) NOT NULL,
    subjectId INT(10) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dateModified TIMESTAMP NOT NULL
);
