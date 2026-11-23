import crmCatalog from "./crm-catalog.json" with { type: "json" };

// Local previews without an export have no published properties.
export const properties = crmCatalog ?? [];
