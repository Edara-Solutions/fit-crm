export type ShippingCity = {
  _id?: string;
  id?: string;
  name: string;
  shippingFee: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ShippingCityPayload = {
  name: string;
  shippingFee: number;
  isActive?: boolean;
};
