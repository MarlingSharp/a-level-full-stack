interface WhatTheyStudy {
    studentId: number;
    studentName: string;
    subjects: {
        subjectId: number;
        subjectName: string;
        targetGrade: string;
    }
}

export default WhatTheyStudy;