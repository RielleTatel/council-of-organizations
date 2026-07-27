import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium transition-transform transition-colors duration-300 hover:-translate-y-0.5 active:translate-y-0 px-8 py-3 text-base whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-trust-blue text-linen-white hover:bg-thread-green',
        secondary: 'border-2 border-trust-blue text-trust-blue hover:border-thread-red hover:text-thread-red',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}
