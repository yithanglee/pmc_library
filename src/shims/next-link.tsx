import React from 'react'
import { Link as TanstackLink } from '@tanstack/react-router'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string | { pathname?: string; query?: Record<string, any> }
  to?: string
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  prefetch?: boolean
  children?: React.ReactNode
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, to, children, passHref, replace, scroll, shallow, prefetch, ...props },
  ref
) {
  let targetPath = to || ''
  if (!targetPath && href) {
    if (typeof href === 'string') {
      targetPath = href
    } else if (typeof href === 'object' && href.pathname) {
      targetPath = href.pathname
      if (href.query) {
        const search = new URLSearchParams(href.query).toString()
        if (search) targetPath += `?${search}`
      }
    }
  }

  // Handle external or hash links
  if (!targetPath || targetPath.startsWith('#') || targetPath.startsWith('http://') || targetPath.startsWith('https://') || targetPath.startsWith('mailto:')) {
    return (
      <a ref={ref} href={targetPath || '#'} {...props}>
        {children}
      </a>
    )
  }

  return (
    <TanstackLink ref={ref} to={targetPath} replace={replace} {...(props as any)}>
      {children}
    </TanstackLink>
  )
})

export default Link
