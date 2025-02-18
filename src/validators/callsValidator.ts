import Joi from "joi";
import {
  FirstSpeaker,
  MessageMedium,
  EndBehavior,
  MessageRole,
} from "../types/call";

export const createCallValidator = Joi.object({
  systemPrompt: Joi.string().required(),
  temperature: Joi.number().min(0).max(1).default(0.0),
  callId: Joi.string().allow(null),
  voice: Joi.string().allow(null),
  languageHint: Joi.string().allow(null),
  maxDuration: Joi.string().pattern(/^\d+(\.\d+)?s$/),
  timeExceededMessage: Joi.string(),
  recordingEnabled: Joi.boolean().default(false),
  firstSpeaker: Joi.string().valid(...Object.values(FirstSpeaker)),
  initialOutputMedium: Joi.string().valid(...Object.values(MessageMedium)),
  joinTimeout: Joi.string().pattern(/^\d+s$/),
  transcriptOptional: Joi.boolean().default(true),
  model: Joi.string(),
  priorCallId: Joi.string(),
  assistantId: Joi.object(),
  initialMessages: Joi.array().items(
    Joi.object({
      role: Joi.string()
        .valid(...Object.values(MessageRole))
        .required(),
      text: Joi.string().required(),
    })
  ),
  inactivityMessages: Joi.array().items(
    Joi.object({
      duration: Joi.string()
        .pattern(/^\d+(\.\d+)?s$/)
        .required(),
      message: Joi.string().required(),
      endBehavior: Joi.string()
        .valid(...Object.values(EndBehavior))
        .default(EndBehavior.END_BEHAVIOR_UNSPECIFIED),
    })
  ),
});
