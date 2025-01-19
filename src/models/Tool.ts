import mongoose, { Schema, Document } from 'mongoose';

export interface ITool extends Document {
  toolId: string;
  name: string;
  created: string;
  definition: {
    description: string;
    requirements?: {
      httpSecurityOptions: {
        options: Array<any>;
      };
    };
    http: {
      baseUrlPattern: string;
      httpMethod: string;
    };
    modelToolName: string;
    timeout?: string;
    precomputable?: boolean;
  };
}

const ToolSchema = new Schema({
  toolId: { type: String, required: true },
  name: { type: String, required: true },
  created: { type: String, required: true },
  definition: {
    description: { type: String, required: true },
    requirements: {
      httpSecurityOptions: {
        options: [Schema.Types.Mixed]
      }
    },
    http: {
      baseUrlPattern: { type: String, required: true },
      httpMethod: { type: String, required: true }
    },
    modelToolName: { type: String, required: true },
    timeout: String,
    precomputable: Boolean
  }
}, { timestamps: true });

export const Tool = mongoose.model<ITool>('Tool', ToolSchema); 