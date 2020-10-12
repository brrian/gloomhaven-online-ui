export interface PerksSchemas {
  [classType: string]: PerksSchema;
}

export type PerksSchema = PerksSet[];

export interface Perks {
  class: string;
  perks: {
    [id: string]: number;
  };
}

interface PerksSet {
  id: string;
  text: string;
  perks: {
    [perk: string]: number;
  };
  checks: number;
}
