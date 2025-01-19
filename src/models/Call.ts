import mongoose, { Document, Schema } from 'mongoose';

export interface ICall extends Document {
    callId: string;
    userId: Schema.Types.ObjectId;
    created: string;
    ended: string | null;
    model: string;
    systemPrompt: string;
    temperature: number;
    voice: string | null;
    languageHint: string | null;
    maxDuration: string;
    joinUrl: string;
    recordingEnabled: boolean;
    recordingUrl?: string;
    status: 'created' | 'active' | 'ended' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

const callSchema = new Schema(
    {
        callId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        created: {
            type: String,
            required: true
        },
        ended: {
            type: String,
            default: null
        },
        model: {
            type: String,
            required: true
        },
        systemPrompt: {
            type: String,
            required: true
        },
        temperature: {
            type: Number,
            required: true
        },
        voice: {
            type: String,
            default: null
        },
        languageHint: {
            type: String,
            default: null
        },
        maxDuration: {
            type: String,
            required: true
        },
        joinUrl: {
            type: String,
            required: true
        },
        recordingEnabled: {
            type: Boolean,
            default: false
        },
        recordingUrl: {
            type: String
        },
        status: {
            type: String,
            enum: ['created', 'active', 'ended', 'failed'],
            default: 'created'
        }
    },
    {
        timestamps: true
    }
);

export const Call = mongoose.model<ICall>('Assistants', callSchema);