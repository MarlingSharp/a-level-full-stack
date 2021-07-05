interface WhoStudies {
    subjectId: number;
    subjectName: string;
    students: {
        studentId: number;
        studentName: string;
        targetGrade: string;
    }
}

export default WhoStudies;