export interface IVoiceInput {
  assistantId: string;
  content: string;
  businessName: string;
  // ... other fields ...
  userId: string;
  organizationId: string; // Added new field
}

export interface IVoiceResponse {
  id: string;
  assistantId: string;
  // ... other fields ...
  createdAt: Date;
  updatedAt: Date;
}

export class VoiceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VoiceNotFoundError';
  }
} 