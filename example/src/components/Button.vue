<template>
  <button ref="element" type="button" :disabled="disabled" @click="emit('click', $event)">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { useTemplateRef, type ButtonHTMLAttributes } from "vue";

export interface ButtonProps {
  /**
   * The `type` attribute for the button. No **more** for this.
   *
   * @default "button"
   * @deprecated No longer support other options but "Button"
   */
  type?: ButtonHTMLAttributes["type"];

  /**
   * If the button should be disabled.
   *
   * @default undefined
   */
  disabled?: boolean;
}

defineProps<ButtonProps>();

/**
 * A random model value
 * for demonstration purposes.
 */
defineModel<boolean>({
  default: true,
});

const emit = defineEmits<{
  /**
   * The event triggered on click.
   */
  click: [event: MouseEvent];
}>();

defineSlots<{
  /**
   * The label for the button.
   */
  default: () => void;
}>();

const element = useTemplateRef("element");

defineExpose({
  forceClick() {
    element.value?.click();
  },
});
</script>

<docs lang="md">
A simple button useful for _clicks_ that do not navigate.
</docs>
