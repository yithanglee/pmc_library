import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  // Create process.env definitions so Next.js style process.env.NEXT_PUBLIC_* references work seamlessly
  const processEnvDef: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
  }

  for (const [key, val] of Object.entries(env)) {
    processEnvDef[`process.env.${key}`] = JSON.stringify(val)
  }

  return {
    plugins: [
      react(),
      {
        name: 'turnstile-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/verify-turnstile', async (req, res) => {
            if (req.method === 'POST') {
              let body = ''
              req.on('data', chunk => {
                body += chunk
              })
              req.on('end', async () => {
                try {
                  const { token } = JSON.parse(body || '{}')
                  const formData = new FormData()
                  formData.append('secret', '0x4AAAAAAAz-_rIRuLnz1dlLkqdGOO_CXZ4')
                  formData.append('response', token)

                  const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                    method: 'POST',
                    body: formData,
                  })
                  const data = await cfRes.json()
                  res.setHeader('Content-Type', 'application/json')
                  if (data.success) {
                    res.statusCode = 200
                    res.end(JSON.stringify({ success: true }))
                  } else {
                    res.statusCode = 400
                    res.end(JSON.stringify({ success: false }))
                  }
                } catch (err: any) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ success: false, error: err.message }))
                }
              })
            } else {
              res.statusCode = 405
              res.end('Method Not Allowed')
            }
          })
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
        'next/navigation': path.resolve(__dirname, './src/shims/next-navigation.tsx'),
        'next/image': path.resolve(__dirname, './src/shims/next-image.tsx'),
        'next/dynamic': path.resolve(__dirname, './src/shims/next-dynamic.tsx'),
        'next/script': path.resolve(__dirname, './src/shims/next-script.tsx'),
        'next/dist/client/script': path.resolve(__dirname, './src/shims/next-script.tsx'),
      },
    },
    define: processEnvDef,
    server: {
      port: 3001,
      host: '0.0.0.0',
      allowedHosts: true,
    },
    preview: {
      port: 3001,
      host: '0.0.0.0',
      allowedHosts: true,
    },
    build: {
      outDir: 'dist',
    },
  }
})
