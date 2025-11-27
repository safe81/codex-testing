export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

export interface Connection {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}
