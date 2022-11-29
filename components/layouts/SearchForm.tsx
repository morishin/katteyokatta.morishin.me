import { Button, FormControl, HStack, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  keyword?: string;
  onSubmitted?: () => void;
};

type Inputs = {
  query: string;
};

export const SearchForm: React.FC<Props> = ({ keyword, onSubmitted }) => {
  const { register, handleSubmit, setValue } = useForm<Inputs>({
    defaultValues: { query: keyword ?? "" },
  });

  useEffect(() => {
    setValue("query", keyword ?? "");
  }, [keyword, setValue]);

  const router = useRouter();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.query.length > 0) {
      router.push(`/search?q=${data.query}`);
    }
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <HStack>
          <Input
            {...register("query", { required: true })}
            placeholder="気になる商品名・カテゴリを入力"
            fontSize={["sm", "sm", "md", "md"]}
            size="md"
            bgColor="white"
            textColor="gray.600"
          />
          <Button
            fontSize="sm"
            bgColor="white"
            _hover={{ bgColor: "gray.100" }}
            type="submit"
            form="search-form"
            textColor="gray.600"
            onClick={handleSubmit(onSubmit)}
          >
            検索
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};
