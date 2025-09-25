// types/api.ts

// data types
export interface StartSystemResponse {
  camera_index: number;
}

export interface StopSystemResponse {
  camera_index: number;
}

export interface CameraStatus {
  camera_index: number;
  is_system_running: boolean;
  name_alias: string; 
}

export interface SystemConfigurations {
  camera_index: number;
  name_alias: string;
}
