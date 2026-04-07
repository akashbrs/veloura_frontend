export interface User {
  _id: string;
  username: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  sizePreferences?: {
    men: {
      tshirt?: string;
      shirt?: string;
      jeans?: string;
      shoes?: string;
    };
    women: {
      top?: string;
      dress?: string;
      waist?: string;
      footwear?: string;
    };
  };
  role: 'user' | 'admin';
  token?: string;
  access_token?: string;
  createdAt?: string;
}

export interface Product {
  _id: string
  name: string
  description: string

  category: "Men" | "Women" | "Kids"
  subcategory?: string

  price: number
  originalPrice?: number
  discountPercentage?: number

  rating: number
  reviews?: number
  numReviews?: number

  badge?: string
  brand?: string

  stock: number
  images: string[]

  isOnSale?: boolean
  isActive?: boolean

  styleTags?: string[]
  season?: string
  isBestseller?: boolean
  isNewDrop?: boolean
  id?: string // Allow string ID for local data
}

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  quantity: number;
  qty?: number;
  size?: string;
  color?: string;
}

export interface Address {
  _id: string;
  user?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  label?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistItem {
  _id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  category: string;
}

export interface Order {
  _id: string

  user?: User | string
  orderItems: CartItem[]

  totalPrice: number
  totalAmount?: number

  itemsPrice?: number
  shippingPrice?: number
  taxPrice?: number

  paymentStatus?: string
  deliveryStatus?: string

  trackingId?: string
  cancellationReason?: string
  status?: string
  paymentMethod?: string

  shippingAddress?: {
    name?: string
    addressLine1?: string
    city?: string
    state?: string
    postalCode?: string
    phone?: string
  }

  createdAt: string
  deliveredAt?: string
}

