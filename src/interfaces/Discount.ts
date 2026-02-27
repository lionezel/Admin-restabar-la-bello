export interface Discount {
  id?: string;
  title: string;
  type: "percentage" | "fixed";
  value: number;
  priority: number;
  active: boolean;
  productIds: string[];
}
