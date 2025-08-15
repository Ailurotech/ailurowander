import { ObjectId } from 'mongodb';

export interface Tour {
  _id?: ObjectId;
  title: string;
  description: string;
  longDescription?: string;
  isActive: boolean;
  images: {
    main: string;
    gallery?: string[];
  };
  duration: {
    days: number;
    nights: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  destination: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    accommodation?: {
      name: string;
      description?: string;
      images?: string[];
    };
    meals?: {
      name: string;
      description?: string;
      images?: string[];
    }[];
    image?: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  featured: boolean;
  reviews?: {
    author: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TourSummary {
  _id?: ObjectId;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  destination: string;
  featured: boolean;
  isActive: boolean;
}

export interface TourFormData {
  _id?: string;
  title: string;
  description: string;
  duration: {
    days: number;
    nights: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  destination: string;
  maxGroupSize: number;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    accommodation?: {
      name: string;
      description?: string;
      images?: string[];
    };
    meals?: {
      name: string;
      description?: string;
      images?: string[];
    }[];
    image?: string;
  }[];
  images: {
    main: string;
    gallery: string[];
  };
  featured: boolean;
  discount: number;
  tags: string[];
}
