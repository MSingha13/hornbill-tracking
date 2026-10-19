import { Task } from '../types/task';

// Key showcase tasks matching the screenshot
const primaryTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'พัฒนาระบบติดตาม',
    project: 'โครงการพัฒนาระบบติดตาม',
    assignee: 'นาย A',
    startDate: '8 ต.ค. 69',
    dueDate: '15 ต.ค. 69',
    status: 'กำลังดำเนินการ',
    progress: 60,
    priority: 'สูง',
    note: '-',
  },
  {
    id: 'TASK-002',
    title: 'ทดสอบระบบ',
    project: 'โครงการทดสอบระบบ',
    assignee: 'นาย B',
    startDate: '10 ต.ค. 69',
    dueDate: '20 ต.ค. 69',
    status: 'ยังไม่เริ่ม',
    progress: 0,
    priority: 'ปานกลาง',
    note: '-',
  },
  {
    id: 'TASK-003',
    title: 'จัดทำรายงาน',
    project: 'โครงการอบรม/พัฒนา',
    assignee: 'นางสาว C',
    startDate: '9 ต.ค. 69',
    dueDate: '16 ต.ค. 69',
    status: 'เสร็จสิ้น',
    progress: 100,
    priority: 'สูง',
    note: '-',
  },
  {
    id: 'TASK-004',
    title: 'ประชุมทีม',
    project: 'โครงการพัฒนาระบบติดตาม',
    assignee: 'นาย D',
    startDate: '7 ต.ค. 69',
    dueDate: '14 ต.ค. 69',
    status: 'กำลังดำเนินการ',
    progress: 70,
    priority: 'ปานกลาง',
    note: '-',
  },
  {
    id: 'TASK-005',
    title: 'พัฒนาเว็บไซต์',
    project: 'โครงการวิจัยและพัฒนา',
    assignee: 'นางสาว E',
    startDate: '5 ต.ค. 69',
    dueDate: '12 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 30,
    priority: 'สูง',
    note: '-',
  },
  {
    id: 'TASK-006',
    title: 'จัดซื้ออุปกรณ์',
    project: 'โครงการวิจัยและพัฒนา',
    assignee: 'นาย A',
    startDate: '6 ต.ค. 69',
    dueDate: '18 ต.ค. 69',
    status: 'รอดำเนินการ',
    progress: 20,
    priority: 'ต่ำ',
    note: '-',
  },
  // Top 5 Overdue tasks from the screenshot widget
  {
    id: 'TASK-023',
    title: 'ทดสอบระบบ',
    project: 'โครงการทดสอบระบบ',
    assignee: 'นาย B',
    startDate: '20 ก.ย. 69',
    dueDate: '1 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 40,
    priority: 'สูง',
    note: 'รอแก้บั๊ก',
    daysOverdue: 9,
  },
  {
    id: 'TASK-045',
    title: 'จัดทำเอกสาร',
    project: 'โครงการอบรม/พัฒนา',
    assignee: 'นาย A',
    startDate: '22 ก.ย. 69',
    dueDate: '3 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 50,
    priority: 'ปานกลาง',
    note: 'รอเอกสารแนบ',
    daysOverdue: 7,
  },
  {
    id: 'TASK-067',
    title: 'อบรมผู้ใช้งาน',
    project: 'โครงการอบรม/พัฒนา',
    assignee: 'นางสาว C',
    startDate: '25 ก.ย. 69',
    dueDate: '5 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 20,
    priority: 'สูง',
    note: 'เลื่อนห้องประชุม',
    daysOverdue: 5,
  },
  {
    id: 'TASK-089',
    title: 'แก้ไขระบบ',
    project: 'โครงการพัฒนาระบบติดตาม',
    assignee: 'นาย D',
    startDate: '28 ก.ย. 69',
    dueDate: '6 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 65,
    priority: 'สูง',
    note: 'กำลังตรวจสอบ log',
    daysOverdue: 4,
  },
  {
    id: 'TASK-102',
    title: 'รายงานผล',
    project: 'โครงการวิจัยและพัฒนา',
    assignee: 'นางสาว E',
    startDate: '1 ต.ค. 69',
    dueDate: '8 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 80,
    priority: 'ปานกลาง',
    note: 'รอสรุปตัวเลข',
    daysOverdue: 2,
  },
];

// Additional overdue tasks to make exact 10 overdue tasks
const additionalOverdue: Task[] = [
  {
    id: 'TASK-011',
    title: 'ติดตั้งเซิร์ฟเวอร์สำรอง',
    project: 'โครงการพัฒนาระบบติดตาม',
    assignee: 'นาย B',
    startDate: '29 ก.ย. 69',
    dueDate: '7 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 35,
    priority: 'สูง',
    note: 'รออะไหล่ฮาร์ดแวร์',
    daysOverdue: 3,
  },
  {
    id: 'TASK-012',
    title: 'ตรวจสอบสิทธิ์ผู้ใช้งาน',
    project: 'โครงการอบรม/พัฒนา',
    assignee: 'นาย A',
    startDate: '28 ก.ย. 69',
    dueDate: '8 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 55,
    priority: 'ปานกลาง',
    note: '-',
    daysOverdue: 2,
  },
  {
    id: 'TASK-013',
    title: 'จัดเตรียมสไลด์นำเสนอ',
    project: 'โครงการอบรม/พัฒนา',
    assignee: 'นางสาว C',
    startDate: '2 ต.ค. 69',
    dueDate: '9 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 70,
    priority: 'ต่ำ',
    note: '-',
    daysOverdue: 1,
  },
  {
    id: 'TASK-014',
    title: 'ตรวจรับงานงวดที่ 1',
    project: 'โครงการวิจัยและพัฒนา',
    assignee: 'นาย D',
    startDate: '1 ต.ค. 69',
    dueDate: '7 ต.ค. 69',
    status: 'เกินกำหนด',
    progress: 45,
    priority: 'สูง',
    note: 'รอกรรมการลงนาม',
    daysOverdue: 3,
  },
];

// Complete tasks generator to reach 76 completed, 42 in progress, 5 pending, 10 overdue = total 128 tasks
function generateFullDataset(): Task[] {
  const tasks: Task[] = [...primaryTasks, ...additionalOverdue];
  
  // Track existing counts
  // Total target: 128
  // Completed: 76 (current: 1) -> need 75 more
  // In Progress: 42 (current: 2) -> need 40 more
  // Pending: 5 (current: 2: TASK-002 ยังไม่เริ่ม, TASK-006 รอดำเนินการ) -> need 3 more
  // Overdue: 10 (currently have 10: TASK-005, 023, 045, 067, 089, 102, 011, 012, 013, 014 = 10)
  
  const assignees = ['นาย A', 'นาย B', 'นางสาว C', 'นาย D', 'นางสาว E'];
  const projects = [
    'โครงการพัฒนาระบบติดตาม',
    'โครงการทดสอบระบบ',
    'โครงการอบรม/พัฒนา',
    'โครงการวิจัยและพัฒนา'
  ];
  
  // Titles pool
  const actionPool = [
    'ออกแบบ UI Dashboard', 'ทำ Unit Test', 'เชื่อมต่อ API Google Sheets',
    'จัดทำคู่มือการใช้งาน', 'ทดสอบ Performance', 'ประชุมวางแผน Sprint',
    'ปรับปรุงความปลอดภัย', 'สำรองข้อมูลประจำสัปดาห์', 'ตั้งค่า LINE Notify',
    'ตรวจทานโค้ดระบบ', 'ปรับปรุง Flow การทำงาน', 'สรุปสถิติผู้ใช้งาน'
  ];
  
  let currentId = 15;
  
  // Add 75 completed tasks
  for (let i = 0; i < 75; i++) {
    const assignee = assignees[i % assignees.length];
    const project = projects[i % projects.length];
    const title = `${actionPool[i % actionPool.length]} #${i + 1}`;
    const idStr = `TASK-${String(currentId++).padStart(3, '0')}`;
    tasks.push({
      id: idStr,
      title,
      project,
      assignee,
      startDate: `${(i % 25) + 1} ก.ย. 69`,
      dueDate: `${(i % 28) + 1} ต.ค. 69`,
      status: 'เสร็จสิ้น',
      progress: 100,
      priority: i % 3 === 0 ? 'สูง' : i % 3 === 1 ? 'ปานกลาง' : 'ต่ำ',
      note: 'ดำเนินการเรียบร้อย',
    });
  }
  
  // Add 40 in-progress tasks
  for (let i = 0; i < 40; i++) {
    const assignee = assignees[i % assignees.length];
    const project = projects[i % projects.length];
    const title = `${actionPool[i % actionPool.length]} ระยะที่ ${(i % 3) + 1}`;
    const idStr = `TASK-${String(currentId++).padStart(3, '0')}`;
    tasks.push({
      id: idStr,
      title,
      project,
      assignee,
      startDate: `${(i % 10) + 1} ต.ค. 69`,
      dueDate: `${(i % 15) + 15} ต.ค. 69`,
      status: 'กำลังดำเนินการ',
      progress: Math.floor(30 + Math.random() * 55),
      priority: i % 2 === 0 ? 'สูง' : 'ปานกลาง',
      note: 'กำลังดำเนินการตามแผน',
    });
  }
  
  // Add 3 pending tasks
  for (let i = 0; i < 3; i++) {
    const assignee = assignees[i % assignees.length];
    const project = projects[i % projects.length];
    const title = `เตรียมการ ${actionPool[i % actionPool.length]}`;
    const idStr = `TASK-${String(currentId++).padStart(3, '0')}`;
    tasks.push({
      id: idStr,
      title,
      project,
      assignee,
      startDate: `${(i % 5) + 10} ต.ค. 69`,
      dueDate: `${(i % 10) + 20} ต.ค. 69`,
      status: 'รอดำเนินการ',
      progress: 0,
      priority: 'ปานกลาง',
      note: 'รอเริ่มตามคิว',
    });
  }
  
  return tasks;
}

export const initialTasks: Task[] = generateFullDataset();

export const initialNotificationSettings = {
  emailSender: 'task-tracker@gistda.or.th',
  emailRecipient: 'singha13@gmail.com',
  sendDailyAt: '09:00',
  daysNotice: 3,
  lineNotifyEnabled: true,
  lineNotifyToken: 'LINE_TOKEN_EXAMPLE_123',
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  scriptUrl: 'https://script.google.com/macros/s/AKfycbz_example_track/exec',
};
