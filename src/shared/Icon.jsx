import { HugeiconsIcon } from '@hugeicons/react';

// Thin wrapper so every design uses icons the same way:
//   import { Stethoscope02Icon } from '@hugeicons/core-free-icons';
//   <Icon icon={Stethoscope02Icon} size={24} />
// Decorative by default; pass `label` when the icon carries meaning on its own.
export function Icon({ icon, size = 22, strokeWidth = 1.6, label, className }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
