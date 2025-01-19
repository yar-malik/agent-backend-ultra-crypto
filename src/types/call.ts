export enum FirstSpeaker {
    FIRST_SPEAKER_USER = 'FIRST_SPEAKER_USER',
    FIRST_SPEAKER_AGENT = 'FIRST_SPEAKER_AGENT'
}

export enum MessageRole {
    MESSAGE_ROLE_USER = 'MESSAGE_ROLE_USER',
    MESSAGE_ROLE_AGENT = 'MESSAGE_ROLE_AGENT'
}

export enum MessageMedium {
    MESSAGE_MEDIUM_VOICE = 'MESSAGE_MEDIUM_VOICE',
    MESSAGE_MEDIUM_TEXT = 'MESSAGE_MEDIUM_TEXT'
}

export enum EndBehavior {
    END_BEHAVIOR_UNSPECIFIED = 'END_BEHAVIOR_UNSPECIFIED',
    END_BEHAVIOR_HANG_UP_SOFT = 'END_BEHAVIOR_HANG_UP_SOFT',
    END_BEHAVIOR_HANG_UP_STRICT = 'END_BEHAVIOR_HANG_UP_STRICT'
}

export interface InactivityMessage {
    duration: string;
    message: string;
    endBehavior?: EndBehavior;
}

export interface Message {
    role: MessageRole;
    text: string;
}

export interface Call {
    callId: string;
    created: string;
    ended: string | null;
    model: string;
    systemPrompt: string;
    temperature: number;
    voice: string | null;
    languageHint: string | null;
    maxDuration: string;
    timeExceededMessage?: string;
    joinUrl: string;
    recordingEnabled: boolean;
    firstSpeaker?: FirstSpeaker;
    initialOutputMedium?: MessageMedium;
    joinTimeout?: string;
    transcriptOptional?: boolean;
    inactivityMessages?: InactivityMessage[];
    initialMessages?: Message[];
    stages?: CallStage[];
}

export interface CallStage {
    stageId: string;
    callId: string;
    created: string;
    ended: string | null;
    systemPrompt: string;
    tools?: any[];
    messages?: Message[];
} 