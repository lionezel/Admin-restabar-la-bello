export interface Variant {
  id: string;
  label: string;
  price: number;
  stock: number;
  image: string;
}

export interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  active: boolean;
  variants: Variant[];
}
