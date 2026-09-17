export type Review = {
  name: string;
  text: string;
  score: number;
};

export type Spec = {
  key: string;
  value: string;
};

export type Product = {
  id: string;
  title: string;
  code: string;
  tag: string;
  borderColor: string;
  live: boolean;
  offer: boolean;
  priceInToman?: number;
  priceInEuro?: number;
  oldPriceInEuro?: number;
  mountExist: number;
  pictureLink: string;
  description: string;
  background: string;
  reviews: Review[];
  badges?: string[];
  specs?: Spec[];
};

export type Category = {
  name: string;
  slug: string;
  color: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type EuroData = {
  currentRate: number;
  previousRate: number;
};

