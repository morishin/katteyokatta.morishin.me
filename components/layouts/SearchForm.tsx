import { Button, HStack, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FormEventHandler, useRef } from "react";

type Props = {
  keyword?: string;
};

export const SearchForm: React.FC<Props> = ({ keyword }) => {
  const inputValue = useRef<string>(keyword || "");
  const router = useRouter();
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (inputValue.current.length > 0) {
      router.push(`/search/${inputValue.current}`);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <HStack>
        <Input
          name="q"
          placeholder="気になる商品名・カテゴリを入力"
          fontSize={["sm", "sm", "md", "md"]}
          size="md"
          bgColor="white"
          defaultValue={keyword}
          onChange={(event) => {
            inputValue.current = event.target.value;
          }}
          textColor="gray.600"
        />
        <Button
          fontSize="sm"
          bgColor="white"
          _hover={{ bgColor: "gray.100" }}
          type="submit"
          textColor="gray.600"
        >
          検索
        </Button>
      </HStack>
    </form>
  );
};
