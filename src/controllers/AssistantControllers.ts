import { Request, Response } from 'express';
import Voice from '../models/Voice';

// Create a new voice entry
export const createVoice = async (req: Request, res: Response) => {
    try {
        // Log the incoming request body for debugging
        console.log('Incoming request body:', req.body);

        // Get data from either assistant object or direct body
        const data = req.body.assistant || req.body;

        // Validate required fields
        if (!data.name || !data.category) {
            return res.status(400).json({
                success: false,
                message: 'Name and category are required fields'
            });
        }

        const voiceData = {
            calls: data.calls || 0,
            category: data.category,
            description: data.description || '',
            selectedModel: data.model, // Changed from model to selectedModel to match schema
            name: data.name,
            status: data.status || 'Active',
            selectedVoice: data.voice,
            // Add template data if available
            template: data.template || null,
            // Add default values for required schema fields
            backchannelingEnabled: false,
            backgroundDenoisingEnabled: false,
            fillerInjectionEnabled: false,
            useSpeakerBoost: false
        };

        // Log the constructed voiceData
        console.log('Voice data to be saved:', voiceData);

        const voice = new Voice(voiceData);
        const savedVoice = await voice.save();

        // Log the saved result
        console.log('Saved voice data:', savedVoice);

        return res.status(201).json({
            success: true,
            data: savedVoice
        });
    } catch (error: any) {
        console.error('Error creating voice:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating voice entry',
            error: error.message
        });
    }
};

// Update voice entry by ID
export const updateVoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedVoice = await Voice.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedVoice) {
            return res.status(404).json({
                success: false,
                message: 'Voice entry not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedVoice
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error updating voice entry',
            error: error.message
        });
    }
};

// Get voice entry by ID
export const getVoiceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const voice = await Voice.findById(id);

        if (!voice) {
            return res.status(404).json({
                success: false,
                message: 'Voice entry not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: voice
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching voice entry',
            error: error.message
        });
    }
};

// Delete voice entry by ID
export const deleteVoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedVoice = await Voice.findByIdAndDelete(id);

        if (!deletedVoice) {
            return res.status(404).json({
                success: false,
                message: 'Voice entry not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Voice entry deleted successfully'
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting voice entry',
            error: error.message
        });
    }
};

// Get all voice entries
export const getAllVoices = async (req: Request, res: Response) => {
    try {
        const voices = await Voice.find({});

        return res.status(200).json({
            success: true,
            data: voices
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching voice entries',
            error: error.message
        });
    }
};
