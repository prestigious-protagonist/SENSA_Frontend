import * as z from "zod";

export const UserProfileSchema = z
  .object({
    avatarImage: z
      .string()
      .min(1, { message: "This is a required field" })
      .url(),
    biography: z
      .string()
      .min(1, { message: "This is a required field" })
      .max(300, "Biography cannot exceed 300 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    dateOfBirth: z.string().min(1, { message: "This is a required field" }),
    gender: z.string().min(1, { message: "This is a required field" }),
    experience: z
      .number()
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative"),
    githubProfile: z
      .string()
      .min(1, { message: "This is a required field" })
      .url(),
    linkedInProfile: z
      .string()
      .min(1, { message: "This is a required field" })
      .url(),
    interests: z
      .array(z.number())
      .min(1, { message: "At least one interest is required" })
      .max(3, "You can only have a maximum of 3 interests"),
    skills: z
      .array(z.number())
      .min(1, { message: "At least one skill is required" })
      .max(10, "You can only have a maximum of 10 skills"),
  })
  .refine(
    (data) => {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      return dob <= today;
    },
    {
      message: "Date of birth cannot be in the future",
      path: ["dateOfBirth"],
    }
  )
  .refine(
    (data) => {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());
      const actualAge = hasHadBirthdayThisYear ? age : age - 1;

      return actualAge >= 18;
    },
    {
      message: "You must be at least 18 years old",
      path: ["dateOfBirth"],
    }
  )
  .refine(
    (data) => {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());
      const actualAge = hasHadBirthdayThisYear ? age : age - 1;

      return data.experience < actualAge;
    },
    {
      message: "Experience must be less than your age",
      path: ["experience"],
    }
  );

export type UserProfileType = z.infer<typeof UserProfileSchema>;