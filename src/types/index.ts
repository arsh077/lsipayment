export interface MainSale {
  id: string;
  customerName: string;
  number: string;
  amount: number;
  feedback: string;
  date: string; // ISO string
}

export interface EmployeeSale {
  id: string;
  employeeName: string;
  leadName: string;
  number: string;
  amount: number;
  feedbackDuration: string;
  paymentStatus: 'Full' | 'Half' | 'Pending';
  dueAmount: number;
  date: string; // ISO string
}

export interface Employee {
  id: string;
  name: string;
  role: string;
}
