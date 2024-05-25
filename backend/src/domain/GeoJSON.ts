export interface GeoJSON {
  type: string;
  bbox: Array<number>;
  features: Array<Feature>;
  metadata: Record<string, unknown>;
}

interface Feature {
  type: string;
  bbox: Array<number>;
  properties: Record<string, unknown>;
  geometry: Geometry;
}

interface Geometry {
  coordinates: Array<Array<number>>;
  type: string;
}
