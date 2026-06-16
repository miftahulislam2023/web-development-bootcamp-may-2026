export interface LiveKitTokenInput {
  roomKey: string;
  isHost: boolean;
  guestName?: string;
}

export interface LiveKitTokenResponse {
  token: string;
  identity: string;
  roomKey: string;
}
