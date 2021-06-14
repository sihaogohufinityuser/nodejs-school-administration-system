DROP TABLE IF EXISTS TeacherStudentClassSubjectMapping;

CREATE TABLE IF NOT EXISTS TeacherStudentClassSubjectMapping (
    teacherId INT(10) NOT NULL,
    studentId INT(10) NOT NULL,
    classId INT(10) NOT NULL,
    subjectId INT(10) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(teacherId,studentId,classId,subjectId),
    FOREIGN KEY(teacherId)
        REFERENCES Teacher(id),
    FOREIGN KEY(studentId)
        REFERENCES Student(id),
    FOREIGN KEY(classId)
        REFERENCES Class(id),
    FOREIGN KEY(subjectId)
        REFERENCES Subject(id)
);
