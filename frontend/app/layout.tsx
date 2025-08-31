import './globals.css'

export const metadata = {
  title: 'ExploraModelo',
  description: 'Educa sobre parámetros de decodificación de modelos Transformer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-background text-white min-h-screen">{children}</body>
    </html>
  )
}
