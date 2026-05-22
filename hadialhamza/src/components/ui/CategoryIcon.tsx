import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";
import React from "react";

export type IconName = keyof typeof LucideIcons;

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon = ({ name, ...props }: CategoryIconProps) => {
  const Icon = (LucideIcons as typeof LucideIcons)[name as keyof typeof LucideIcons] as React.ElementType || LucideIcons.Tag;
  return <Icon {...props} />;
};
