"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVoices =
  exports.deleteVoice =
  exports.getVoiceById =
  exports.updateVoice =
  exports.createVoice =
    void 0;
const Voice_1 = __importDefault(require("../models/Voice"));
// Create a new voice entry
const createVoice = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log("Incoming request body:", req.body);
    // Get data from either assistant object or direct body
    const data = req.body.assistant || req.body;
    // Validate required fields
    if (!data.name || !data.category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required fields",
      });
    }
    const voiceData = {
      calls: data.calls || 0,
      category: data.category,
      description: data.description || "",
      selectedModel: data.model,
      name: data.name,
      status: data.status || "Active",
      selectedVoice: data.voice,
      // Add template data if available
      template: data.template || null,
      // Add default values for required schema fields
      backchannelingEnabled: false,
      backgroundDenoisingEnabled: false,
      fillerInjectionEnabled: false,
      useSpeakerBoost: false,
    };
    // Log the constructed voiceData
    console.log("Voice data to be saved:", voiceData);
    const voice = new Voice_1.default(voiceData);
    const savedVoice = await voice.save();
    // Log the saved result
    console.log("Saved voice data:", savedVoice);
    return res.status(201).json({
      success: true,
      data: savedVoice,
    });
  } catch (error) {
    console.error("Error creating voice:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating voice entry",
      error: error.message,
    });
  }
};
exports.createVoice = createVoice;
// Update voice entry by ID
const updateVoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedVoice = await Voice_1.default.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedVoice) {
      return res.status(404).json({
        success: false,
        message: "Voice entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedVoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating voice entry",
      error: error.message,
    });
  }
};
exports.updateVoice = updateVoice;
// Get voice entry by ID
const getVoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const voice = await Voice_1.default.findById(id);
    if (!voice) {
      return res.status(404).json({
        success: false,
        message: "Voice entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: voice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching voice entry",
      error: error.message,
    });
  }
};
exports.getVoiceById = getVoiceById;
// Delete voice entry by ID
const deleteVoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVoice = await Voice_1.default.findByIdAndDelete(id);
    if (!deletedVoice) {
      return res.status(404).json({
        success: false,
        message: "Voice entry not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Voice entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting voice entry",
      error: error.message,
    });
  }
};
exports.deleteVoice = deleteVoice;
// Get all voice entries
const getAllVoices = async (req, res) => {
  try {
    const voices = await Voice_1.default.find({});
    return res.status(200).json({
      success: true,
      data: voices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching voice entries",
      error: error.message,
    });
  }
};
exports.getAllVoices = getAllVoices;
