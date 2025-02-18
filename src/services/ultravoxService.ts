import axios from "axios";
import { config } from "../config";
import { AppError } from "../utils/AppError";
import { Call, ICall } from "../models/Call";
import { Types } from "mongoose";

if (!config.ULTRAVOX_API_KEY) {
  throw new Error("ULTRAVOX_API_KEY must be set in environment variables");
}

const ultravoxApi = axios.create({
  baseURL: config.ULTRAVOX_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": config.ULTRAVOX_API_KEY,
  },
});

export interface CreateCallParams {
  systemPrompt: string;
  temperature?: number;
  voice?: string | null;
  languageHint?: string | null;
  maxDuration?: string;
  recordingEnabled?: boolean;
}

export const ultravoxService = {
  async createCall(params: CreateCallParams, userId: string) {
    try {
      // Create call in Ultravox
      const response = await ultravoxApi.post("/calls", params);
      const ultravoxCall = response.data;

      // Store call in database
      const call = await Call.create({
        callId: ultravoxCall.callId,
        userId: new Types.ObjectId(userId),
        created: ultravoxCall.created,
        ended: ultravoxCall.ended,
        model: ultravoxCall.model,
        systemPrompt: ultravoxCall.systemPrompt,
        temperature: ultravoxCall.temperature,
        voice: ultravoxCall.voice,
        languageHint: ultravoxCall.languageHint,
        maxDuration: ultravoxCall.maxDuration || "3600s",
        joinUrl: ultravoxCall.joinUrl,
        recordingEnabled: ultravoxCall.recordingEnabled || false,
        status: "created",
      });

      return call;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.data?.message || "Failed to create call",
          error.response?.status || 500
        );
      }
      throw error;
    }
  },

  async getCall(callId: string) {
    try {
      // Get call from database
      const call = await Call.findOne({ callId });
      if (!call) {
        throw new AppError("Call not found", 404);
      }

      // Get updated status from Ultravox
      const response = await ultravoxApi.get(`/calls/${callId}`);
      const ultravoxCall = response.data;

      // Update call in database if needed
      if (ultravoxCall.ended && !call.ended) {
        call.ended = ultravoxCall.ended;
        call.status = "ended";
        await call.save();
      }

      return { ...call.toObject() };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.data?.message || "Failed to get call",
          error.response?.status || 500
        );
      }
      throw error;
    }
  },

  async listCalls(userId: string) {
    try {
      // Get calls from database
      const calls = await Call.find({ userId }).sort({ createdAt: -1 });
      return calls;
    } catch (error) {
      throw new AppError("Failed to list calls", 500);
    }
  },

  async getCallMessages(callId: string) {
    const response = await ultravoxApi.get(`/calls/${callId}/messages`);
    return response.data;
  },

  async getCallRecording(callId: string) {
    try {
      const call = await Call.findOne({ callId });
      if (!call) {
        throw new AppError("Call not found", 404);
      }

      if (!call.recordingEnabled) {
        throw new AppError("Recording was not enabled for this call", 400);
      }

      const response = await ultravoxApi.get(`/calls/${callId}/recording`);

      // Update recording URL in database if available
      if (response.data.url && !call.recordingUrl) {
        call.recordingUrl = response.data.url;
        await call.save();
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.data?.message || "Failed to get recording",
          error.response?.status || 500
        );
      }
      throw error;
    }
  },

  async findOrCreateCall(callData: CreateCallParams, userId: string) {
    // First check if a call exists with the same parameters
    const existingCall = await Call.findOne({
      userId,
      systemPrompt: callData.systemPrompt,
      // Add other relevant parameters to match
    });

    if (existingCall) {
      return existingCall;
    }

    // If no existing call found, create a new one
    return this.createCall(callData, userId);
  },
};
