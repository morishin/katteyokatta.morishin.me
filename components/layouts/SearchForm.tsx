import { Box, Button, HStack, Input } from "@chakra-ui/react";
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
    router.push(`/search/${inputValue.current}`);
  };
  return (
    <Box w={500}>
      <form onSubmit={onSubmit}>
        <HStack>
          <Input
            name="q"
            placeholder="気になる商品名・カテゴリを入力"
            size="md"
            bgColor="white"
            defaultValue={keyword}
            onChange={(event) => {
              inputValue.current = event.target.value;
            }}
            textColor="gray.600"
          />
          <Button
            fontSize="15px"
            bgColor="white"
            _hover={{ bgColor: "gray.100" }}
            type="submit"
            textColor="gray.600"
          >
            検索
          </Button>
        </HStack>
      </form>
    </Box>
  );
};
