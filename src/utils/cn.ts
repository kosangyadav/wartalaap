export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, any>;

/**
 * A lightweight utility for constructing className strings conditionally.
 * Combines multiple class values and filters out falsy values.
 *
 * @param classes - Array of class values (strings, objects, arrays, etc.)
 * @returns A single string with all valid class names joined by spaces
 *
 * @example
 * cn('btn', { 'btn-primary': isPrimary }, isDisabled && 'disabled')
 * cn('base-class', someCondition ? 'conditional-class' : '', 'always-present')
 */
export function cn(...classes: ClassValue[]): string {
  const classNames: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    const type = typeof cls;

    if (type === "string" || type === "number") {
      classNames.push(String(cls));
    } else if (type === "object") {
      if (Array.isArray(cls)) {
        // Recursively handle arrays
        const inner = cn(...cls);
        if (inner) {
          classNames.push(inner);
        }
      } else {
        // Handle objects where keys are class names and values are booleans
        for (const key in cls as Record<string, any>) {
          if ((cls as Record<string, any>)[key]) {
            classNames.push(key);
          }
        }
      }
    }
  }

  return classNames.join(" ");
}

/**
 * Creates a class name merger with default classes that are always included.
 * Useful for component libraries where you want base styles to always be applied.
 *
 * @param defaultClasses - Classes that should always be included
 * @returns A function that merges additional classes with the defaults
 *
 * @example
 * const buttonCn = createClassMerger('btn', 'font-medium');
 * const className = buttonCn('btn-primary', { 'btn-disabled': disabled });
 */
export function createClassMerger(...defaultClasses: ClassValue[]) {
  return (...additionalClasses: ClassValue[]): string => {
    return cn(...defaultClasses, ...additionalClasses);
  };
}

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Later classes override earlier ones for the same CSS property.
 *
 * Note: This is a basic implementation. For production use, consider
 * using libraries like 'tailwind-merge' for more sophisticated conflict resolution.
 *
 * @param classes - Array of class values
 * @returns Merged class string with conflicts resolved
 */
export function twMerge(...classes: ClassValue[]): string {
  const merged = cn(...classes);
  const classArray = merged.split(" ").filter(Boolean);

  // Simple deduplication - keeps the last occurrence of each class
  const uniqueClasses = new Map<string, string>();

  for (const className of classArray) {
    uniqueClasses.set(className, className);
  }

  return Array.from(uniqueClasses.values()).join(" ");
}

export default cn;
