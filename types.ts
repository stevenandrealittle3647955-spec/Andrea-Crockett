
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface Psychic {
  id: string;
  name: string;
  specialty: string; // Formerly genre
  image: string;
  availability: string; // Formerly day
  description: string;
  deepDivePrice: number; // Individual price for deep dive
  tarotSpreads?: { name: string; price: number }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
  email: string;
  phone?: string;
  password?: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  name?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: number;
}

export interface Booking {
  id: string;
  serviceName: string;
  guideId: string;
  guideName: string;
  price: number;
  status: 'pending' | 'aligning' | 'complete';
  purchaseDate: number;
  completionDate?: number;
  messages: Message[];
}

export enum Section {
  HERO = 'hero',
  PSYCHICS = 'psychics',
  WISDOM = 'wisdom',
  BOOKING = 'booking',
}
