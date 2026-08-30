import { 
  Building2, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  Compass, 
  GraduationCap, 
  UserCheck, 
  Globe2, 
  Target,
  BellRing,
  TrendingUp,
  Sliders
} from 'lucide-react';

export const AUDIENCE_CATEGORIES = [
  { label: 'Government Departments', icon: Building2, tag: 'Public Sector' },
  { label: 'Scientific Institutes', icon: Compass, tag: 'Research & MoES' },
  { label: 'Research Bodies', icon: Globe2, tag: 'National Labs' },
  { label: 'Training Organizations', icon: GraduationCap, tag: 'Academies' },
  { label: 'Universities & Colleges', icon: BookOpen, tag: 'Higher Ed' },
  { label: 'Public Institutions', icon: ShieldCheck, tag: 'Governance' }
];

export const CAPACITY_CYCLE_STEPS = [
  {
    number: '01',
    title: 'Need Identification',
    subtitle: 'Skill Gap Analysis',
    desc: 'Organization admins identify departmental training demands, target role requirements, and strategic competency gaps.',
    icon: Target,
    badge: 'Demand Assessment'
  },
  {
    number: '02',
    title: 'Competency Mapping',
    subtitle: 'SIH26075 Alignment',
    desc: 'Required subject topics are structured into weighted competency vectors matching organizational benchmarks.',
    icon: Sliders,
    badge: 'Subject Definition'
  },
  {
    number: '03',
    title: 'Trainer Matching',
    subtitle: 'Weighted 4-Factor Engine',
    desc: 'The matching algorithm evaluates candidate instructors by skills, domain alignment, experience, and academic qualifications.',
    icon: UserCheck,
    badge: 'Expert Pair'
  },
  {
    number: '04',
    title: 'Structured Learning',
    subtitle: 'Curriculum & Resources',
    desc: 'Approved trainers deliver structured video modules, reading materials, PDFs, and hands-on domain collateral.',
    icon: BookOpen,
    badge: 'Content Delivery'
  },
  {
    number: '05',
    title: 'Standardized Assessment',
    subtitle: 'Automated MCQ Engine',
    desc: 'Trainees take timed online examinations featuring question navigation, countdown timers, and automated grading.',
    icon: FileText,
    badge: 'Skill Evaluation'
  },
  {
    number: '06',
    title: 'Verifiable Certification',
    subtitle: 'Automated PDF Generation',
    desc: 'Successful learners instantly earn cryptographically styled, verifiable PDF completion certificates.',
    icon: Award,
    badge: 'Credential Issued'
  },
  {
    number: '07',
    title: 'Admin Monitoring',
    subtitle: 'Real-Time Oversight',
    desc: 'Admins track real-time enrollment progress, pass rates, score distributions, and institutional skill readiness.',
    icon: BarChart3,
    badge: 'Analytics Engine'
  },
  {
    number: '08',
    title: 'Continuous Improvement',
    subtitle: 'Feedback & Iteration',
    desc: 'Assessment analytics and trainee feedback feed directly back into refining course structures and future competency mapping.',
    icon: TrendingUp,
    badge: 'Lifecycle Loop'
  }
];

export const ROLE_PORTALS = [
  {
    id: 'admin',
    role: 'Organization Admin',
    subtitle: 'Governance & Competency Control Center',
    accentColor: '#0EA5E9',
    accentBg: 'rgba(14, 165, 233, 0.12)',
    icon: Building2,
    route: '/admin/register',
    btnText: 'Register Organization Admin →',
    features: [
      'Manage organization settings & workspace dual access keys',
      'Review and approve pending trainer credentials & profiles',
      'Execute SIH26075 4-Factor Competency Matching algorithm',
      'Monitor real-time user enrollments, pass rates, & system analytics',
      'Broadcast targeted announcements across organization nodes'
    ]
  },
  {
    id: 'trainer',
    role: 'Verified Trainer',
    subtitle: 'Course Authoring & Assessment Management Studio',
    accentColor: '#8B5CF6',
    accentBg: 'rgba(139, 92, 246, 0.12)',
    icon: GraduationCap,
    route: '/trainer/apply',
    btnText: 'Apply as Trainer →',
    features: [
      'Create structured courses with multi-lesson video & PDF modules',
      'Design timed MCQ assessments with custom passing criteria',
      'Access trainer resource library & upload supplementary material',
      'Track trainee gradebooks, test attempts, & performance logs',
      'Maintain domain expertise profile for algorithmic competency matching'
    ]
  },
  {
    id: 'trainee',
    role: 'Trainee & Learner',
    subtitle: 'Professional Skill & Certificate Development Portal',
    accentColor: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    icon: Users,
    route: '/register',
    btnText: 'Register as Trainee →',
    features: [
      'Self-register using organization Trainee Access Key',
      'Browse & enroll in organization-mandated capacity-building courses',
      'Study via interactive video player and document viewer',
      'Attempt timed MCQ exams with real-time score feedback',
      'Download verifiable PDF certificates of completion'
    ]
  }
];

export const MATCHING_FACTORS = [
  { label: 'Skill Match', weight: '40%', desc: 'Exact & semantic overlap between required topics and trainer skills' },
  { label: 'Primary Domain Alignment', weight: '30%', desc: 'Direct vs secondary domain specialization score' },
  { label: 'Domain Experience', weight: '15%', desc: 'Field experience and teaching hours against subject thresholds' },
  { label: 'Academic Qualification', weight: '15%', desc: 'Credit for Ph.D., M.Tech, M.Sc. advanced credentials' }
];

export const DEMO_TRAINERS = [
  {
    name: 'Dr. Vikram R. Sharma',
    qual: 'Ph.D. Atmospheric Physics',
    exp: '14 Years Field Exp',
    domain: 'AWS, Azure Cloud, GIS, Radar Physics',
    score: 94,
    matchType: 'Optimal Match',
    rationale: 'Matches 4/4 required competencies + 14 yrs field experience & Ph.D. degree credentials.'
  },
  {
    name: 'Ananya Deshmukh',
    qual: 'M.Tech Computer Science',
    exp: '6 Years Teaching Exp',
    domain: 'React, Node.js, Cloud Architectures',
    score: 68,
    matchType: 'Partial Match',
    rationale: 'Strong cloud skills; missing GIS domain specialization required for course.'
  },
  {
    name: 'Rajesh K. Patel',
    qual: 'MBA & HR Analytics',
    exp: '8 Years Corporate Training',
    domain: 'Leadership, Team Management',
    score: 35,
    matchType: 'Unmatched',
    rationale: 'Domain expertise does not overlap with technical GIS & cloud prerequisites.'
  }
];

export const BENTO_FEATURES = [
  {
    id: 'governance',
    title: 'Role-Based Governance',
    desc: 'Strict permission boundaries separating Admin, Trainer, and Trainee workflows in a multi-tenant ecosystem.',
    icon: ShieldCheck,
    size: 'wide',
    accent: '#0EA5E9'
  },
  {
    id: 'courses',
    title: 'Structured Course Builder',
    desc: 'Organize curriculum into intuitive modules, video lectures, and PDF reading materials.',
    icon: BookOpen,
    size: 'normal',
    accent: '#3B82F6'
  },
  {
    id: 'resources',
    title: 'Resource Library',
    desc: 'Centralized repository for training materials, presentations, and technical documentation.',
    icon: FileText,
    size: 'normal',
    accent: '#8B5CF6'
  },
  {
    id: 'assessments',
    title: 'Automated MCQ Engine',
    desc: 'Timed exams featuring live countdowns, automated grading, instant score breakdowns, and pass/fail enforcement.',
    icon: CheckCircle,
    size: 'wide',
    accent: '#10B981'
  },
  {
    id: 'profiles',
    title: 'Professional Skill Profiles',
    desc: 'Detailed employee skill vectors, educational background, and competency readiness tags.',
    icon: Users,
    size: 'normal',
    accent: '#F59E0B'
  },
  {
    id: 'certificates',
    title: 'Verifiable PDF Certificates',
    desc: 'Instant generation of downloadable, cryptographically styled certificates of completion.',
    icon: Award,
    size: 'normal',
    accent: '#EC4899'
  },
  {
    id: 'approvals',
    title: 'Trainer Verification Gate',
    desc: 'Admin review and approval process ensuring only qualified subject experts teach trainees.',
    icon: UserCheck,
    size: 'wide',
    accent: '#6366F1'
  },
  {
    id: 'analytics',
    title: 'Real-Time Analytics',
    desc: 'Ecosystem dashboard tracking user progress, course completions, and assessment metrics.',
    icon: BarChart3,
    size: 'normal',
    accent: '#14B8A6'
  },
  {
    id: 'announcements',
    title: 'Targeted Broadcasts',
    desc: 'Publish organization-wide notices directly to role dashboards with priority tags.',
    icon: BellRing,
    size: 'normal',
    accent: '#F97316'
  },
  {
    id: 'mapping',
    title: 'SIH26075 Competency Engine',
    desc: 'Algorithmic matching pairing specialized training subjects with verified domain experts using a weighted 4-factor scoring model.',
    icon: Target,
    size: 'wide',
    accent: '#22D3EE'
  },
  {
    id: 'matching',
    title: 'Expertise Match Rationale',
    desc: 'Transparent human-readable scoring explanations detailing exact reasons for trainer recommendations.',
    icon: Compass,
    size: 'normal',
    accent: '#A855F7'
  },
  {
    id: 'security',
    title: 'Multi-Tenant Isolation',
    desc: 'Cryptographically unique dual access keys ensuring complete data isolation between independent organizations.',
    icon: Building2,
    size: 'wide',
    accent: '#0284C7'
  }
];
