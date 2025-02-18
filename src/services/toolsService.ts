import axios from "axios";
import { config } from "../config";
import { AppError } from "../utils/AppError";
import { Tool, ITool } from "../models/Tool";

const toolsApi = axios.create({
  baseURL: "https://api.ultravox.ai",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": config.ULTRAVOX_API_KEY,
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
    console.error("Request failed:", {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
    });
    return Promise.reject(error);
  }
);

interface ToolCreateParams {
  name: string;
  definition: {
    modelToolName: string;
    description: string;
    dynamicParameters?: Array<{
      name: string;
      location: string;
      schema: any;
      required: boolean;
    }>;
    staticParameters?: Array<{
      name: string;
      location: string;
      value: any;
    }>;
    automaticParameters?: Array<{
      name: string;
      location: string;
      knownValue: string;
    }>;
    requirements?: {
      httpSecurityOptions?: {
        options: Array<{
          requirements: any;
        }>;
      };
      requiredParameterOverrides?: string[];
    };
    timeout?: string;
    precomputable?: boolean;
    http?: {
      baseUrlPattern: string;
      httpMethod: string;
    };
    client?: any;
  };
}

export const toolsService = {
  async createTool(toolData: ToolCreateParams) {
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

      const tool = await Tool.create({
        name: response.data.name,
        definition: response.data.definition,
      });

      return tool;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Enhanced error logging
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: `${error.config?.baseURL}${error.config?.url}`,
            method: error.config?.method,
            headers: error.config?.headers,
            data: JSON.parse(error.config?.data || "{}"),
          },
        });

        throw new AppError(
          "Failed to create tool. Please try again.",
          error.response?.status || 500
        );
      }
      throw error;
    }
  },

  async getAllTools() {
    try {
      const response = await toolsApi.get("/api/tools");
      await Tool.deleteMany({}); // Clear existing tools

      // Map the API response structure exactly
      const tools = await Tool.insertMany(
        response.data.results.map((toolData: any) => ({
          toolId: toolData.toolId, // Add toolId
          name: toolData.name,
          created: toolData.created, // Add created timestamp
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
      if (axios.isAxiosError(error)) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
        });
        throw new AppError(
          error.response?.data?.message || "Failed to fetch tools",
          error.response?.status || 500
        );
      }
      throw error;
    }
  },

  async getTool(toolId: string) {
    try {
      // Find tool by toolId instead of _id
      const localTool = await Tool.findOne({ toolId });
      if (!localTool) {
        throw new AppError("Tool not found", 404);
      }

      // Get updated data from Ultravox API
      const response = await toolsApi.get(`/api/tools/${toolId}`);

      if (!response.data) {
        throw new AppError("Failed to fetch tool from API", 500);
      }

      // Update local database with latest data
      const updatedTool = await Tool.findOneAndUpdate(
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
        throw new AppError("Failed to update tool in database", 500);
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
      if (axios.isAxiosError(error)) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          toolId,
        });
        throw new AppError(
          error.response?.status === 404
            ? "Tool not found"
            : "Failed to fetch tool",
          error.response?.status || 500
        );
      }
      // Log unexpected errors
      console.error("Unexpected error:", error);
      throw error;
    }
  },

  async updateTool(toolId: string, toolData: any) {
    try {
      // Find tool by toolId
      const localTool = await Tool.findOne({ toolId });
      if (!localTool) {
        throw new AppError("Tool not found", 404);
      }

      // Update in Ultravox API
      const response = await toolsApi.put(`/api/tools/${toolId}`, {
        name: toolData.name,
        definition: {
          modelToolName:
            toolData.definition?.modelToolName ||
            localTool.definition.modelToolName,
          description:
            toolData.definition?.description ||
            localTool.definition.description,
          requirements: {
            httpSecurityOptions: {
              options: [{}],
            },
          },
          http: {
            baseUrlPattern:
              toolData.definition?.http?.baseUrlPattern ||
              localTool.definition.http.baseUrlPattern,
            httpMethod:
              toolData.definition?.http?.httpMethod ||
              localTool.definition.http.httpMethod,
          },
          timeout: toolData.definition?.timeout || localTool.definition.timeout,
        },
      });

      if (!response.data) {
        throw new AppError("Failed to update tool in API", 500);
      }

      // Update in local database
      const updatedTool = await Tool.findOneAndUpdate(
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
        throw new AppError("Failed to update tool in database", 500);
      }

      // Return formatted response
      return {
        toolId: updatedTool.toolId,
        name: updatedTool.name,
        created: updatedTool.created,
        definition: updatedTool.definition,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          toolId,
          requestData: toolData,
        });
        throw new AppError(
          error.response?.status === 404
            ? "Tool not found"
            : "Failed to update tool",
          error.response?.status || 500
        );
      }
      console.error("Unexpected error:", error);
      throw error;
    }
  },

  async deleteTool(toolId: string) {
    try {
      // Find tool by toolId first
      const tool = await Tool.findOne({ toolId });
      if (!tool) {
        throw new AppError("Tool not found", 404);
      }

      // Delete from Ultravox API
      await toolsApi.delete(`/api/tools/${toolId}`);

      // Delete from local database
      await Tool.findOneAndDelete({ toolId });

      return { message: "Tool deleted successfully" };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
        });
        throw new AppError(
          error.response?.status === 404
            ? "Tool not found"
            : "Failed to delete tool",
          error.response?.status || 500
        );
      }
      throw error;
    }
  },
};
