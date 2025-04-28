import React, { useState } from 'react';
import { Drawer } from 'vaul';

export default function VaulTest() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 40 }}>
      <h1>Vaul Drawer Minimal Test</h1>
      <button onClick={() => setOpen(true)} style={{ fontSize: 18, padding: '10px 20px' }}>
        Open Drawer
      </button>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          {/* Hidden, we use the button above */}
          <span />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content description="Minimal test drawer" style={{ minHeight: 200, background: '#fff', border: '3px solid blue' }}>
            <Drawer.Title>Test Drawer</Drawer.Title>
            <div style={{ height: 200, background: 'lightblue', textAlign: 'center', paddingTop: 80 }}>
              VAUL DRAWER CONTENT
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
} 