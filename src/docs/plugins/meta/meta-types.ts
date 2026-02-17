import { PropertyMeta } from "vue-component-meta";

interface Property {
  /**
   * The name of the prop.
   */
  name: string;

  /**
   * The type expected for the prop.
   */
  type: string;

  /**
   * The HTML description.
   */
  description?: string;

  /**
   * If the prop has been marked with `@deprecated`.
   */
  deprecated: string | boolean;

  /**
   * JSDOC tags - filtered so that `@deprecated` and
   * `@default` are not included.
   */
  tags: PropertyMeta["tags"][number][];

  /**
   * The default.
   * If one can't be calculated - falls back to the `@default` tag.
   */
  default?: string;

  /**
   * If the prop is required.
   */
  required: boolean;
}

export interface Meta {
  /**
   * The HTML description for the component.
   */
  description?: string;

  /**
   * The props.
   */
  props: Property[];

  /**
   * The emits.
   */
  events: Omit<Property, "default" | "required">[];

  /**
   * The slots.
   */
  slots: Pick<Property, "name" | "type" | "description">[];

  /**
   * The exposed properties.
   */
  exposed: Pick<Property, "name" | "type" | "description">[];
}
