/**
 * Enumerates the different kinds of wildcard selectors. Bitmask.
 */
export const enum WildcardSelectorType {
	ElementNodes = 1 << 0,
	Attributes = 1 << 1,
	All = ElementNodes | Attributes
}