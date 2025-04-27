import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';

const SheetBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.18);
  z-index: 2000;
  opacity: ${props => (props.open ? 1 : 0)};
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  transition: opacity 0.2s;
`;

const SheetContent = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  max-width: 100vw;
  background: #fff;
  box-shadow: -2px 0 12px rgba(0,0,0,0.08);
  z-index: 2100;
  transform: translateX(${props => (props.open ? '0' : '100%')});
  transition: transform 0.28s cubic-bezier(.4,0,.2,1);
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    width: 100vw;
    min-width: 0;
  }
`;

const SheetClose = styled.button`
  align-self: flex-end;
  margin: 12px 12px 0 0;
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 10px;
  transition: background 0.15s;
  &:hover {
    background: #f5f5f5;
    color: #222;
  }
`;

export default function Sheet({ open, onClose, children }) {
  const contentRef = useRef();

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Trap focus (optional, basic)
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    contentRef.current?.focus();
    return () => prev?.focus();
  }, [open]);

  return (
    <>
      <SheetBackdrop open={open} onClick={onClose} />
      <SheetContent
        open={open}
        tabIndex={-1}
        ref={contentRef}
        aria-modal="true"
        role="dialog"
        onClick={e => e.stopPropagation()}
      >
        <SheetClose onClick={onClose} aria-label="Close">×</SheetClose>
        {children}
      </SheetContent>
    </>
  );
} 