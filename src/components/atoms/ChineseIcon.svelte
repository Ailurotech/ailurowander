<script lang="ts">
  // Icon options
  export let icon: 'great-wall' | 'forbidden-city' | 'terracotta' | 
              'temple' | 'pagoda' | 'dragon' | 'panda' | 
              'lantern' | 'bamboo' | 'mountains' = 'great-wall';
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let color: string = 'currentColor';
  
  // Size mapping
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  };
  
  // Get the actual SVG path based on the icon name
  function getIconPath(iconName: string) {
    switch (iconName) {
      case 'great-wall':
        return `
          <path d="M10,40 H90 M10,40 v-15 h10 v-10 h10 v10 h10 v-10 h10 v10 h10 v-10 h10 v10 h10 v15 M20,40 v-5 h10 v5 M40,40 v-5 h10 v5 M60,40 v-5 h10 v5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M5,40 L5,45 H95 L95,40" fill="none" />
        `;
      case 'forbidden-city':
        return `
          <path d="M35,60 H65 V30 C65,20 50,10 50,10 C50,10 35,20 35,30 V60 Z" fill="none" />
          <path d="M30,60 H70 M40,50 H60 M40,40 H60 M45,30 H55 M45,20 H55" stroke-linecap="round" fill="none" />
          <path d="M25,60 v10 h50 v-10" fill="none" />
        `;
      case 'terracotta':
        return `
          <circle cx="50" cy="30" r="15" fill="none" />
          <path d="M35,50 H65 M40,60 H60" stroke-linecap="round" fill="none" />
          <path d="M30,35 C30,60 40,75 50,75 C60,75 70,60 70,35" fill="none" />
        `;
      case 'temple':
        return `
          <path d="M20,60 H80 M20,60 v10 h60 v-10" fill="none" />
          <path d="M30,60 v-15 h40 v15" fill="none" />
          <path d="M25,45 H75 M25,45 c0,-5 5,-10 10,-10 h30 c5,0 10,5 10,10" fill="none" />
          <path d="M35,35 H65 M35,35 c0,-5 5,-10 15,-10 c10,0 15,5 15,10" fill="none" />
        `;
      case 'pagoda':
        return `
          <path d="M40,80 H60 M45,80 v-15 h10 v15" fill="none" />
          <path d="M30,65 H70 M35,65 v-15 h30 v15" fill="none" />
          <path d="M25,50 H75 M30,50 v-15 h40 v15" fill="none" />
          <path d="M20,35 H80 M25,35 v-15 h50 v15" fill="none" />
          <path d="M50,20 L30,35 M50,20 L70,35" fill="none" />
        `;
      case 'dragon':
        return `
          <path d="M20,50 C30,40 30,30 40,30 C45,25 55,25 60,30 C70,30 70,40 80,50" fill="none" />
          <path d="M30,30 C30,20 40,15 50,20 C60,15 70,20 70,30" fill="none" />
          <path d="M20,50 C15,60 20,70 30,70 C40,75 60,75 70,70 C80,70 85,60 80,50" fill="none" />
          <circle cx="40" cy="35" r="3" />
          <circle cx="60" cy="35" r="3" />
        `;
      case 'panda':
        return `
          <circle cx="50" cy="50" r="25" fill="none" />
          <circle cx="35" cy="40" r="8" fill="none" />
          <circle cx="65" cy="40" r="8" fill="none" />
          <circle cx="50" cy="55" r="5" fill="none" />
          <circle cx="40" cy="42" r="2" />
          <circle cx="60" cy="42" r="2" />
        `;
      case 'lantern':
        return `
          <path d="M50,20 v10 M40,30 h20 M40,70 h20" fill="none" />
          <path d="M40,30 C30,40 30,60 40,70 M60,30 C70,40 70,60 60,70" fill="none" />
          <path d="M50,70 v10 M45,75 h10" fill="none" />
        `;
      case 'bamboo':
        return `
          <path d="M40,20 v60 M40,30 h5 M40,45 h5 M40,60 h5" fill="none" />
          <path d="M50,15 v65 M50,25 h5 M50,40 h5 M50,55 h5 M50,70 h5" fill="none" />
          <path d="M60,20 v60 M60,30 h5 M60,45 h5 M60,60 h5" fill="none" />
        `;
      case 'mountains':
        return `
          <path d="M10,70 L30,30 L50,60 L70,20 L90,70 Z" fill="none" />
          <path d="M30,70 L40,50 L50,60 L60,45 L70,70 Z" fill="none" />
        `;
      default:
        return '';
    }
  }
</script>

<svg
  width={sizeMap[size]}
  height={sizeMap[size]}
  viewBox="0 0 100 100"
  fill="none"
  stroke={color}
  stroke-width="2"
  xmlns="http://www.w3.org/2000/svg"
>
  {@html getIconPath(icon)}
</svg> 