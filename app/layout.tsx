import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getLocale, getMessages } from 'next-intl/server';
import './globals.css';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { SimulationProvider } from '@/contexts/SimulationContext';
import { UIProvider } from '@/contexts/UiContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CNC Simulator - G-Code & Image to G-Code',
  description: 'Professional CNC G-Code parser and 3D visualization tool with Image to G-Code conversion (Fusion 360 style)',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <LocaleProvider initialLocale={locale} initialMessages={messages}>
          <SettingsProvider>
            <UIProvider>
              <WorkspaceProvider>
                <SimulationProvider>
                  {children}
                </SimulationProvider>
              </WorkspaceProvider>
            </UIProvider>
          </SettingsProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
