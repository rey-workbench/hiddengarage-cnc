import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SimulationProvider } from '@/contexts/simulation-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { UIProvider } from '@/contexts/ui-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CNC Simulator - G-Code & SVG Visualization',
  description: 'Professional CNC G-Code parser and 3D visualization tool with SVG to G-Code conversion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <SettingsProvider>
          <UIProvider>
            <SimulationProvider>
              {children}
            </SimulationProvider>
          </UIProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
