export type Uuid = string & { readonly __brand: "Uuid" };

export type IdentityRef = { identityId: Uuid };
