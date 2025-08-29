export interface LocationDTO {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface EventDTO {
  id: number;
  name: string;
  description: string;
  participants: number;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  location: LocationDTO;
  eventTypeName: string;
  activities: any[];
}
