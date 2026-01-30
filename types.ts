
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  isSubscription?: boolean;
  subscriptionFrequency?: string;
  finalPrice: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
