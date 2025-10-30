//dummy data for class page testing

// Mock Instructors (subset of nurses who are instructors)
export const dummyInstructors = [
  {
    nurseId: 1,
    fullName: "Dr. Sarah Mitchell",
    studentNumber: "INST001",
    email: "sarah.mitchell@nursingschool.edu",
    classId: null,
    class: null,
    patients: []
  },
  {
    nurseId: 2,
    fullName: "Prof. Michael Chen",
    studentNumber: "INST002",
    email: "michael.chen@nursingschool.edu",
    classId: null,
    class: null,
    patients: []
  },
  {
    nurseId: 3,
    fullName: "Dr. Emily Rodriguez",
    studentNumber: "INST003",
    email: "emily.rodriguez@nursingschool.edu",
    classId: null,
    class: null,
    patients: []
  }
];

// Mock Students (nurses who are students)
export const dummyStudents = [
  {
    nurseId: 101,
    fullName: "Emma Thompson",
    studentNumber: "NS2025001",
    email: "emma.thompson@student.edu",
    classId: 1,
    class: null,
    patients: []
  },
  {
    nurseId: 102,
    fullName: "James Wilson",
    studentNumber: "NS2025002",
    email: "james.wilson@student.edu",
    classId: 1,
    class: null,
    patients: []
  },
  {
    nurseId: 103,
    fullName: "Sofia Martinez",
    studentNumber: "NS2025003",
    email: "sofia.martinez@student.edu",
    classId: 1,
    class: null,
    patients: []
  },
  {
    nurseId: 104,
    fullName: "Liam O'Brien",
    studentNumber: "NS2025004",
    email: "liam.obrien@student.edu",
    classId: 2,
    class: null,
    patients: []
  },
  {
    nurseId: 105,
    fullName: "Olivia Patel",
    studentNumber: "NS2025005",
    email: "olivia.patel@student.edu",
    classId: 2,
    class: null,
    patients: []
  },
  {
    nurseId: 106,
    fullName: "Noah Kim",
    studentNumber: "NS2025006",
    email: "noah.kim@student.edu",
    classId: 2,
    class: null,
    patients: []
  },
  {
    nurseId: 107,
    fullName: "Ava Johnson",
    studentNumber: "NS2025007",
    email: "ava.johnson@student.edu",
    classId: 3,
    class: null,
    patients: []
  },
  {
    nurseId: 108,
    fullName: "Ethan Davis",
    studentNumber: "NS2025008",
    email: "ethan.davis@student.edu",
    classId: null, // Unassigned student
    class: null,
    patients: []
  },
  {
    nurseId: 109,
    fullName: "Mia Anderson",
    studentNumber: "NS2025009",
    email: "mia.anderson@student.edu",
    classId: null, // Unassigned student
    class: null,
    patients: []
  },
  {
    nurseId: 110,
    fullName: "Lucas Brown",
    studentNumber: "NS2025010",
    email: "lucas.brown@student.edu",
    classId: null, // Unassigned student
    class: null,
    patients: []
  },
  {
    nurseId: 111,
    fullName: "Isabella Garcia",
    studentNumber: "NS2025011",
    email: "isabella.garcia@student.edu",
    classId: 1,
    class: null,
    patients: []
  },
  {
    nurseId: 112,
    fullName: "Mason Lee",
    studentNumber: "NS2025012",
    email: "mason.lee@student.edu",
    classId: 2,
    class: null,
    patients: []
  }
];

// Mock Classes
export const dummyClassData = [
  {
    classId: 1,
    name: "Fundamentals of Nursing - Spring 2025",
    description: "Introduction to basic nursing concepts, patient care, and clinical skills. Students will learn essential nursing practices including vital signs, patient assessment, and documentation.",
    joinCode: "FN2025",
    instructorId: 1,
    instructor: dummyInstructors[0],
    startDate: "2025-01-15",
    students: dummyStudents.filter(s => s.classId === 1)
  },
  {
    classId: 2,
    name: "Pharmacology for Nurses",
    description: "Comprehensive study of medications, their effects, and administration techniques. Focus on drug classifications, dosage calculations, and safe medication practices.",
    joinCode: "PHAR25",
    instructorId: 2,
    instructor: dummyInstructors[1],
    startDate: "2025-02-01",
    students: dummyStudents.filter(s => s.classId === 2)
  },
  {
    classId: 3,
    name: "Medical-Surgical Nursing I",
    description: "Advanced care of adult patients with medical and surgical conditions. Emphasis on pathophysiology, assessment, and evidence-based interventions.",
    joinCode: "MEDSUR",
    instructorId: 3,
    instructor: dummyInstructors[2],
    startDate: "2025-01-20",
    students: dummyStudents.filter(s => s.classId === 3)
  },
  {
    classId: 4,
    name: "Pediatric Nursing Care",
    description: "Specialized nursing care for infants, children, and adolescents. Topics include growth and development, family-centered care, and pediatric emergencies.",
    joinCode: "PEDS25",
    instructorId: 1,
    instructor: dummyInstructors[0],
    startDate: "2025-03-01",
    students: []
  },
  {
    classId: 5,
    name: "Mental Health Nursing",
    description: "Understanding and caring for patients with mental health disorders. Covers therapeutic communication, psychopharmacology, and crisis intervention.",
    joinCode: "MENTAL",
    instructorId: 2,
    instructor: dummyInstructors[1],
    startDate: "2025-02-15",
    students: []
  }
];