import fs from "fs";
import path from "path";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import EditorShell from "@/components/sa-editor/EditorShell";

import home from "@/content/home.json";
import about from "@/content/about.json";
import coaching from "@/content/coaching.json";

export type Offering = {
  slug: string;
  name: string;
  description: string;
  price?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
};

export type HomeContent = typeof home;

export type AboutContent = typeof about;

export type CoachingContent = typeof coaching;

export type ScheduleEvent = {
  slug: string;
  id: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description?: string;
  thrivecartUrl: string;
  isPublished: boolean;
};

export type EventItem = {
  slug: string;
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  image: string;
  href: string;
  gallery?: string[];
  isPublished: boolean;
};

function getAllowedUserIds() {
  return (process.env.SA_EDITOR_ALLOWED_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function getOfferings(): Offering[] {
  const directory = path.join(
    process.cwd(),
    "content",
    "offerings"
  );

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const filePath = path.join(
        directory,
        file
      );

      const data = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );

      return {
        ...data,
        slug: file.replace(".json", ""),
      };
    })
    .sort(
      (a, b) =>
        (a.order ?? 999) -
        (b.order ?? 999)
    );
}

function getEvents(): EventItem[] {
  const directory = path.join(
    process.cwd(),
    "content",
    "events"
  );

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const filePath = path.join(
        directory,
        file
      );

      const data = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );

      return {
        ...data,
        slug: file.replace(".json", ""),
      };
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
}

function getScheduleEvents(): ScheduleEvent[] {
  const directory = path.join(
    process.cwd(),
    "content",
    "schedule"
  );

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const filePath = path.join(
        directory,
        file
      );

      const data = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );

      return {
        ...data,
        slug: file.replace(".json", ""),
      };
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );
}

export default async function SAEditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(
      "/sign-in?redirect_url=/sa-editor"
    );
  }

  const allowedUserIds =
    getAllowedUserIds();

  if (
    allowedUserIds.length === 0 ||
    !allowedUserIds.includes(userId)
  ) {
    redirect("/");
  }

  const offerings = getOfferings();
  const scheduleEvents =
    getScheduleEvents();
  const events = getEvents();

  return (
    <EditorShell
      offerings={offerings}
      homeContent={home}
      aboutContent={about}
      coachingContent={coaching}
      scheduleEvents={scheduleEvents}
      events={events}
    />
  );
}