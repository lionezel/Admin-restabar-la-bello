export type DeliverySettings = {
  id?: string;
  deliveryPrice: number;
  active: boolean;
};

export type DeliveryUser = {
  id?: string;
  name: string;
  phone: string;
  active: boolean;
  avatar?: string;
};
