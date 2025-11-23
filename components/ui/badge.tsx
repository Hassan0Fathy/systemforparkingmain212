import type { BadgeProps } from "@/components/ui/badge"
import { badgeVariants } from "@/components/ui/badge"
import { Badge } from "@/components/ui/badge"
// ... existing code ...
// <CHANGE> Ensure Badge and types are exported
export { Badge, badgeVariants }
export type { BadgeProps }
