import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./Common.module.scss";

type ContainerProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={[styles.container, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
