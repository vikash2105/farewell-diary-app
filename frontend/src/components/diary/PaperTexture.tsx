import type { ReactNode } from 'react';

type PaperTextureProps = {
  children: ReactNode;
  className?: string;
};

export default function PaperTexture({ children, className = '' }: PaperTextureProps) {
  return <div className={`diary-paper-texture ${className}`}>{children}</div>;
}
