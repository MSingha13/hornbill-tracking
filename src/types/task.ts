export type TaskStatus = 'กำลังดำเนินการ' | 'ยังไม่เริ่ม' | 'เสร็จสิ้น' | 'เกินกำหนด' | 'รอดำเนินการ' | 'ยกเลิก';

export type TaskPriority = 'สูง' | 'ปานกลาง' | 'ต่ำ';

export interface Task {
  id: string;
  title: string;
  project: string;
  assignee: string;
  startDate: string; // e.g. "8 ต.ค. 69" or "2026-10-08"
  dueDate: string;   // e.g. "15 ต.ค. 69" or "2026-10-15"
  status: TaskStatus;
  progress: number;  // 0 - 100
  priority: TaskPriority;
  note: string;
  daysOverdue?: number;
}

export interface ProjectProgress {
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  color: string;
}

export interface AssigneeStat {
  name: string;
  count: number;
  color: string;
}

export interface NotificationSettings {
  emailSender: string;
  emailRecipient: string;
  sendDailyAt: string;
  daysNotice: number;
  lineNotifyEnabled: boolean;
  lineNotifyToken: string;
  sheetId: string;
  scriptUrl: string;
}
