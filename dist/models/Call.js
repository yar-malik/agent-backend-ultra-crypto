"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const callSchema = new mongoose_1.Schema(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    created: {
      type: String,
      required: true,
    },
    ended: {
      type: String,
      default: null,
    },
    model: {
      type: String,
      required: true,
    },
    systemPrompt: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    voice: {
      type: String,
      default: null,
    },
    languageHint: {
      type: String,
      default: null,
    },
    maxDuration: {
      type: String,
      required: true,
    },
    joinUrl: {
      type: String,
      required: true,
    },
    recordingEnabled: {
      type: Boolean,
      default: false,
    },
    recordingUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "active", "ended", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);
exports.Call = mongoose_1.default.model("Assistants", callSchema);
