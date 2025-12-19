import type {
  EventMeta,
  PropertyMeta,
  ComponentMeta,
  SlotMeta,
  ExposeMeta,
} from 'vue-component-meta';

export const mapMeta = (meta: ComponentMeta, render: (input: string) => string) => {
  const nonGlobalProps = meta.props.filter((prop) => !prop.global);

  const hasAssociatedEvent = (prop: PropertyMeta) => {
    return meta.events.some((event) => event.name === `update:${prop.name}`);
  };

  const hasAssociatedProp = (event: EventMeta) => {
    return meta.props.some((prop) => `update:${prop.name}` === event.name);
  };

  const getDeprecated = (tags: PropertyMeta['tags']) => {
    const deprecated = getTag(tags, 'deprecated');

    return deprecated ? deprecated.text || true : false;
  };

  const getFilteredTags = (tags: PropertyMeta['tags']) => {
    const filteredTags = tags.filter((t) => !['default', 'deprecated'].includes(t.name));

    return filteredTags.map((tag) => ({
      name: tag.name,
      text: tag.text ? render(tag.text) : undefined,
    }));
  };

  const mapPropertyAndEvent = (prop: PropertyMeta | EventMeta) => ({
    name: prop.name,
    type: prop.type,

    description: render(prop.description),
    deprecated: getDeprecated(prop.tags),
    tags: getFilteredTags(prop.tags),
  });

  const mapSlotAndExposed = (m: SlotMeta | ExposeMeta) => ({
    name: m.name,
    type: m.type,

    description: render(m.description),
  });

  const mapProperty = (prop: PropertyMeta) => ({
    ...mapPropertyAndEvent(prop),

    default: prop.default || getTag(prop.tags, 'default')?.text,
    required: prop.required,
  });

  return {
    modelValues: nonGlobalProps
      .filter((prop) => hasAssociatedEvent(prop))
      .map((modelValue) => mapProperty(modelValue)),

    props: nonGlobalProps
      .filter((prop) => !hasAssociatedEvent(prop))
      .map((prop) => mapProperty(prop)),

    events: meta.events
      .filter((event) => !hasAssociatedProp(event))
      .map((event) => mapPropertyAndEvent(event)),

    slots: meta.slots.map((slot) => mapSlotAndExposed(slot)),
  };
};

const getTag = (tags: PropertyMeta['tags'], tag: string) => tags.find(({ name }) => name === tag);
