"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const AppError_1 = require("../utils/AppError");
const Tool_1 = require("../models/Tool");
const toolsApi = axios_1.default.create({
  baseURL: "https://api.ultravox.ai",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": config_1.config.ULTRAVOX_API_KEY,
    Accept: "application/json",
  },
  timeout: 30000,
  validateStatus: (status) => status < 500,
});
toolsApi.interceptors.request.use((request) => {
  console.log("Starting Request:", {
    url: request.url,
    method: request.method,
    headers: request.headers,
  });
  return request;
});
toolsApi.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    var _a, _b, _c, _d;
    console.error("Request failed:", {
      message: error.message,
      code: error.code,
      config: {
        url: (_a = error.config) === null || _a === void 0 ? void 0 : _a.url,
        method:
          (_b = error.config) === null || _b === void 0 ? void 0 : _b.method,
        baseURL:
          (_c = error.config) === null || _c === void 0 ? void 0 : _c.baseURL,
        headers:
          (_d = error.config) === null || _d === void 0 ? void 0 : _d.headers,
      },
    });
    return Promise.reject(error);
  }
);
exports.toolsService = {
  async createTool(toolData) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
      const formattedName = toolData.name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "");
      // Match the exact structure from the GET response
      const payload = {
        name: formattedName,
        definition: {
          description: toolData.definition.description,
          requirements: {
            httpSecurityOptions: {
              options: [
                {}, // Empty object as seen in GET response
              ],
            },
          },
          http: {
            baseUrlPattern: "https://api.example.com",
            httpMethod: "GET",
          },
          modelToolName: toolData.definition.modelToolName,
          timeout: "20s",
        },
      };
      console.log(
        "Sending exact matching payload:",
        JSON.stringify(payload, null, 2)
      );
      const response = await toolsApi.post("/api/tools", payload);
      console.log("Success Response:", response.data);
      const tool = await Tool_1.Tool.create({
        name: response.data.name,
        definition: response.data.definition,
      });
      return tool;
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        // Enhanced error logging
        console.error("API Error:", {
          status:
            (_a = error.response) === null || _a === void 0
              ? void 0
              : _a.status,
          data:
            (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
          config: {
            url: `${
              (_c = error.config) === null || _c === void 0
                ? void 0
                : _c.baseURL
            }${
              (_d = error.config) === null || _d === void 0 ? void 0 : _d.url
            }`,
            method:
              (_e = error.config) === null || _e === void 0
                ? void 0
                : _e.method,
            headers:
              (_f = error.config) === null || _f === void 0
                ? void 0
                : _f.headers,
            data: JSON.parse(
              ((_g = error.config) === null || _g === void 0
                ? void 0
                : _g.data) || "{}"
            ),
          },
        });
        throw new AppError_1.AppError(
          "Failed to create tool. Please try again.",
          ((_h = error.response) === null || _h === void 0
            ? void 0
            : _h.status) || 500
        );
      }
      throw error;
    }
  },
  async getAllTools() {
    var _a, _b, _c, _d, _e;
    try {
      const response = await toolsApi.get("/api/tools");
      await Tool_1.Tool.deleteMany({}); // Clear existing tools
      // Map the API response structure exactly
      const tools = await Tool_1.Tool.insertMany(
        response.data.results.map((toolData) => ({
          toolId: toolData.toolId,
          name: toolData.name,
          created: toolData.created,
          definition: {
            description: toolData.definition.description,
            requirements: toolData.definition.requirements || {
              httpSecurityOptions: {
                options: [{}],
              },
            },
            http: {
              baseUrlPattern: toolData.definition.http.baseUrlPattern,
              httpMethod: toolData.definition.http.httpMethod,
            },
            modelToolName: toolData.definition.modelToolName,
            timeout: toolData.definition.timeout,
            precomputable: toolData.definition.precomputable || false,
          },
        }))
      );
      // Return the exact structure as the API
      return {
        next: response.data.next,
        previous: response.data.previous,
        total: response.data.total,
        results: tools.map((tool) => ({
          toolId: tool.toolId,
          name: tool.name,
          created: tool.created,
          definition: {
            description: tool.definition.description,
            requirements: tool.definition.requirements,
            http: tool.definition.http,
            modelToolName: tool.definition.modelToolName,
            timeout: tool.definition.timeout,
            precomputable: tool.definition.precomputable,
          },
        })),
      };
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        console.error("API Error:", {
          status:
            (_a = error.response) === null || _a === void 0
              ? void 0
              : _a.status,
          data:
            (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
        });
        throw new AppError_1.AppError(
          ((_d =
            (_c = error.response) === null || _c === void 0
              ? void 0
              : _c.data) === null || _d === void 0
            ? void 0
            : _d.message) || "Failed to fetch tools",
          ((_e = error.response) === null || _e === void 0
            ? void 0
            : _e.status) || 500
        );
      }
      throw error;
    }
  },
  async getTool(toolId) {
    var _a, _b, _c, _d;
    try {
      // Find tool by toolId instead of _id
      const localTool = await Tool_1.Tool.findOne({ toolId });
      if (!localTool) {
        throw new AppError_1.AppError("Tool not found", 404);
      }
      // Get updated data from Ultravox API
      const response = await toolsApi.get(`/api/tools/${toolId}`);
      if (!response.data) {
        throw new AppError_1.AppError("Failed to fetch tool from API", 500);
      }
      // Update local database with latest data
      const updatedTool = await Tool_1.Tool.findOneAndUpdate(
        { toolId },
        {
          toolId: response.data.toolId,
          name: response.data.name,
          created: response.data.created,
          definition: {
            description: response.data.definition.description,
            requirements: response.data.definition.requirements || {
              httpSecurityOptions: {
                options: [{}],
              },
            },
            http: {
              baseUrlPattern: response.data.definition.http.baseUrlPattern,
              httpMethod: response.data.definition.http.httpMethod,
            },
            modelToolName: response.data.definition.modelToolName,
            timeout: response.data.definition.timeout,
            precomputable: response.data.definition.precomputable,
          },
        },
        { new: true, runValidators: true }
      );
      if (!updatedTool) {
        throw new AppError_1.AppError("Failed to update tool in database", 500);
      }
      // Return formatted response
      return {
        toolId: updatedTool.toolId,
        name: updatedTool.name,
        created: updatedTool.created,
        definition: {
          description: updatedTool.definition.description,
          requirements: updatedTool.definition.requirements,
          http: updatedTool.definition.http,
          modelToolName: updatedTool.definition.modelToolName,
          timeout: updatedTool.definition.timeout,
          precomputable: updatedTool.definition.precomputable,
        },
      };
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        console.error("API Error:", {
          status:
            (_a = error.response) === null || _a === void 0
              ? void 0
              : _a.status,
          data:
            (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
          toolId,
        });
        throw new AppError_1.AppError(
          ((_c = error.response) === null || _c === void 0
            ? void 0
            : _c.status) === 404
            ? "Tool not found"
            : "Failed to fetch tool",
          ((_d = error.response) === null || _d === void 0
            ? void 0
            : _d.status) || 500
        );
      }
      // Log unexpected errors
      console.error("Unexpected error:", error);
      throw error;
    }
  },
  async updateTool(toolId, toolData) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
      // Find tool by toolId
      const localTool = await Tool_1.Tool.findOne({ toolId });
      if (!localTool) {
        throw new AppError_1.AppError("Tool not found", 404);
      }
      // Update in Ultravox API
      const response = await toolsApi.put(`/api/tools/${toolId}`, {
        name: toolData.name,
        definition: {
          modelToolName:
            ((_a = toolData.definition) === null || _a === void 0
              ? void 0
              : _a.modelToolName) || localTool.definition.modelToolName,
          description:
            ((_b = toolData.definition) === null || _b === void 0
              ? void 0
              : _b.description) || localTool.definition.description,
          requirements: {
            httpSecurityOptions: {
              options: [{}],
            },
          },
          http: {
            baseUrlPattern:
              ((_d =
                (_c = toolData.definition) === null || _c === void 0
                  ? void 0
                  : _c.http) === null || _d === void 0
                ? void 0
                : _d.baseUrlPattern) ||
              localTool.definition.http.baseUrlPattern,
            httpMethod:
              ((_f =
                (_e = toolData.definition) === null || _e === void 0
                  ? void 0
                  : _e.http) === null || _f === void 0
                ? void 0
                : _f.httpMethod) || localTool.definition.http.httpMethod,
          },
          timeout:
            ((_g = toolData.definition) === null || _g === void 0
              ? void 0
              : _g.timeout) || localTool.definition.timeout,
        },
      });
      if (!response.data) {
        throw new AppError_1.AppError("Failed to update tool in API", 500);
      }
      // Update in local database
      const updatedTool = await Tool_1.Tool.findOneAndUpdate(
        { toolId },
        {
          toolId: response.data.toolId,
          name: response.data.name,
          created: response.data.created,
          definition: {
            description: response.data.definition.description,
            requirements: response.data.definition.requirements,
            http: {
              baseUrlPattern: response.data.definition.http.baseUrlPattern,
              httpMethod: response.data.definition.http.httpMethod,
            },
            modelToolName: response.data.definition.modelToolName,
            timeout: response.data.definition.timeout,
            precomputable: response.data.definition.precomputable,
          },
        },
        { new: true, runValidators: true }
      );
      if (!updatedTool) {
        throw new AppError_1.AppError("Failed to update tool in database", 500);
      }
      // Return formatted response
      return {
        toolId: updatedTool.toolId,
        name: updatedTool.name,
        created: updatedTool.created,
        definition: updatedTool.definition,
      };
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        console.error("API Error:", {
          status:
            (_h = error.response) === null || _h === void 0
              ? void 0
              : _h.status,
          data:
            (_j = error.response) === null || _j === void 0 ? void 0 : _j.data,
          toolId,
          requestData: toolData,
        });
        throw new AppError_1.AppError(
          ((_k = error.response) === null || _k === void 0
            ? void 0
            : _k.status) === 404
            ? "Tool not found"
            : "Failed to update tool",
          ((_l = error.response) === null || _l === void 0
            ? void 0
            : _l.status) || 500
        );
      }
      console.error("Unexpected error:", error);
      throw error;
    }
  },
  async deleteTool(toolId) {
    var _a, _b, _c, _d;
    try {
      // Find tool by toolId first
      const tool = await Tool_1.Tool.findOne({ toolId });
      if (!tool) {
        throw new AppError_1.AppError("Tool not found", 404);
      }
      // Delete from Ultravox API
      await toolsApi.delete(`/api/tools/${toolId}`);
      // Delete from local database
      await Tool_1.Tool.findOneAndDelete({ toolId });
      return { message: "Tool deleted successfully" };
    } catch (error) {
      if (axios_1.default.isAxiosError(error)) {
        console.error("API Error:", {
          status:
            (_a = error.response) === null || _a === void 0
              ? void 0
              : _a.status,
          data:
            (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
        });
        throw new AppError_1.AppError(
          ((_c = error.response) === null || _c === void 0
            ? void 0
            : _c.status) === 404
            ? "Tool not found"
            : "Failed to delete tool",
          ((_d = error.response) === null || _d === void 0
            ? void 0
            : _d.status) || 500
        );
      }
      throw error;
    }
  },
};
