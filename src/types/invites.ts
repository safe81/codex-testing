export type InviteType =
  | 'LIFETIME_COUPLE'
  | 'SINGLE_F'
  | 'SINGLE_M'
  | 'CLUB';

export interface Invite {
  code: string;
  type: InviteType;
  maxUses: number;
  usedCount: number;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
}
