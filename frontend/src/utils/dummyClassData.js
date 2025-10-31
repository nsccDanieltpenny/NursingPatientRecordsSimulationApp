//dummy data for class page testing

// Mock Instructors (subset of nurses who are instructors)
export const instructors = [
  {
    nurseId: 1,
    patientId: null,
    fullName: "Dr. Sarah Mitchell",
    studentNumber: "INST001",
    email: "sarah.mitchell@nursingschool.edu",
    patients: [],
    classId: null,
    class: null
  },
  {
    nurseId: 2,
    patientId: null,
    fullName: "Prof. Michael Chen",
    studentNumber: "INST002",
    email: "michael.chen@nursingschool.edu",
    patients: [],
    classId: null,
    class: null
  },
  {
    nurseId: 3,
    patientId: null,
    fullName: "Dr. Emily Rodriguez",
    studentNumber: "INST003",
    email: "emily.rodriguez@nursingschool.edu",
    patients: [],
    classId: null,
    class: null
  }
];

// Mock Students (nurses who are students)
export const students = [
  {
    nurseId: 101,
    patientId: null,
    fullName: "Emma Thompson",
    studentNumber: "NS2025001",
    email: "emma.thompson@student.edu",
    patients: [],
    classId: 1,
    class: null
  },
  {
    nurseId: 102,
    patientId: null,
    fullName: "James Wilson",
    studentNumber: "NS2025002",
    email: "james.wilson@student.edu",
    patients: [],
    classId: 1,
    class: null
  },
  {
    nurseId: 103,
    patientId: null,
    fullName: "Sofia Martinez",
    studentNumber: "NS2025003",
    email: "sofia.martinez@student.edu",
    patients: [],
    classId: 1,
    class: null
  },
  {
    nurseId: 104,
    patientId: null,
    fullName: "Liam O'Brien",
    studentNumber: "NS2025004",
    email: "liam.obrien@student.edu",
    patients: [],
    classId: 2,
    class: null
  },
  {
    nurseId: 105,
    patientId: null,
    fullName: "Olivia Patel",
    studentNumber: "NS2025005",
    email: "olivia.patel@student.edu",
    patients: [],
    classId: 2,
    class: null
  },
  {
    nurseId: 106,
    patientId: null,
    fullName: "Noah Kim",
    studentNumber: "NS2025006",
    email: "noah.kim@student.edu",
    patients: [],
    classId: 2,
    class: null
  },
  {
    nurseId: 107,
    patientId: null,
    fullName: "Ava Johnson",
    studentNumber: "NS2025007",
    email: "ava.johnson@student.edu",
    patients: [],
    classId: 3,
    class: null
  },
  {
    nurseId: 108,
    patientId: null,
    fullName: "Ethan Davis",
    studentNumber: "NS2025008",
    email: "ethan.davis@student.edu",
    patients: [],
    classId: null,
    class: null
  },
  {
    nurseId: 109,
    patientId: null,
    fullName: "Mia Anderson",
    studentNumber: "NS2025009",
    email: "mia.anderson@student.edu",
    patients: [],
    classId: null,
    class: null
  },
  {
    nurseId: 110,
    patientId: null,
    fullName: "Lucas Brown",
    studentNumber: "NS2025010",
    email: "lucas.brown@student.edu",
    patients: [],
    classId: null,
    class: null
  },
  {
    nurseId: 111,
    patientId: null,
    fullName: "Isabella Garcia",
    studentNumber: "NS2025011",
    email: "isabella.garcia@student.edu",
    patients: [],
    classId: 1,
    class: null
  },
  {
    nurseId: 112,
    patientId: null,
    fullName: "Mason Lee",
    studentNumber: "NS2025012",
    email: "mason.lee@student.edu",
    patients: [],
    classId: 2,
    class: null
  }
];

// Mock Classes - WITH FULL NESTED OBJECTS (mimics API serialization)
export const classes = [
  {
    classId: 1,
    name: "Fundamentals of Nursing - Spring 2025",
    description: "Introduction to basic nursing concepts, patient care, and clinical skills. Students will learn essential nursing practices including vital signs, patient assessment, and documentation.",
    joinCode: "FN2025",
    instructorId: 1,
    instructor: {
      nurseId: 1,
      patientId: null,
      fullName: "Dr. Sarah Mitchell",
      studentNumber: "INST001",
      email: "sarah.mitchell@nursingschool.edu",
      patients: [],
      classId: null,
      class: null
    },
    startDate: "2025-01-15",
    students: [
      {
        nurseId: 101,
        patientId: null,
        fullName: "Emma Thompson",
        studentNumber: "NS2025001",
        email: "emma.thompson@student.edu",
        patients: [],
        classId: 1,
        class: null
      },
      {
        nurseId: 102,
        patientId: null,
        fullName: "James Wilson",
        studentNumber: "NS2025002",
        email: "james.wilson@student.edu",
        patients: [],
        classId: 1,
        class: null
      },
      {
        nurseId: 103,
        patientId: null,
        fullName: "Sofia Martinez",
        studentNumber: "NS2025003",
        email: "sofia.martinez@student.edu",
        patients: [],
        classId: 1,
        class: null
      },
      {
        nurseId: 111,
        patientId: null,
        fullName: "Isabella Garcia",
        studentNumber: "NS2025011",
        email: "isabella.garcia@student.edu",
        patients: [],
        classId: 1,
        class: null
      }
    ]
  },
  {
    classId: 2,
    name: "Pharmacology for Nurses",
    description: "Comprehensive study of medications, their effects, and administration techniques. Focus on drug classifications, dosage calculations, and safe medication practices.",
    joinCode: "PHAR25",
    instructorId: 2,
    instructor: {
      nurseId: 2,
      patientId: null,
      fullName: "Prof. Michael Chen",
      studentNumber: "INST002",
      email: "michael.chen@nursingschool.edu",
      patients: [],
      classId: null,
      class: null
    },
    startDate: "2025-02-01",
    students: [
      {
        nurseId: 104,
        patientId: null,
        fullName: "Liam O'Brien",
        studentNumber: "NS2025004",
        email: "liam.obrien@student.edu",
        patients: [],
        classId: 2,
        class: null
      },
      {
        nurseId: 105,
        patientId: null,
        fullName: "Olivia Patel",
        studentNumber: "NS2025005",
        email: "olivia.patel@student.edu",
        patients: [],
        classId: 2,
        class: null
      },
      {
        nurseId: 106,
        patientId: null,
        fullName: "Noah Kim",
        studentNumber: "NS2025006",
        email: "noah.kim@student.edu",
        patients: [],
        classId: 2,
        class: null
      },
      {
        nurseId: 112,
        patientId: null,
        fullName: "Mason Lee",
        studentNumber: "NS2025012",
        email: "mason.lee@student.edu",
        patients: [],
        classId: 2,
        class: null
      }
    ]
  },
  {
    classId: 3,
    name: "Medical-Surgical Nursing I",
    description: "Advanced care of adult patients with medical and surgical conditions. Emphasis on pathophysiology, assessment, and evidence-based interventions.",
    joinCode: "MEDSUR",
    instructorId: 3,
    instructor: {
      nurseId: 3,
      fullName: "Dr. Emily Rodriguez",
      studentNumber: "INST003",
      email: "emily.rodriguez@nursingschool.edu",
      classId: null,
      class: null,
      patients: []
    },
    startDate: "2025-01-20",
    students: [
      {
        nurseId: 107,
        fullName: "Ava Johnson",
        studentNumber: "NS2025007",
        email: "ava.johnson@student.edu",
        classId: 3,
        class: null,
        patients: [],
        campus: "Waterfront"
      }
    ]
  },
  {
    classId: 4,
    name: "Pediatric Nursing Care",
    description: "Specialized nursing care for infants, children, and adolescents. Topics include growth and development, family-centered care, and pediatric emergencies.",
    joinCode: "PEDS25",
    instructorId: 1,
    instructor: {
      nurseId: 1,
      fullName: "Dr. Sarah Mitchell",
      studentNumber: "INST001",
      email: "sarah.mitchell@nursingschool.edu",
      classId: null,
      class: null,
      patients: []
    },
    startDate: "2025-03-01",
    students: []
  },
  {
    classId: 5,
    name: "Mental Health Nursing",
    description: "Understanding and caring for patients with mental health disorders. Covers therapeutic communication, psychopharmacology, and crisis intervention.",
    joinCode: "MENTAL",
    instructorId: 2,
    instructor: {
      nurseId: 2,
      fullName: "Prof. Michael Chen",
      studentNumber: "INST002",
      email: "michael.chen@nursingschool.edu",
      classId: null,
      class: null,
      patients: []
    },
    startDate: "2025-02-15",
    students: []
  }
];