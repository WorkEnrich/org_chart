import { Employee } from '../types/Employee';

export const employees: Employee[] = [
  // CEO
  {
    id: 'emp1',
    name: 'Sarah Johnson',
    position: 'Chief Executive Officer',
    department: 'Executive',
    level: 1,
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0101',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },

  // C-Level Executives
  {
    id: 'emp2',
    name: 'Michael Chen',
    position: 'Chief Technology Officer',
    department: 'Engineering',
    level: 2,
    email: 'michael.chen@company.com',
    phone: '+1-555-0102',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp1'
  },
  {
    id: 'emp3',
    name: 'Jennifer Davis',
    position: 'Chief Marketing Officer',
    department: 'Marketing',
    level: 2,
    email: 'jennifer.davis@company.com',
    phone: '+1-555-0103',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp1'
  },
  {
    id: 'emp4',
    name: 'Robert Wilson',
    position: 'Chief Financial Officer',
    department: 'Finance',
    level: 2,
    email: 'robert.wilson@company.com',
    phone: '+1-555-0104',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp1'
  },
  {
    id: 'emp5',
    name: 'Lisa Anderson',
    position: 'Chief Operations Officer',
    department: 'Operations',
    level: 2,
    email: 'lisa.anderson@company.com',
    phone: '+1-555-0105',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp1'
  },
  {
    id: 'emp6',
    name: 'David Thompson',
    position: 'Chief Human Resources Officer',
    department: 'HR',
    level: 2,
    email: 'david.thompson@company.com',
    phone: '+1-555-0106',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp1'
  },

  // Engineering Department
  {
    id: 'emp7',
    name: 'Emily Rodriguez',
    position: 'VP of Engineering',
    department: 'Engineering',
    level: 3,
    email: 'emily.rodriguez@company.com',
    phone: '+1-555-0107',
    avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp2'
  },
  {
    id: 'emp8',
    name: 'James Miller',
    position: 'Engineering Director',
    department: 'Engineering',
    level: 4,
    email: 'james.miller@company.com',
    phone: '+1-555-0108',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp7'
  },
  {
    id: 'emp9',
    name: 'Anna Garcia',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    level: 5,
    email: 'anna.garcia@company.com',
    phone: '+1-555-0109',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp8'
  },
  {
    id: 'emp10',
    name: 'Kevin Brown',
    position: 'Software Engineer',
    department: 'Engineering',
    level: 5,
    email: 'kevin.brown@company.com',
    phone: '+1-555-0110',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp8'
  },

  // Generate more engineering employees
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `emp${11 + i}`,
    name: `Engineer ${i + 1}`,
    position: i % 3 === 0 ? 'Senior Software Engineer' : i % 3 === 1 ? 'Software Engineer' : 'Junior Software Engineer',
    department: 'Engineering',
    level: i % 3 === 0 ? 5 : i % 3 === 1 ? 5 : 6,
    email: `engineer${i + 1}@company.com`,
    phone: `+1-555-${(111 + i).toString().padStart(4, '0')}`,
    avatar: `https://images.pexels.com/photos/${1000000 + (i * 1000)}/pexels-photo-${1000000 + (i * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    managerId: i < 15 ? 'emp8' : 'emp7'
  })),

  // Marketing Department
  {
    id: 'emp41',
    name: 'Sophie Martinez',
    position: 'VP of Marketing',
    department: 'Marketing',
    level: 3,
    email: 'sophie.martinez@company.com',
    phone: '+1-555-0141',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp3'
  },
  {
    id: 'emp42',
    name: 'Alex Johnson',
    position: 'Marketing Director',
    department: 'Marketing',
    level: 4,
    email: 'alex.johnson@company.com',
    phone: '+1-555-0142',
    avatar: 'https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp41'
  },

  // Generate marketing team
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `emp${43 + i}`,
    name: `Marketing Professional ${i + 1}`,
    position: i % 4 === 0 ? 'Senior Marketing Manager' : i % 4 === 1 ? 'Marketing Manager' : i % 4 === 2 ? 'Marketing Specialist' : 'Marketing Coordinator',
    department: 'Marketing',
    level: i % 4 === 0 ? 5 : i % 4 === 1 ? 5 : 6,
    email: `marketing${i + 1}@company.com`,
    phone: `+1-555-${(143 + i).toString().padStart(4, '0')}`,
    avatar: `https://images.pexels.com/photos/${1100000 + (i * 1000)}/pexels-photo-${1100000 + (i * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    managerId: i < 12 ? 'emp42' : 'emp41'
  })),

  // Sales Department
  {
    id: 'emp68',
    name: 'Ryan Taylor',
    position: 'VP of Sales',
    department: 'Sales',
    level: 3,
    email: 'ryan.taylor@company.com',
    phone: '+1-555-0168',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp3'
  },
  {
    id: 'emp69',
    name: 'Maria Gonzalez',
    position: 'Sales Director',
    department: 'Sales',
    level: 4,
    email: 'maria.gonzalez@company.com',
    phone: '+1-555-0169',
    avatar: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp68'
  },

  // Generate sales team
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `emp${70 + i}`,
    name: `Sales Professional ${i + 1}`,
    position: i % 3 === 0 ? 'Senior Sales Manager' : i % 3 === 1 ? 'Sales Manager' : 'Sales Representative',
    department: 'Sales',
    level: i % 3 === 0 ? 5 : i % 3 === 1 ? 5 : 6,
    email: `sales${i + 1}@company.com`,
    phone: `+1-555-${(170 + i).toString().padStart(4, '0')}`,
    avatar: `https://images.pexels.com/photos/${1200000 + (i * 1000)}/pexels-photo-${1200000 + (i * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    managerId: i < 18 ? 'emp69' : 'emp68'
  })),

  // Finance Department
  {
    id: 'emp105',
    name: 'Catherine Lee',
    position: 'VP of Finance',
    department: 'Finance',
    level: 3,
    email: 'catherine.lee@company.com',
    phone: '+1-555-0205',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp4'
  },

  // Generate finance team
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `emp${106 + i}`,
    name: `Finance Professional ${i + 1}`,
    position: i % 3 === 0 ? 'Senior Financial Analyst' : i % 3 === 1 ? 'Financial Analyst' : 'Accountant',
    department: 'Finance',
    level: i % 3 === 0 ? 5 : 6,
    email: `finance${i + 1}@company.com`,
    phone: `+1-555-${(206 + i).toString().padStart(4, '0')}`,
    avatar: `https://images.pexels.com/photos/${1300000 + (i * 1000)}/pexels-photo-${1300000 + (i * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    managerId: 'emp105'
  })),

  // HR Department
  {
    id: 'emp126',
    name: 'Jonathan White',
    position: 'VP of Human Resources',
    department: 'HR',
    level: 3,
    email: 'jonathan.white@company.com',
    phone: '+1-555-0226',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp6'
  },

  // Generate HR team
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `emp${127 + i}`,
    name: `HR Professional ${i + 1}`,
    position: i % 3 === 0 ? 'Senior HR Manager' : i % 3 === 1 ? 'HR Manager' : 'HR Specialist',
    department: 'HR',
    level: i % 3 === 0 ? 5 : 6,
    email: `hr${i + 1}@company.com`,
    phone: `+1-555-${(227 + i).toString().padStart(4, '0')}`,
    avatar: `https://images.pexels.com/photos/${1400000 + (i * 1000)}/pexels-photo-${1400000 + (i * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    managerId: 'emp126'
  })),

  // Operations Department
  {
    id: 'emp142',
    name: 'Patricia Moore',
    position: 'VP of Operations',
    department: 'Operations',
    level: 3,
    email: 'patricia.moore@company.com',
    phone: '+1-555-0242',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    managerId: 'emp5'
  },

  // Generate operations team
  ...Array.from({ length: 58 }, (_, i) => ({
    id: `emp${143 + i}`,
    name: `Operations Professional ${i + 1}`,
    position: i % 4 === 0 ? 'Senior Operations Manager' : i % 4 === 1 ? 'Operations Manager' : i % 4 === 2 ? 'Operations Specialist' : 'Operations Coordinator',
    department: 'Operations',
    level: i % 4 === 0 ? 5 : i % 4 === 1 ? 5 : 6,
    email: `operations${i + 1}@company.com`,
    phone: `+1-555-${(243 + i).toString().padStart(4, '0')}`,
    avatar: `https://images.pexels.com/photos/${1500000 + (i * 1000)}/pexels-photo-${1500000 + (i * 1000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    managerId: i < 29 ? 'emp142' : 'emp5'
  }))
];