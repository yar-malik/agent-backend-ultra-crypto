import twilio from "twilio";
import { config } from "../config";
import { AppError } from "../utils/AppError";
import axios from "axios";

// Create axios instance for Ultravox API
const ultravoxApi = axios.create({
  baseURL: config.ULTRAVOX_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": config.ULTRAVOX_API_KEY,
  },
});

const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

export interface PhoneCallParams {
  phoneNumber: string;
  systemPrompt?: string;
  voice?: string;
  temperature?: number;
  firstSpeaker?: string;
}

export const phoneCallService = {
  async initiateCall(params: PhoneCallParams) {
    try {
      // Validate configurations
      if (!config.ULTRAVOX_API_KEY) {
        throw new AppError("Ultravox API key is missing", 500);
      }
      if (
        !config.TWILIO_ACCOUNT_SID ||
        !config.TWILIO_AUTH_TOKEN ||
        !config.TWILIO_PHONE_NUMBER
      ) {
        throw new AppError("Twilio configuration is missing", 500);
      }

      // Log for debugging
      console.log("Using Ultravox API Key:", config.ULTRAVOX_API_KEY);
      console.log("Ultravox Base URL:", config.ULTRAVOX_BASE_URL);

      const ultravoxConfig = {
        systemPrompt:
          params.systemPrompt ||
          "Your name is Steve and you are calling a person on the phone. Ask them their name and see how they are doing.",
        model: "fixie-ai/ultravox",
        voice: params.voice || "Mark",
        temperature: params.temperature || 0.3,
        firstSpeaker: params.firstSpeaker || "FIRST_SPEAKER_USER",
        medium: { twilio: {} },
      };

      // Use ultravoxApi instance
      const response = await ultravoxApi.post("/calls", ultravoxConfig);

      if (!response.data || !response.data.joinUrl) {
        throw new AppError("Invalid response from Ultravox API", 500);
      }

      const joinUrl = response.data.joinUrl;
      console.log("Join URL:", joinUrl);
      // Format TwiML with WebSocket protocol for Ultravox streaming
      const twiml = `
                <Response>
                    <Connect>
                        <Stream url="${joinUrl}">
                            <Parameter name="ultravox-api-key" value="${config.ULTRAVOX_API_KEY}"/>
                        </Stream>
                    </Connect>
                </Response>
            `;

      const call = await client.calls.create({
        twiml: twiml,
        to: params.phoneNumber,
        from: config.TWILIO_PHONE_NUMBER,
      });

      return {
        callSid: call.sid,
        status: call.status,
        phoneNumber: params.phoneNumber,
        created: call.dateCreated,
        joinUrl,
        configuration: ultravoxConfig,
      };
    } catch (error) {
      console.error("Error initiating call:", error);
      throw new AppError(
        error instanceof Error ? error.message : "Failed to initiate call",
        500
      );
    }
  },
};
