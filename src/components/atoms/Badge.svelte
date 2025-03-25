<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'accent' = 'primary';
  export let size: 'sm' | 'md' = 'md';
  export let pill: boolean = true;
  export let className: string = '';
  
  // Dynamic class construction
  const getClasses = () => {
    const baseClasses = 'badge';
    const variantClass = `badge--${variant}`;
    const shapeClass = pill ? 'rounded-full' : 'rounded-md';
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';
    
    return `${baseClasses} ${variantClass} ${shapeClass} ${sizeClass} ${className}`;
  };
</script>

<span class={getClasses()}>
  <slot></slot>
</span> 