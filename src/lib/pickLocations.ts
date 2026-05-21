/** Dark-store pick path: aisle + bin per SKU */
export interface PickLocation {
  aisle: string;
  bin: string;
  sequence: number;
}

const LOCATIONS: Record<string, PickLocation> = {
  "pvc-4-elbow": { aisle: "A", bin: "12", sequence: 10 },
  "pvc-4-coupling": { aisle: "A", bin: "12", sequence: 11 },
  "pvc-4-tee": { aisle: "A", bin: "14", sequence: 12 },
  "pvc-4-union": { aisle: "A", bin: "15", sequence: 13 },
  "pvc-4-reducer": { aisle: "A", bin: "16", sequence: 14 },
  "pvc-pipe-4": { aisle: "A", bin: "01", sequence: 1 },
  "pvc-pipe-4-6m": { aisle: "A", bin: "02", sequence: 2 },
  "pvc-solvent": { aisle: "B", bin: "03", sequence: 20 },
  "pvc-primer": { aisle: "B", bin: "04", sequence: 21 },
  "pvc-2-elbow": { aisle: "A", bin: "20", sequence: 15 },
  "pvc-2-pipe": { aisle: "A", bin: "21", sequence: 3 },
  "pvc-3-elbow": { aisle: "A", bin: "22", sequence: 16 },
  "cpvc-elbow": { aisle: "C", bin: "08", sequence: 30 },
  "cpvc-tee": { aisle: "C", bin: "09", sequence: 31 },
  "cpvc-pipe-1": { aisle: "C", bin: "01", sequence: 28 },
  "cpvc-solvent": { aisle: "B", bin: "08", sequence: 22 },
  "upvc-elbow-1": { aisle: "C", bin: "10", sequence: 32 },
  "upvc-pipe-1": { aisle: "C", bin: "02", sequence: 29 },
  "ball-valve": { aisle: "D", bin: "04", sequence: 40 },
  "ball-valve-15": { aisle: "D", bin: "05", sequence: 41 },
  "gate-valve-1": { aisle: "D", bin: "06", sequence: 42 },
  "nrv-1": { aisle: "D", bin: "07", sequence: 43 },
  "trap-jali": { aisle: "E", bin: "02", sequence: 50 },
  "bottle-trap": { aisle: "E", bin: "03", sequence: 51 },
  "sink-waste": { aisle: "E", bin: "04", sequence: 52 },
  "health-faucet": { aisle: "E", bin: "08", sequence: 56 },
  "angle-cock": { aisle: "E", bin: "10", sequence: 58 },
  "pillar-cock": { aisle: "E", bin: "11", sequence: 59 },
  "shower-arm": { aisle: "E", bin: "12", sequence: 60 },
  "diverter": { aisle: "E", bin: "15", sequence: 63 },
  "flush-valve": { aisle: "E", bin: "18", sequence: 65 },
  "wc-connector": { aisle: "E", bin: "19", sequence: 66 },
  "teflon-tape": { aisle: "F", bin: "01", sequence: 70 },
  "washer-set": { aisle: "F", bin: "02", sequence: 71 },
  "silicone": { aisle: "B", bin: "10", sequence: 23 },
  "epoxy-putty": { aisle: "F", bin: "05", sequence: 74 },
  "thread-seal": { aisle: "F", bin: "06", sequence: 75 },
  "gi-nipple-1": { aisle: "D", bin: "12", sequence: 44 },
  "gi-elbow-1": { aisle: "D", bin: "13", sequence: 45 },
  "flex-hose-24": { aisle: "G", bin: "02", sequence: 80 },
  "flex-hose-18": { aisle: "G", bin: "03", sequence: 81 },
  "hose-pipe-30m": { aisle: "G", bin: "08", sequence: 85 },
  "tape-measure": { aisle: "H", bin: "01", sequence: 90 },
  "pipe-wrench": { aisle: "H", bin: "04", sequence: 93 },
  "basin-wrench": { aisle: "H", bin: "05", sequence: 94 },
  "hacksaw": { aisle: "H", bin: "06", sequence: 95 },
  "plunger": { aisle: "H", bin: "08", sequence: 97 },
};

export function getPickLocation(productId: string): PickLocation {
  return LOCATIONS[productId] ?? { aisle: "Z", bin: "99", sequence: 999 };
}

export function sortItemsForPick<T extends { productId: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => getPickLocation(a.productId).sequence - getPickLocation(b.productId).sequence
  );
}
