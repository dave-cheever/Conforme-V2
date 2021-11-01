export interface IBase {
  _id: string;
  metatags?: {
    addedBy?: string;
    addedAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };
}

export interface IWithName extends IBase {
  organizationId?: string;
  name: string;
  // totalResponses?: number; // Injected number of total responses for item
  // overdueResponses?: number; // Injected number of overdue responses for item
}
