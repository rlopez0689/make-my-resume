import {
  Flex,
  HStack,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import OutlineButton from "./OutlineButton";

const PillsComponent = ({
  placeholder,
  onChange,
  defaultValues,
  maxLength = 50,
}: {
  placeholder: string;
  defaultValues: string[];
  onChange: (arg: string[]) => void;
  maxLength: number;
}) => {
  const [pills, setPills] = useState<string[]>(defaultValues || []);
  const [value, setValue] = useState("");
  const handleAdd = () => {
    if (!value || pills.includes(value)) {
      setValue("");
      return;
    }
    const newPills = [...pills];
    newPills.push(value);
    setPills(newPills);
    onChange(newPills);
    setValue("");
  };

  const handleRemove = (pillToRemove: string) => {
    const newPills = pills.filter((pill) => pill !== pillToRemove);
    setPills(newPills);
    onChange(newPills);
  };

  return (
    <VStack alignItems={"start"}>
      <HStack w="100%">
        <Input
          type="text"
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          w="90%"
        />
        <OutlineButton onClick={handleAdd} w="10%">
          Add
        </OutlineButton>
      </HStack>
      {pills.length > 0 && (
        <Flex wrap="wrap" gap={2}>
          {pills.map((pill) => (
            <Tag
              key={pill}
              variant="solid"
              bg="gray.200"
              py={2}
              px={3}
              color="black"
            >
              <TagLabel>{pill}</TagLabel>
              <TagCloseButton onClick={(e) => handleRemove(pill)} />
            </Tag>
          ))}
        </Flex>
      )}
    </VStack>
  );
};

export default PillsComponent;
