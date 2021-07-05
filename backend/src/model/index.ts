import Student from './Student';
import Subject from './Subject';
import WhoStudies from './WhoStudies';
import WhatTheyStudy from './WhatTheyStudy';
import DbIdentified from './DbIdentified';

type DbStudent = Student & DbIdentified;
type DbSubject = Subject & DbIdentified;

export {
    Student,
    Subject,
    WhoStudies,
    WhatTheyStudy,
    DbIdentified,
    DbStudent,
    DbSubject
}