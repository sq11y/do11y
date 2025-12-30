import { PropertyMeta } from 'vue-component-meta';

interface Property {
  name: string;
  type: string;

  description?: string;
  deprecated: string | boolean;
  tags: PropertyMeta['tags'][number][];

  default?: string;
  required: boolean;
}

interface SlotOrExposed {
  name: string;
  type: string;

  description?: string;
}

export interface Meta {
  modelValues: Property[];
  props: Property[];

  events: Omit<Property, 'default' | 'required'>[];

  slots: SlotOrExposed[];
}
