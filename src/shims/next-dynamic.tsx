import React, { ComponentType, Suspense } from 'react'

export interface DynamicOptions {
  ssr?: boolean
  loading?: () => React.ReactNode
}

export default function dynamic<P extends object>(
  dynamicOptions: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
  options?: DynamicOptions
): ComponentType<P> {
  const LazyComponent = React.lazy(async () => {
    const mod = await dynamicOptions()
    if (typeof mod === 'function' || (typeof mod === 'object' && 'render' in (mod as any))) {
      return { default: mod as ComponentType<P> }
    }
    return mod as { default: ComponentType<P> }
  })

  return function DynamicComponent(props: P) {
    const Fallback = options?.loading ? options.loading() : null
    return (
      <Suspense fallback={Fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
