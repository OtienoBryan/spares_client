import React from "react";

// No-op stand-ins for @radix-ui/react-tooltip to fully disable tooltips
export const Provider: React.FC<{ children?: React.ReactNode } & Record<string, any>> = ({ children }) => <>{children}</>;
export const Root: React.FC<{ children?: React.ReactNode } & Record<string, any>> = ({ children }) => <>{children}</>;
export const Trigger: React.FC<{ children?: React.ReactNode } & Record<string, any>> = ({ children }) => <>{children}</>;
export const Content = React.forwardRef<HTMLDivElement, { children?: React.ReactNode } & Record<string, any>>(
  ({ children }, _ref) => <>{children}</>
);
Content.displayName = "Content";

// Back-compat for default import patterns
export default {
  Provider,
  Root,
  Trigger,
  Content,
};





