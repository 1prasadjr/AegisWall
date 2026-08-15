export type Uuid = string & { readonly __brand: "Uuid" };

export interface IdentityRef {
  identityId: Uuid;
}
