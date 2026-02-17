import type {
  EventMeta,
  PropertyMeta,
  ComponentMeta,
  SlotMeta,
  ExposeMeta,
} from "vue-component-meta";

import type { Meta } from "./meta-types";

export const mapMeta = (meta: ComponentMeta, render: (input: string) => string): Meta => {
  const nonGlobalProps = meta.props.filter((prop) => !prop.global);

  const getDeprecated = (tags: PropertyMeta["tags"]) => {
    const deprecated = getTag(tags, "deprecated");
    return deprecated ? deprecated.text || true : false;
  };

  const getFilteredTags = (tags: PropertyMeta["tags"]) => {
    const filteredTags = tags.filter((t) => !["default", "deprecated"].includes(t.name));

    return filteredTags.map((tag) => ({
      name: tag.name,
      text: tag.text ? render(tag.text) : undefined,
    }));
  };

  const mapEvent = (prop: PropertyMeta | EventMeta): Meta["events"][number] => ({
    name: prop.name,
    type: prop.type,

    description: prop.description ? render(prop.description) : undefined,
    deprecated: getDeprecated(prop.tags),
    tags: getFilteredTags(prop.tags),
  });

  const mapSlotAndExposed = (se: SlotMeta | ExposeMeta): Meta["slots"][number] => ({
    name: se.name,
    type: se.type,

    description: se.description ? render(se.description) : undefined,
  });

  const mapProperty = (prop: PropertyMeta): Meta["props"][number] => ({
    ...mapEvent(prop),

    default: prop.default || getTag(prop.tags, "default")?.text,
    required: prop.required,
  });

  return {
    description: meta.description ? render(meta.description) : "",
    props: nonGlobalProps.map((prop) => mapProperty(prop)),
    events: meta.events.map((event) => mapEvent(event)),
    slots: meta.slots.map((slot) => mapSlotAndExposed(slot)),
    exposed: meta.exposed.map((exposed) => mapSlotAndExposed(exposed)),
  };
};

const getTag = (tags: PropertyMeta["tags"], tag: string) => tags.find(({ name }) => name === tag);
