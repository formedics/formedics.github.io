/**
 * The three Baltic markets Formedics serves.
 * Shared by the 3D scene and the page legend, so colours always match.
 * Kept in its own module: it must stay importable from server-rendered code.
 */
export type Baltic = {
  name: string;
  code: string;
  /** 3D material / emissive colour */
  color: string;
  /** orbit radius in scene units */
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
};

export const BALTICS: Baltic[] = [
  { name: "Lithuania", code: "LT", color: "#22b8c4", radius: 2.05, tiltX: 0.42, tiltZ: -0.18, speed: 0.22 },
  { name: "Latvia", code: "LV", color: "#2f56c9", radius: 2.55, tiltX: -0.28, tiltZ: 0.32, speed: -0.16 },
  { name: "Estonia", code: "EE", color: "#5fd3c8", radius: 3.05, tiltX: 0.12, tiltZ: 0.55, speed: 0.12 },
];
