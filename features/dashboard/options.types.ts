

export interface FiltersResponse {
  currencies: Currencies[];
  customerIdentifiers: CustomerIdentifiers[];
  externalParticipants: ExternalParticipants[];
  externalParticipantAcronyms: ExternalParticipantAcronyms[];
  periods: Periods[];
  transactions: Transactions[];
  paymentChannels: PaymentChannels[];
}

export interface Currencies {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata;
}

export interface Metadata {}

export interface CustomerIdentifiers {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata2;
}

export interface Metadata2 {}

export interface ExternalParticipants {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata3;
}

export interface Metadata3 {}

export interface ExternalParticipantAcronyms {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata4;
}

export interface Metadata4 {}

export interface Periods {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata5;
}

export interface Metadata5 {}

export interface Transactions {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata6;
}

export interface Metadata6 {}

export interface PaymentChannels {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Metadata7;
}

export interface Metadata7 {}
