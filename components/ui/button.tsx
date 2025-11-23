import type { ButtonProps } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
// ... existing code ...
// <CHANGE> Add explicit named exports with types
export { Button, buttonVariants }
export type { ButtonProps }
