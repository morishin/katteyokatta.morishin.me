import { Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import type { ComponentProps, FC, PropsWithChildren } from "react";

type DefaultLinkProps = PropsWithChildren<{
  href: ComponentProps<typeof Link>["href"];
  color?: ComponentProps<typeof ChakraLink>["color"];
  target?: ComponentProps<typeof ChakraLink>["target"];
  textDecorationOnHover?: NonNullable<
    ComponentProps<typeof ChakraLink>["_hover"]
  >["textDecoration"];
}>;

export const DefaultLink: FC<DefaultLinkProps> = ({
  href,
  color = "primary",
  textDecorationOnHover = "underline",
  children,
  target,
}) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <ChakraLink
        color={color}
        target={target}
        _hover={{ textDecoration: textDecorationOnHover }}
      >
        {children}
      </ChakraLink>
    </Link>
  );
};
