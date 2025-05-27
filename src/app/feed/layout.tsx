"use client";
import { useEffect, useState } from "react";
import { SelectUse } from "@/components/ui/selectUse";
import { UserSection } from "./components/userSection";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const placeholders = [
    "Who is working in Machine Learning?",
    "Results for Python",
    "LLM Application Development",
    "People in UI/UX Prototyping & Theming",
    "Results for C/C++",
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <main className="container mt-[40px] py-[60px] flex justify-between">
      <div className="w-1/5 overflow-hidden">
        <UserSection />
      </div>
      <div className="w-4/5 ml-20 space-y-6">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
        {/* <div className="flex items-center justify-between">
          <div>
            <SelectUse
              placeholder="Sort By"
              label="Sort By"
              value={["Age", "Skills", "Gender", "Interests"]}
              field={{
                value: filter,
                onChange: (val) => {
                  setFilter(val);
                  router.push(`/feed/sort-by?filter=${val}`);
                },
              }}
            />
          </div>
        </div> */}
        {children}
      </div>
    </main>
  );
}
