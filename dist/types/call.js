"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndBehavior = exports.MessageMedium = exports.MessageRole = exports.FirstSpeaker = void 0;
var FirstSpeaker;
(function (FirstSpeaker) {
    FirstSpeaker["FIRST_SPEAKER_USER"] = "FIRST_SPEAKER_USER";
    FirstSpeaker["FIRST_SPEAKER_AGENT"] = "FIRST_SPEAKER_AGENT";
})(FirstSpeaker = exports.FirstSpeaker || (exports.FirstSpeaker = {}));
var MessageRole;
(function (MessageRole) {
    MessageRole["MESSAGE_ROLE_USER"] = "MESSAGE_ROLE_USER";
    MessageRole["MESSAGE_ROLE_AGENT"] = "MESSAGE_ROLE_AGENT";
})(MessageRole = exports.MessageRole || (exports.MessageRole = {}));
var MessageMedium;
(function (MessageMedium) {
    MessageMedium["MESSAGE_MEDIUM_VOICE"] = "MESSAGE_MEDIUM_VOICE";
    MessageMedium["MESSAGE_MEDIUM_TEXT"] = "MESSAGE_MEDIUM_TEXT";
})(MessageMedium = exports.MessageMedium || (exports.MessageMedium = {}));
var EndBehavior;
(function (EndBehavior) {
    EndBehavior["END_BEHAVIOR_UNSPECIFIED"] = "END_BEHAVIOR_UNSPECIFIED";
    EndBehavior["END_BEHAVIOR_HANG_UP_SOFT"] = "END_BEHAVIOR_HANG_UP_SOFT";
    EndBehavior["END_BEHAVIOR_HANG_UP_STRICT"] = "END_BEHAVIOR_HANG_UP_STRICT";
})(EndBehavior = exports.EndBehavior || (exports.EndBehavior = {}));
