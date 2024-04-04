type SnType = {
  type_id: number;
  type_name: string;
};

type Filter = {
  filter_id: number;
  filter_name: string;
};

type Supernova = {
  sn_id: number;
  sn_name: string;
  redshift: number | null;
  distance_modulus: number | null;
  type_id: number | null;
};

type LightCurve = {
  curve_id: number;
  sn_id: number;
  filter_id: number;
  mjd: number;
  magnitude: number | null;
  magnitude_error: number | null;
  hash: string;
};

export type { SnType, Filter, Supernova, LightCurve };