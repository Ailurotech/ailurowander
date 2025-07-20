<script lang="ts">
  // Button variants and props
  export let variant: 'primary' | 'secondary' | 'accent' | 'outline' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let href: string | null = null;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  export let icon: string | null = null;
  export let iconPosition: 'left' | 'right' = 'left';
  export let ariaLabel: string | null = null;

  // Dynamic class construction
  const getClasses = () => {
    const baseClasses = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass =
      size === 'sm' ? 'text-sm px-4 py-2' : size === 'lg' ? 'text-lg px-8 py-4' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${disabledClass}`;
  };
</script>

{#if href}
  <a
    {href}
    class={getClasses()}
    aria-label={ariaLabel}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : 0}
  >
    {#if icon && iconPosition === 'left'}
      <span class="mr-2">{@html icon}</span>
    {/if}
    <slot></slot>
    {#if icon && iconPosition === 'right'}
      <span class="ml-2">{@html icon}</span>
    {/if}
  </a>
{:else}
  <button {type} {disabled} class={getClasses()} aria-label={ariaLabel} on:click>
    {#if icon && iconPosition === 'left'}
      <span class="mr-2">{@html icon}</span>
    {/if}
    <slot></slot>
    {#if icon && iconPosition === 'right'}
      <span class="ml-2">{@html icon}</span>
    {/if}
  </button>
{/if}
