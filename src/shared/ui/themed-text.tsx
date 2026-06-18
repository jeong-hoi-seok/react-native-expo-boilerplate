import { cva, type VariantProps } from "class-variance-authority";
import { Text, type TextProps } from "react-native";

import { cn, useThemeColor } from "@/shared/lib";

const themedTextVariants = cva("", {
  variants: {
    type: {
      default: "text-base leading-6",
      defaultSemiBold: "text-base leading-6 font-semibold",
      title: "text-[32px] font-bold leading-8",
      subtitle: "text-xl font-bold",
      link: "text-base leading-[30px] text-[#0a7ea4]",
    },
    themed: {
      true: "text-[#11181C] dark:text-[#ECEDEE]",
      false: "",
    },
  },
  defaultVariants: {
    type: "default",
    themed: true,
  },
});

export type ThemedTextProps = TextProps &
  VariantProps<typeof themedTextVariants> & {
    lightColor?: string;
    darkColor?: string;
  };

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  const hasCustomColor = lightColor != null || darkColor != null;
  const themeColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const useThemeClass = type !== "link" && !hasCustomColor;
  const colorStyle =
    type === "link" ? undefined : hasCustomColor ? { color: themeColor } : undefined;

  return (
    <Text
      className={cn(themedTextVariants({ type, themed: useThemeClass }), className)}
      style={[colorStyle, style]}
      {...rest}
    />
  );
}
