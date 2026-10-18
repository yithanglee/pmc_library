import React from 'react'

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  fill?: boolean
  priority?: boolean
  quality?: number | string
  unoptimized?: boolean
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, alt = '', width, height, fill, priority, className, style, ...props },
  ref
) {
  const combinedStyle: React.CSSProperties = { ...style }
  if (fill) {
    combinedStyle.position = 'absolute'
    combinedStyle.top = 0
    combinedStyle.left = 0
    combinedStyle.width = '100%'
    combinedStyle.height = '100%'
    combinedStyle.objectFit = 'cover'
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      className={className}
      style={combinedStyle}
      {...props}
    />
  )
})

export default Image
