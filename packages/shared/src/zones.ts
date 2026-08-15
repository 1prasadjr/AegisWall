export type TrustZone = "TB-2" | "TB-3" | "TB-4";

export type Tagged<T, Z extends TrustZone> = T & { readonly __zone: Z };
