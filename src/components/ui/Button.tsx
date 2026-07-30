import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-body font-medium shadow-[0_2px_10px_rgba(46,74,143,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(46,74,143,0.18)] active:translate-y-0 active:scale-100 px-8 py-3 text-base whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-trust-blue text-linen-white hover:bg-thread-green',
        secondary: 'border-2 border-trust-blue text-trust-blue hover:border-thread-red hover:text-thread-red',
        accent: 'bg-thread-red text-linen-white hover:bg-thread-pink',
      },
    },
    defaultVariants: { variant: 'primary' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}
