import type { User, UserRole } from './user-types';

// ──────────────────────────────────────────────────────────────────────────────
// ✏️  Change this to preview a different role view in the app
export const CURRENT_USER_ROLE: UserRole = 'hod';
// ──────────────────────────────────────────────────────────────────────────────

// ─── Shared managed members pool ────────────────────────────────────────────

const sharedStudents = [
  {
    id: 's1', name: 'Aisha Sharma', rollOrEmpNo: 'CS21B001',
    avatarInitials: 'AS', avatarColor: '#4A90D9',
    memberRole: 'student' as const, subRole: 'class_representative' as const,
    department: 'Computer Science', year: '3rd Year', joinedDate: '2021-08-01',
  },
  {
    id: 's2', name: 'Rahul Verma', rollOrEmpNo: 'CS21B042',
    avatarInitials: 'RV', avatarColor: '#27AE60',
    memberRole: 'student' as const, subRole: 'event_organiser' as const,
    department: 'Computer Science', year: '3rd Year', joinedDate: '2021-08-01',
  },
  {
    id: 's3', name: 'Priya Nair', rollOrEmpNo: 'CS22B018',
    avatarInitials: 'PN', avatarColor: '#E67E22',
    memberRole: 'student' as const, subRole: 'none' as const,
    department: 'Computer Science', year: '2nd Year', joinedDate: '2022-08-01',
  },
  {
    id: 's4', name: 'Kiran Patel', rollOrEmpNo: 'CS21B067',
    avatarInitials: 'KP', avatarColor: '#8E44AD',
    memberRole: 'student' as const, subRole: 'student_coordinator' as const,
    department: 'Computer Science', year: '3rd Year', joinedDate: '2021-08-01',
  },
];

const sharedFaculty = [
  {
    id: 'f1', name: 'Dr. Meena Krishnan', rollOrEmpNo: 'EMP2045',
    avatarInitials: 'MK', avatarColor: '#7B68EE',
    memberRole: 'staff' as const, subRole: 'class_advisor' as const,
    department: 'Computer Science', joinedDate: '2015-06-01',
  },
  {
    id: 'f2', name: 'Prof. Rajan Iyer', rollOrEmpNo: 'EMP1892',
    avatarInitials: 'RI', avatarColor: '#C0392B',
    memberRole: 'staff' as const, subRole: 'department_coordinator' as const,
    department: 'Computer Science', joinedDate: '2010-07-15',
  },
  {
    id: 'f3', name: 'Ms. Divya Menon', rollOrEmpNo: 'EMP3101',
    avatarInitials: 'DM', avatarColor: '#27AE60',
    memberRole: 'org_advisor' as const, subRole: 'none' as const,
    department: 'Computer Science', joinedDate: '2019-01-10',
  },
];

// ─── Mock Users by Role ─────────────────────────────────────────────────────

const MOCK_USERS: Record<UserRole, User> = {
  student: {
    id: 'u-student',
    name: 'Aisha Sharma',
    email: 'aisha.sharma@college.edu',
    phone: '+91 98765 43210',
    avatarInitials: 'AS',
    avatarColor: '#4A90D9',
    primaryRole: 'student',
    department: 'Computer Science',
    institution: 'National Institute of Technology',
    rollOrEmpNo: 'CS21B001',
    year: '3rd Year',
    eventsAttended: 14,
    eventsOrganised: 2,
    eventsUpcoming: 3,
    organisations: [
      {
        id: 'org1', orgName: 'IEEE Student Branch', orgType: 'association',
        position: 'Student Coordinator', joinedYear: '2022', isActive: true, memberCount: 48,
      },
      {
        id: 'org2', orgName: 'CodeChef Chapter', orgType: 'club',
        position: 'Member', joinedYear: '2023', isActive: true, memberCount: 72,
      },
    ],
    managedMembers: [],
  },

  staff: {
    id: 'u-staff',
    name: 'Ms. Divya Menon',
    email: 'divya.menon@college.edu',
    phone: '+91 97654 32198',
    avatarInitials: 'DM',
    avatarColor: '#27AE60',
    primaryRole: 'staff',
    department: 'Computer Science',
    institution: 'National Institute of Technology',
    rollOrEmpNo: 'EMP3101',
    eventsAttended: 6,
    eventsOrganised: 8,
    eventsUpcoming: 1,
    organisations: [
      {
        id: 'org3', orgName: 'IEEE Student Branch', orgType: 'association',
        position: 'Faculty Advisor', joinedYear: '2020', isActive: true, memberCount: 48,
      },
    ],
    managedMembers: [],
  },

  hod: {
    id: 'u-hod',
    name: 'Dr. S. Ramachandran',
    email: 'hod.cs@college.edu',
    phone: '+91 94432 11098',
    avatarInitials: 'SR',
    avatarColor: '#E67E22',
    primaryRole: 'hod',
    department: 'Computer Science',
    institution: 'National Institute of Technology',
    rollOrEmpNo: 'EMP1001',
    eventsAttended: 22,
    eventsOrganised: 15,
    eventsUpcoming: 4,
    organisations: [
      {
        id: 'org4', orgName: 'Dept. Academic Committee', orgType: 'committee',
        position: 'Chairperson', joinedYear: '2018', isActive: true, memberCount: 12,
      },
      {
        id: 'org5', orgName: 'ISTE Chapter', orgType: 'association',
        position: 'Faculty In-charge', joinedYear: '2016', isActive: true, memberCount: 90,
      },
    ],
    managedMembers: [...sharedFaculty, ...sharedStudents],
  },

  org_advisor: {
    id: 'u-advisor',
    name: 'Ms. Divya Menon',
    email: 'divya.menon@college.edu',
    phone: '+91 97654 32198',
    avatarInitials: 'DM',
    avatarColor: '#27AE60',
    primaryRole: 'org_advisor',
    department: 'Computer Science',
    institution: 'National Institute of Technology',
    rollOrEmpNo: 'EMP3101',
    eventsAttended: 6,
    eventsOrganised: 8,
    eventsUpcoming: 1,
    organisations: [
      {
        id: 'org3', orgName: 'IEEE Student Branch', orgType: 'association',
        position: 'Faculty Advisor', joinedYear: '2020', isActive: true, memberCount: 48,
      },
    ],
    managedMembers: sharedStudents,
  },

  vice_principal: {
    id: 'u-vp',
    name: 'Prof. Anitha Suresh',
    email: 'vp@college.edu',
    phone: '+91 99876 54321',
    avatarInitials: 'AP',
    avatarColor: '#8E44AD',
    primaryRole: 'vice_principal',
    department: 'Administration',
    institution: 'National Institute of Technology',
    rollOrEmpNo: 'EMP0010',
    eventsAttended: 40,
    eventsOrganised: 25,
    eventsUpcoming: 6,
    organisations: [
      {
        id: 'org6', orgName: 'Academic Council', orgType: 'committee',
        position: 'Vice Chairperson', joinedYear: '2015', isActive: true, memberCount: 30,
      },
    ],
    managedMembers: [...sharedFaculty, ...sharedStudents],
  },

  admin: {
    id: 'u-admin',
    name: 'Mr. Suresh Kumar',
    email: 'admin@college.edu',
    phone: '+91 98001 23456',
    avatarInitials: 'SK',
    avatarColor: '#C0392B',
    primaryRole: 'admin',
    department: 'Administration',
    institution: 'National Institute of Technology',
    rollOrEmpNo: 'EMP0001',
    eventsAttended: 55,
    eventsOrganised: 30,
    eventsUpcoming: 8,
    organisations: [
      {
        id: 'org7', orgName: 'Student Affairs Board', orgType: 'committee',
        position: 'Secretary', joinedYear: '2012', isActive: true, memberCount: 20,
      },
    ],
    managedMembers: [...sharedFaculty, ...sharedStudents],
  },
};

export const MOCK_USER: User = MOCK_USERS[CURRENT_USER_ROLE];
