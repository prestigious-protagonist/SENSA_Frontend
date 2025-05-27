import * as React from "react";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

interface SelectUseProps {
  placeholder: string;
  label: string;
  value: string[];
  field?: {
    value: string;
    onChange: (value: string) => void;
  };
  disabled?: boolean;
}

export function SelectUse({
  placeholder,
  label,
  value,
  field,
  disabled,
}: SelectUseProps) {
  return (
    <Select
      value={field?.value}
      onValueChange={field?.onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {value.map((item, index) => (
            <SelectItem value={item} key={index}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
