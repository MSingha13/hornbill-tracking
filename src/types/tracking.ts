export interface TrackingRecord {
  recordedAt: string;
  assetId: string;
  positionId?: string;
  latitude: string | number;
  longitude: string | number;
  displayTime?: string;
  receivedTime?: string;
  utcTime?: string;
  localTime?: string;
  battery: string | number;
  temperature: string | number;
  speed?: string | number;
  altitude?: string | number;
  address?: string;
}

export interface TrackingApiResponse {
  success: boolean;
  latest: TrackingRecord;
  records: TrackingRecord[];
  message?: string;
}

export interface MapLayerConfig {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}
