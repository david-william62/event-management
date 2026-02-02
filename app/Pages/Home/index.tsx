import Card from "@/components/HomePage/Card"
import { ScrollView, View } from "react-native"
import { useNavigation } from "@/lib/navigation-context"
import { useTheme } from "react-native-paper"

const placeholders = [
  {
    id: "1",
    title: "TechFest 2026",
    organiser: "Computer Science Department",
    description: "Annual technical festival featuring coding competitions, hackathons, and tech talks from industry experts.",
    date: "March 15-17, 2026",
    time: "9:00 AM - 6:00 PM",
    venue: "Main Auditorium & CS Block",
    category: "Technical Festival",
    registrationDeadline: "March 10, 2026",
    contactEmail: "techfest@college.edu",
    maxParticipants: "500"
  },
  {
    id: "2",
    title: "Robotics Workshop",
    organiser: "Robotics Club",
    description: "Hands-on workshop on building autonomous robots using Arduino and Raspberry Pi. Learn programming and hardware integration.",
    date: "February 20, 2026",
    time: "10:00 AM - 4:00 PM",
    venue: "Engineering Lab 3",
    category: "Workshop",
    registrationDeadline: "February 18, 2026",
    contactEmail: "robotics@college.edu",
    maxParticipants: "50"
  },
  {
    id: "3",
    title: "AI & Machine Learning Symposium",
    organiser: "AI Research Group",
    description: "Explore the latest trends in artificial intelligence and machine learning with guest lectures from leading researchers.",
    date: "March 5, 2026",
    time: "2:00 PM - 6:00 PM",
    venue: "Seminar Hall A",
    category: "Symposium",
    registrationDeadline: "March 1, 2026",
    contactEmail: "ai-research@college.edu",
    maxParticipants: "200"
  },
  {
    id: "4",
    title: "Hackathon 24hrs",
    organiser: "Coding Club",
    description: "24-hour coding marathon to build innovative solutions for real-world problems. Prizes worth ₹1,00,000!",
    date: "April 10-11, 2026",
    time: "12:00 PM (Day 1) - 12:00 PM (Day 2)",
    venue: "Computer Lab 1 & 2",
    category: "Competition",
    registrationDeadline: "April 5, 2026",
    contactEmail: "hackathon@college.edu",
    maxParticipants: "100"
  },
  {
    id: "5",
    title: "Industry Connect 2026",
    organiser: "Placement Cell",
    description: "Meet recruiters from top tech companies. Networking session, resume reviews, and mock interviews available.",
    date: "March 25, 2026",
    time: "11:00 AM - 5:00 PM",
    venue: "Convention Center",
    category: "Career Fair",
    registrationDeadline: "March 20, 2026",
    contactEmail: "placements@college.edu",
    maxParticipants: "300"
  }
]

export default function HomePage() {
  const { setCurrentRoute, setEventData } = useNavigation()
  const theme = useTheme()

  const handleEventPress = (event: typeof placeholders[0]) => {
    setEventData(event)
    setCurrentRoute('eventDetails')
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      {placeholders.map((event) => (
        <Card
          key={event.id}
          title={event.title}
          organiser={event.organiser}
          content={event.description}
          action={() => handleEventPress(event)}
        />
      ))}
    </ScrollView>
  )
} 