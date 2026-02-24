// ─── Role Definitions ────────────────────────────────────────────────────────

export type UserRole =
  | 'student'
  | 'staff'
  | 'hod'
  | 'org_advisor'
  | 'vice_principal'
  | 'admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  staff: 'Staff',
  hod: 'Head of Department',
  org_advisor: 'Faculty Advisor',
  vice_principal: 'Vice Principal',
  admin: 'Administrator',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  student: '#4A90D9',
  staff: '#7B68EE',
  hod: '#E67E22',
  org_advisor: '#27AE60',
  vice_principal: '#8E44AD',
  admin: '#C0392B',
};

// ─── Sub-roles assignable by HOD / Advisors ─────────────────────────────────

export type SubRole =
  | 'none'
  | 'class_representative'
  | 'student_coordinator'
  | 'lab_assistant'
  | 'event_organiser'
  | 'mentor'
  | 'class_advisor'
  | 'department_coordinator';

export const SUB_ROLE_LABELS: Record<SubRole, string> = {
  none: 'No Sub-role',
  class_representative: 'Class Representative',
  student_coordinator: 'Student Coordinator',
  lab_assistant: 'Lab Assistant',
  event_organiser: 'Event Organiser',
  mentor: 'Mentor',
  class_advisor: 'Class Advisor',
  department_coordinator: 'Dept. Coordinator',
};

// ─── Organisation membership ─────────────────────────────────────────────────

export interface OrgMembership {
  id: string;
  orgName: string;
  orgType: 'club' | 'association' | 'committee' | 'nss' | 'department';
  position: string;         // e.g. "Student Coordinator", "Secretary"
  joinedYear: string;       // e.g. "2023"
  isActive: boolean;
  memberCount: number;
}

// ─── Department / Org member (for management list) ───────────────────────────

export interface ManagedMember {
  id: string;
  name: string;
  rollOrEmpNo: string;
  avatarInitials: string;
  avatarColor: string;
  memberRole: UserRole;
  subRole: SubRole;
  department: string;
  year?: string;            // for students
  joinedDate: string;
}

// ─── Main User type ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUri?: string;
  avatarInitials: string;
  avatarColor: string;
  primaryRole: UserRole;
  department: string;
  institution: string;
  rollOrEmpNo: string;
  year?: string;            // relevant for students
  eventsAttended: number;
  eventsOrganised: number;
  eventsUpcoming: number;
  organisations: OrgMembership[];
  managedMembers: ManagedMember[];  // visible only to HOD / advisor / admin roles
}
