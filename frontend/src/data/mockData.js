// Mock Data for Capacity Connect Prototype

export const mockCourses = [
  {
    id: 'c1',
    title: 'Fundamentals of Remote Sensing',
    description: 'Learn the core concepts of remote sensing, satellite imaging, and spectral analysis for earth observation.',
    subject: 'Earth Sciences',
    trainer: 'Dr. Meera Nair',
    duration: '4 Weeks',
    level: 'Beginner',
    modulesCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=60',
    skills: ['Satellite Imaging', 'Spectral Analysis', 'Earth Observation'],
    learningOutcomes: [
      'Understand the electromagnetic spectrum in remote sensing',
      'Process basic satellite imagery',
      'Identify land cover features from spectral data'
    ],
    modules: [
      { id: 'm1', title: 'Introduction to Remote Sensing', duration: '45 min', type: 'video' },
      { id: 'm2', title: 'Electromagnetic Radiation', duration: '60 min', type: 'presentation' },
      { id: 'm3', title: 'Sensors and Platforms', duration: '30 min', type: 'document' },
      { id: 'm4', title: 'Image Interpretation', duration: '90 min', type: 'video' },
      { id: 'm5', title: 'Applications in Earth Science', duration: '45 min', type: 'pdf' }
    ]
  },
  {
    id: 'c2',
    title: 'Climate Data Analysis using Python',
    description: 'A practical approach to handling and analyzing large climate datasets using Python libraries.',
    subject: 'Data & Analytics',
    trainer: 'Rahul Verma',
    duration: '6 Weeks',
    level: 'Intermediate',
    modulesCount: 8,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60',
    skills: ['Python', 'Data Analysis', 'Climate Modeling', 'Pandas'],
    learningOutcomes: [
      'Import and clean NetCDF climate datasets',
      'Perform time-series analysis on temperature data',
      'Visualize spatial climate anomalies'
    ],
    modules: [
      { id: 'm1', title: 'Python Basics for Data Science', duration: '60 min', type: 'video' },
      { id: 'm2', title: 'Introduction to Pandas', duration: '90 min', type: 'video' },
      { id: 'm3', title: 'Working with NetCDF files', duration: '120 min', type: 'document' },
      { id: 'm4', title: 'Time Series Analysis', duration: '90 min', type: 'presentation' },
    ]
  },
  {
    id: 'c3',
    title: 'Workplace Communication & Etiquette',
    description: 'Essential communication skills for a professional organizational environment.',
    subject: 'Professional Development',
    trainer: 'Anita Desai',
    duration: '2 Weeks',
    level: 'Beginner',
    modulesCount: 3,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=60',
    skills: ['Communication', 'Email Writing', 'Interpersonal Skills'],
    learningOutcomes: [
      'Write professional and concise emails',
      'Communicate effectively in inter-departmental meetings',
      'Handle difficult workplace conversations'
    ],
    modules: [
      { id: 'm1', title: 'Professional Email Writing', duration: '30 min', type: 'video' },
      { id: 'm2', title: 'Effective Meeting Participation', duration: '45 min', type: 'presentation' },
      { id: 'm3', title: 'Conflict Resolution', duration: '45 min', type: 'video' }
    ]
  },
  {
    id: 'c4',
    title: 'Introduction to Geographic Information Systems (GIS)',
    description: 'Learn spatial data concepts, coordinate systems, and basic map creation using QGIS.',
    subject: 'Technical',
    trainer: 'Dr. Vikram Singh',
    duration: '5 Weeks',
    level: 'Beginner',
    modulesCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=60',
    skills: ['GIS', 'Spatial Data', 'QGIS', 'Mapping'],
    learningOutcomes: [
      'Understand vector and raster data models',
      'Navigate the QGIS interface',
      'Create and style basic thematic maps'
    ],
    modules: [
      { id: 'm1', title: 'What is GIS?', duration: '30 min', type: 'video' },
      { id: 'm2', title: 'Spatial Data Types', duration: '45 min', type: 'presentation' },
      { id: 'm3', title: 'Coordinate Reference Systems', duration: '60 min', type: 'document' },
    ]
  }
];

export const mockTrainerCourses = [
  mockCourses[0],
  mockCourses[3]
];

export const mockAssessments = [
  {
    id: 'a1',
    title: 'Data Analysis Fundamentals',
    subject: 'Data & Analytics',
    deadline: '2026-08-28',
    questionCount: 5,
    estimatedDuration: '15 Minutes',
    status: 'Pending',
    trainer: 'Rahul Verma'
  },
  {
    id: 'a2',
    title: 'GIS Basic Concepts Quiz',
    subject: 'Technical',
    deadline: '2026-08-29',
    questionCount: 15,
    estimatedDuration: '20 Minutes',
    status: 'Pending',
    trainer: 'Dr. Vikram Singh'
  },
  {
    id: 'a3',
    title: 'Professional Communication Test',
    subject: 'Professional Development',
    deadline: '2026-08-20',
    questionCount: 10,
    estimatedDuration: '10 Minutes',
    status: 'Completed',
    trainer: 'Anita Desai',
    score: 85
  }
];

export const mockMCQData = {
  a1: [
    {
      id: 'q1',
      question: 'Which of the following is not a core Python library for Data Science?',
      options: ['Pandas', 'NumPy', 'Django', 'Matplotlib'],
      correctAnswer: 2,
      explanation: 'Django is a web framework, while Pandas, NumPy, and Matplotlib are used for data analysis.'
    },
    {
      id: 'q2',
      question: 'What does CSV stand for?',
      options: ['Comma Separated Values', 'Computer System Variable', 'Calculated Standard Value', 'Custom Style Vector'],
      correctAnswer: 0,
      explanation: 'CSV stands for Comma Separated Values, a common format for storing tabular data.'
    },
    {
      id: 'q3',
      question: 'Which method in pandas is used to view the first 5 rows of a dataframe?',
      options: ['df.top()', 'df.head()', 'df.start()', 'df.first()'],
      correctAnswer: 1,
      explanation: 'df.head() returns the first 5 rows by default.'
    },
    {
      id: 'q4',
      question: 'What is a missing value represented as in Pandas?',
      options: ['Null', 'NaN', 'None', 'Missing'],
      correctAnswer: 1,
      explanation: 'Pandas uses NaN (Not a Number) to represent missing values.'
    },
    {
      id: 'q5',
      question: 'Which type of chart is best for showing a trend over time?',
      options: ['Pie Chart', 'Bar Chart', 'Line Chart', 'Scatter Plot'],
      correctAnswer: 2,
      explanation: 'Line charts are the standard choice for displaying time series data.'
    }
  ],
  a2: [
    {
      id: 'q2_1',
      question: 'What does GIS stand for?',
      options: ['Geographic Information System', 'Global Imaging Satellite', 'Geospatial Index Service', 'General Information Software'],
      correctAnswer: 0,
      explanation: 'GIS stands for Geographic Information System.'
    },
    {
      id: 'q2_2',
      question: 'Which data model represents geographic features using points, lines, and polygons?',
      options: ['Raster Model', 'Vector Model', 'Grid Model', 'Matrix Model'],
      correctAnswer: 1,
      explanation: 'The vector model represents discrete real-world features using geometry.'
    },
    {
      id: 'q2_3',
      question: 'What is QGIS?',
      options: ['A proprietary database', 'An open-source desktop GIS software', 'A satellite operator', 'A programming language'],
      correctAnswer: 1,
      explanation: 'QGIS is a popular free and open-source Geographic Information System desktop application.'
    }
  ],
  a3: [
    {
      id: 'q3_1',
      question: 'Which of the following is essential for clear workplace email communication?',
      options: ['Using ALL CAPS for urgency', 'Including a clear subject line and concise message', 'Forwarding chain emails', 'Omitting greetings'],
      correctAnswer: 1,
      explanation: 'A concise message with a descriptive subject line ensures clear and professional email communication.'
    },
    {
      id: 'q3_2',
      question: 'What is active listening during professional meetings?',
      options: ['Multitasking on mobile', 'Fully attending to the speaker, understanding, and responding thoughtfully', 'Interrupting frequently', 'Ignoring non-verbal cues'],
      correctAnswer: 1,
      explanation: 'Active listening involves full engagement, focus, and constructive response.'
    }
  ]
};

export const mockNotifications = [
  { id: 'n1', type: 'course', title: 'New Course Available', message: 'Fundamentals of Remote Sensing is now open for enrollment.', date: '2 hours ago', read: false },
  { id: 'n2', type: 'assessment', title: 'Assessment Reminder', message: 'Your assessment for Data Analysis Fundamentals is due in 3 days.', date: '1 day ago', read: false },
  { id: 'n3', type: 'achievement', title: 'Certificate Earned', message: 'Congratulations! You earned a certificate for Workplace Communication.', date: '1 week ago', read: true }
];

export const mockLibrary = [
  { id: 'l1', title: 'QGIS Quickstart Guide 2026', type: 'PDF', subject: 'GIS', trainer: 'Dr. Vikram Singh', date: '2026-08-01' },
  { id: 'l2', title: 'Effective Email Templates', type: 'Document', subject: 'Professional', trainer: 'Anita Desai', date: '2026-08-15' },
  { id: 'l3', title: 'Python Pandas Cheatsheet', type: 'PDF', subject: 'Data Science', trainer: 'Rahul Verma', date: '2026-07-20' },
  { id: 'l4', title: 'Introduction to Earth Systems - Lecture 1', type: 'Video', subject: 'Earth Sciences', trainer: 'Dr. Neha Kapoor', date: '2026-08-22' },
  { id: 'l5', title: 'MoES Data Policy Guidelines', type: 'Presentation', subject: 'Policy', trainer: 'Admin', date: '2026-06-10' }
];

export const mockCertificates = [
  {
    id: 'cert-101',
    courseName: 'Workplace Communication & Etiquette',
    date: 'August 20, 2026',
    trainer: 'Anita Desai',
  }
];

export const mockTrainerTrainees = [
  { id: 'u1', name: 'Aarav Sharma', designation: 'Scientific Assistant', department: 'Environmental Data Services', enrolledCourse: 'c1', progress: 80, assessmentAverage: 85, status: 'Active' },
  { id: 'u2', name: 'Priya Singh', designation: 'Research Fellow', department: 'Climate Modeling', enrolledCourse: 'c1', progress: 100, assessmentAverage: 92, status: 'Completed' },
  { id: 'u3', name: 'Rahul Kumar', designation: 'Data Analyst', department: 'Data Services', enrolledCourse: 'c1', progress: 30, assessmentAverage: null, status: 'Needs Attention' },
  { id: 'u4', name: 'Sneha Patel', designation: 'Junior Scientist', department: 'Remote Sensing', enrolledCourse: 'c1', progress: 65, assessmentAverage: 78, status: 'Active' }
];

export const mockTrainerFeedback = [
  { id: 'f1', courseId: 'c1', courseTitle: 'Fundamentals of Remote Sensing', traineeName: 'Priya Singh', rating: 5, date: '2026-08-22', comment: 'Excellent course, the modules on image interpretation were very clear and helpful for my daily work.' },
  { id: 'f2', courseId: 'c1', courseTitle: 'Fundamentals of Remote Sensing', traineeName: 'Anonymous', rating: 4, date: '2026-08-20', comment: 'Good material, but could use more practical exercises on QGIS.' },
  { id: 'f3', courseId: 'c1', courseTitle: 'Fundamentals of Remote Sensing', traineeName: 'Aarav Sharma', rating: 4, date: '2026-08-15', comment: 'Very well structured. The video lectures are highly informative.' }
];
