import mongoose, { Schema, Document } from 'mongoose';

export interface IVoice extends Document {
  assistantId: string;
  content: string;
  businessName: string;
  backchannelingEnabled: boolean;
  backgroundDenoisingEnabled: boolean;
  fillerInjectionEnabled: boolean;
  optimizeStreamingLatency: string;
  style: string;
  name: string;
  userId: string;
  voicemailMessage: string;
  endCallMessage: string;
  useSpeakerBoost: boolean;
  forwardingPhoneNumber: string;
  similarityBoost: number;
  Stability: number;
  backgroundSound: string;
  providerId: string;
  provider: string;
  language: string;
  selectedCategory: string;
  selectedVoice: object;
  calendarAvailability: {
    name: string;
    time: string;
    description: string;
    apiKey: string;
    eventTypeId: string;
    timezone: string;
    assistantId: string;
  };
  selectedModel: string;
  fileIds: Array<any>;
  toolIds: Array<any>;
}

const voiceSchema = new Schema({
  assistantId: { type: String },
  content: { type: String },
  firstMessage: { type: String },
  backchannelingEnabled: { type: Boolean, default: false },
  backgroundDenoisingEnabled: { type: Boolean, default: false },
  fillerInjectionEnabled: { type: Boolean, default: false },
  optimizeStreamingLatency: { type: String },
  style: { type: String },
  name: { type: String },
  userId: { type: String,},
  voicemailMessage: { type: String },
  endCallMessage: { type: String },
  useSpeakerBoost: { type: Boolean, default: false },
  forwardingPhoneNumber: { type: String },
  similarityBoost: { type: Number },
  Stability: { type: Number },
  backgroundSound: { type: String },
  providerId: { type: String },
  provider: { type: String },
  language: { type: String },
  selectedCategory: { type: String },
  selectedVoice: { type: Schema.Types.Mixed },
  calendarAvailability: {
    name: { type: String },
    time: { type: String },
    description: { type: String },
    apiKey: { type: String },
    eventTypeId: { type: String },
    timezone: { type: String },
    assistantId: { type: String }
  },
  selectedModel: { type: String },
  fileIds: [{ type: Schema.Types.Mixed }],
  toolIds: [{ type: Schema.Types.Mixed }]
}, { timestamps: true });

export default mongoose.model<IVoice>('Voice', voiceSchema); 