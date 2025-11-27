import { Timestamp } from 'firebase/firestore';

export type ReportReasonCode =
  | 'FAKE_PROFILE'
  | 'SPAM'
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'ILLEGAL_CONTENT'
  | 'OTHER';

export type ReportType = 'PROFILE' | 'MESSAGE';

export interface Report {
  id?: string;
  type: ReportType;
  reporterId: string;
  reportedUserId: string;
  
  // Context for message reports
  conversationId?: string;
  messageId?: string;
  
  reasonCode: ReportReasonCode;
  reasonText?: string;
  createdAt: Timestamp;
  status: 'OPEN' | 'IN_REVIEW' | 'CLOSED';
}
