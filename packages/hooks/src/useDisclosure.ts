import { useCallback, useId, useState } from 'react';

export interface UseDisclosureOptions {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureTriggerProps {
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: () => void;
}

export interface UseDisclosureContentProps {
  id: string;
  role: 'region';
  hidden: boolean;
}

export interface UseDisclosureReturn {
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
  triggerProps: UseDisclosureTriggerProps;
  contentProps: UseDisclosureContentProps;
}

/**
 * Boolean open/closed state with ARIA wiring for a disclosure widget.
 * Pass `open` + `onOpenChange` for controlled use, or just `defaultOpen`
 * for uncontrolled. The returned `triggerProps` / `contentProps` share an
 * auto-generated id so the consumer doesn't have to mint one.
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const { defaultOpen = false, open: controlledOpen, onOpenChange } = options;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const onToggle = useCallback((): void => {
    setOpen(!open);
  }, [open, setOpen]);

  const onOpen = useCallback((): void => {
    setOpen(true);
  }, [setOpen]);

  const onClose = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  return {
    open,
    onToggle,
    onOpen,
    onClose,
    triggerProps: {
      'aria-expanded': open,
      'aria-controls': contentId,
      onClick: onToggle,
    },
    contentProps: {
      id: contentId,
      role: 'region',
      hidden: !open,
    },
  };
}
