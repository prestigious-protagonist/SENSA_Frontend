"use client";
import * as z from "zod";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { Avatar } from "./avatar";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { SelectUse } from "@/components/ui/selectUse";
import { zodResolver } from "@hookform/resolvers/zod";
import { INTERESTS, SKILLS } from "../slug/profileData";
import { Input, Textarea } from "@/components/ui/input";
import { TagsSelector } from "@/components/ui/tags-selector";
import { UserProfileSchema } from "@/schemas/userProfileSchema";
import FormSkeleton from "@/components/ui/skeletons/formSkeleton";
import { LoaderCircle, Pencil, SendHorizontal } from "lucide-react";

export const EditProfileForm = ({ existingUser }: any) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      avatarImage: existingUser?.avatarImage,
      biography: existingUser?.bio,
      username: existingUser?.username,
      dateOfBirth: existingUser?.DOB,
      gender: existingUser?.gender,
      experience: existingUser?.experience,
      githubProfile: existingUser?.social.github,
      linkedInProfile: existingUser?.social.linkedIn,
      skills: existingUser?.Skills?.map((skills: any) => skills.id) || [],
      interests:
        existingUser?.InterestedIns?.map(
          (interests: any) => interests.id + existingUser?.totalSkills
        ) || [],
    },
  });

  function formatToDDMMYYYY(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  async function onSubmit(values: z.infer<typeof UserProfileSchema>) {
    for (let i = 0; i < values.interests.length; i++) {
      values.interests[i] = values.interests[i] - existingUser?.totalSkills;
    }
    values.dateOfBirth = formatToDDMMYYYY(values.dateOfBirth);
    const token = await getToken();
    setIsLoading(true);
    try {
      const result = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userService/api/v1/updateProfile`,
        {
          username: values.username,
          DOB: values.dateOfBirth,
          experience: values.experience,
          gender: values.gender,
          bio: values.biography,
          pfp: values.avatarImage,
          skillsId: values.skills,
          linkedinUrl: values.linkedInProfile,
          githubUrl: values.githubProfile,
          interestedSkillsId: values.interests,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 202) {
        toast.success("Profile updated successfully!", {
          description: "You are being redirected, please wait.",
        });
        router.push("/feed");
      } else {
        toast.error("Something went wrong", {
          description: result.data.message,
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        const errorData = error.response?.data?.data;
        toast.error(errorMessage, {
          description: errorData || error.message,
        });
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!isLoaded || !user || isLoading) return <FormSkeleton />;

  return (
    <div className="max-w-5xl mx-auto flex flex-col py-[60px]">
      <h2 className="text-3xl font-medium mt-4 mb-4">
        Welcome to your profile,{" "}
        {user.fullName ? (
          <span className="text-[#9170FF]">{user.fullName}</span>
        ) : (
          <span className="text-[#9170FF]">
            {user.emailAddresses[0]?.emailAddress}
          </span>
        )}
      </h2>
      <div className="h-64">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-muted rounded-3xl">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <Image
            src={`https://avatar.vercel.sh/${user.fullName}`}
            alt="Default profile background"
            width={1920}
            height={1080}
            quality={100}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="max-w-xl mx-auto space-y-4">
            <FormField
              control={form.control}
              name="avatarImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Avatar
                      onImageChange={(url) => field.onChange(url)}
                      defaultImage={user.imageUrl}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={!isEditable}
                      maxLength={300}
                      placeholder={`${existingUser?.bio}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditable}
                      placeholder="johndoe-118"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={!isEditable}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <SelectUse
                      disabled={!isEditable}
                      placeholder="Select your gender"
                      value={["Male", "Female", "Other"]}
                      label="Gender"
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditable}
                      placeholder="0"
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 0
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditable}
                      placeholder="Your github profile url"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedInProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditable}
                      placeholder="Your linkedin profile url"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <TagsSelector
                      disabled={!isEditable}
                      tags={SKILLS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <TagsSelector
                      disabled={!isEditable}
                      tags={INTERESTS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3 mt-6 justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              {isEditable && (
                <Button type="submit" disabled={isLoading} className="group">
                  {isLoading ? (
                    <>
                      Loading
                      <LoaderCircle className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Submit
                      <SendHorizontal className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              )}
              {!isEditable && (
                <Button type="button" onClick={() => setIsEditable(true)}>
                  Edit
                  <Pencil className="transition-transform group-hover:translate-x-0.5" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
