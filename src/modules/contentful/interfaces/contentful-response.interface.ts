export interface IContentfulSys {
  type: string;
  id?: string;
  linkType?: string;
}

export interface IContentfulLink {
  sys: IContentfulSys;
}

export interface IContentfulMetadata {
  tags: string[];
  concepts: string[];
}

export interface IContentfulEntrySys {
  space: IContentfulLink;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: IContentfulLink;
  publishedVersion: number;
  revision: number;
  contentType: IContentfulLink;
  locale: string;
}

export interface IProductFields {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

export interface IContentfulProductEntry {
  metadata: IContentfulMetadata;
  sys: IContentfulEntrySys;
  fields: IProductFields;
}

export interface IContentfulResponse<T = IContentfulProductEntry> {
  sys: IContentfulSys;
  total: number;
  skip: number;
  limit: number;
  items: T[];
}

export type ContentfulProductsResponse = IContentfulResponse<IContentfulProductEntry>;
