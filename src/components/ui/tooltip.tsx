// Tooltip fully disabled: provide no-op components to avoid importing radix
import React from "react";

type NoopProps = { children?: React.ReactNode } & Record<string, any>;

export const TooltipProvider: React.FC<NoopProps> = ({ children }) => <>{children}</>;
export const Tooltip: React.FC<NoopProps> = ({ children }) => <>{children}</>;
export const TooltipTrigger: React.FC<NoopProps> = ({ children }) => <>{children}</>;
export const TooltipContent = React.forwardRef<HTMLDivElement, NoopProps>(
  ({ children, ..._props }, _ref) => <>{children}</>
);
TooltipContent.displayName = "TooltipContent";

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[diag] tooltip noop module loaded');
}

export default Tooltip;
