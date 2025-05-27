"use client";
import * as React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Tag = {
  id: number;
  label: string;
};

type TagsSelectorProps = {
  tags: Tag[];
  value: number[];
  disabled?: boolean;
  onChange: (value: number[]) => void;
};

export function TagsSelector({
  tags,
  value,
  onChange,
  disabled,
}: TagsSelectorProps) {
  const selectedTags = tags.filter((tag) => value.includes(tag.id));
  const selectedsContainerRef = useRef<HTMLDivElement>(null);

  const removeSelectedTag = (id: number) => {
    onChange(value.filter((val) => val !== id));
  };

  const addSelectedTag = (id: number) => {
    onChange([...value, id]);
  };

  useEffect(() => {
    if (selectedsContainerRef.current) {
      selectedsContainerRef.current.scrollTo({
        left: selectedsContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [value]);

  return (
    <div
      className={`w-full max-w-4xl overflow-hidden flex flex-col ${
        disabled ? "pointer-events-none cursor-not-allowed" : ""
      }`}
    >
      <motion.div
        className="w-full flex items-center justify-start gap-1.5 bg-white border h-14 mt-2 mb-3 overflow-x-auto overflow-y-hidden p-1.5"
        style={{ borderRadius: 16 }}
        ref={selectedsContainerRef}
        layout
      >
        {selectedTags.map((tag) => (
          <motion.div
            key={tag.id}
            className="flex items-center gap-1 pl-3 pr-1 py-1 bg-white shadow-md border h-full shrink-0"
            style={{ borderRadius: 14 }}
            layoutId={`tag-${tag.id}`}
          >
            <motion.span
              layoutId={`tag-${tag.id}-label`}
              className="text-gray-700 font-medium"
            >
              {tag.label}
            </motion.span>
            <button
              disabled={disabled}
              onClick={() => removeSelectedTag(tag.id)}
              className="p-1 rounded-full"
            >
              <X className="size-5 text-gray-500" />
            </button>
          </motion.div>
        ))}
      </motion.div>
      {tags.length > selectedTags.length && (
        <motion.div
          className="bg-white shadow-sm p-2 border w-full"
          style={{ borderRadius: 16 }}
          layout
        >
          <motion.div className="flex flex-wrap gap-2">
            {tags
              .filter((tag) => !value.includes(tag.id))
              .map((tag) => (
                <motion.button
                  key={tag.id}
                  layoutId={`tag-${tag.id}`}
                  className="flex items-center gap-1 px-4 py-2.5 bg-gray-100/60 rounded-full shrink-0"
                  onClick={() => addSelectedTag(tag.id)}
                  style={{ borderRadius: 14 }}
                >
                  <motion.span
                    layoutId={`tag-${tag.id}-label`}
                    className="text-gray-700 font-medium"
                  >
                    {tag.label}
                  </motion.span>
                </motion.button>
              ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
