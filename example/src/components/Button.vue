<template>
  <button ref="element" type="button" :disabled="disabled" @click="emit('click', $event)">
    <slot />
  </button>
</template>

<script lang="ts" setup>
  import type { ButtonHTMLAttributes } from 'vue';

  export interface ButtonProps {
    /**
     * The `type` attribute for the button.
     *
     * @default "button"
     * @deprecated No longer support other options but "Button"
     */
    type?: ButtonHTMLAttributes['type'];

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
    default: any;
  }>();
</script>

<style scoped>
  button {
    cursor: pointer;

    inline-size: fit-content;
    padding: 0.75em 1.25em;

    border-radius: 4px;
    border: 1px solid transparent;

    font-size: 1rem;
  }
</style>

<docs lang="md">
A description for _this_ component.
</docs>
