export type ScheduleEvent = {
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
  
  export const scheduleEvents: ScheduleEvent[] = [
    {
      id: "1",
      title: "Pop-Up Wellness Studio",
      category: "Wellness",
      date: "2026-09-14",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Milwaukee, WI",
      description:
        "A community-centered wellness session combining movement, mindfulness, and restoration.",
      thrivecartUrl: "#",
      isPublished: true,
    },
    {
      id: "2",
      title: "Group Yoga",
      category: "Yoga",
      date: "2026-09-18",
      startTime: "6:00 PM",
      endTime: "7:00 PM",
      location: "Milwaukee, WI",
      description:
        "A grounding group yoga practice designed for real bodies and real life.",
      thrivecartUrl: "#",
      isPublished: true,
    },
    {
      id: "3",
      title: "Private Yoga Session",
      category: "Private Session",
      date: "2026-09-22",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      location: "By appointment",
      description:
        "Personalized one-on-one yoga support based on your body, goals, and experience level.",
      thrivecartUrl: "#",
      isPublished: true,
    },
    {
      id: "4",
      title: "Women’s Wellness Workshop",
      category: "Workshop",
      date: "2026-09-26",
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      location: "Milwaukee, WI",
      description:
        "An interactive workshop centered on sustainable wellness, nourishment, and reconnecting with yourself.",
      thrivecartUrl: "#",
      isPublished: true,
    },
    {
      id: "5",
      title: "Sunday Reset",
      category: "Wellness",
      date: "2026-10-04",
      startTime: "10:00 AM",
      endTime: "11:30 AM",
      location: "Milwaukee, WI",
      description:
        "A slower Sunday session focused on movement, breath, reflection, and resetting for the week ahead.",
      thrivecartUrl: "#",
      isPublished: true,
    },
  ];