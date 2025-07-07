// Define the base interface for content state
export interface LiveActivityContentStateBase {
  type: string;
}

// Define the pre-game content state
export interface PreGameContentState extends LiveActivityContentStateBase {
  type: "preGame";
  startTimeMs: number;
  endTimeMs: number;
  title: string;
}

// Define the in-game content state (for future use)
export interface InGameContentState extends LiveActivityContentStateBase {
  type: "inGame";
  currentRoundStartTime: number;
  nextRoundStartTime: number;
  currentRound: number;
  totalRounds: number;
}

// Union type for all possible content states
export type LiveActivityContentState = PreGameContentState | InGameContentState;

// Request types for API endpoints
export interface LiveActivityStartRequest {
  token: string;
  payload: {
    startTimeMs: number;
    endTimeMs: number;
    title: string;
  };
  isSandbox?: boolean;
}

export interface LiveActivityUpdateRequest {
  token: string;
  payload: LiveActivityContentState;
  isSandbox?: boolean;
}

export interface LiveActivityEndRequest {
  token: string;
  isSandbox?: boolean;
}
