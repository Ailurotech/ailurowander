<script lang="ts">
  export let variant: 'light' | 'dark' | 'pattern' | 'lattice' = 'light';
  export let id: string | undefined = undefined;
  export let spacing: 'sm' | 'md' | 'lg' = 'md';
  export let containerWidth: boolean = true;
  export let className: string = '';
  
  // Dynamic class construction
  const getSectionClasses = () => {
    const baseClasses = 'section';
    const variantClass = `section--${variant}`;
    const spacingClass = spacing === 'sm' ? 'py-8 md:py-12' :
                         spacing === 'lg' ? 'py-16 md:py-24 lg:py-32' : '';
    
    return `${baseClasses} ${variantClass} ${spacingClass} ${className}`;
  };

  // Handle custom patterns
  const getStyle = () => {
    if (variant === 'lattice') {
      return `background-image: url('/patterns/chinese-lattice.svg'); background-repeat: repeat;`;
    }
    return '';
  };
</script>

<section {id} class={getSectionClasses()} style={getStyle()}>
  <div class={containerWidth ? 'container' : 'w-full'}>
    <slot name="header"></slot>
    <slot></slot>
  </div>
</section> 