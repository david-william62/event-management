import { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Text, TextInput, Button, useTheme, SegmentedButtons,
  ActivityIndicator, HelperText,
} from "react-native-paper";
import { useNavigation } from "@/lib/navigation-context";
import { api } from "@/lib/api";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const CATEGORIES = [
  { value: "TECHNICAL", label: "Technical" },
  { value: "CULTURAL", label: "Cultural" },
  { value: "SPORTS", label: "Sports" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "SEMINAR", label: "Seminar" },
];

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

function toISO(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`;
}

function isValidDate(d: string): boolean {
  if (!DATE_REGEX.test(d)) return false;
  const dt = new Date(d);
  return !isNaN(dt.getTime());
}

function isValidTime(t: string): boolean {
  if (!TIME_REGEX.test(t)) return false;
  const [h, m] = t.split(":").map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

/** Auto-insert dashes as the user types a date (YYYYMMDD → YYYY-MM-DD). */
function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

/** Auto-insert colon as the user types a time (HHMM → HH:MM). */
function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

const ORGS_QUERY = gql`
  query GetMyOrgs {
    me {
      orgMemberships {
        organisation {
          id
          name
        }
      }
    }
  }
`;

type FieldErrors = {
  title?: string;
  description?: string;
  venue?: string;
  organisationId?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  regEndDate?: string;
  regEndTime?: string;
  maxParticipants?: string;
  contactEmail?: string;
};

export default function CreateEvent() {
  const theme = useTheme();
  const { setCurrentRoute } = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [contactEmail, setContactEmail] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [regEndDate, setRegEndDate] = useState("");
  const [regEndTime, setRegEndTime] = useState("23:59");
  const [organisationId, setOrganisationId] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const { data, loading: orgsLoading } = useQuery(ORGS_QUERY);

  const myOrgs = data?.me?.orgMemberships?.map((m: any) => ({
    value: String(m.organisation.id),
    label: m.organisation.name,
  })) || [];

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  function validate(): boolean {
    const newErrors: FieldErrors = {};

    if (!title.trim()) newErrors.title = "Event title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!venue.trim()) newErrors.venue = "Venue is required.";
    if (!organisationId) newErrors.organisationId = "Please select a hosting organisation.";

    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    } else if (!isValidDate(startDate)) {
      newErrors.startDate = "Enter a valid date: YYYY-MM-DD";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required.";
    } else if (!isValidTime(startTime)) {
      newErrors.startTime = "Enter a valid time: HH:MM";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required.";
    } else if (!isValidDate(endDate)) {
      newErrors.endDate = "Enter a valid date: YYYY-MM-DD";
    }

    if (!endTime) {
      newErrors.endTime = "End time is required.";
    } else if (!isValidTime(endTime)) {
      newErrors.endTime = "Enter a valid time: HH:MM";
    }

    if (!regEndDate) {
      newErrors.regEndDate = "Registration deadline date is required.";
    } else if (!isValidDate(regEndDate)) {
      newErrors.regEndDate = "Enter a valid date: YYYY-MM-DD";
    }

    if (!regEndTime) {
      newErrors.regEndTime = "Registration deadline time is required.";
    } else if (!isValidTime(regEndTime)) {
      newErrors.regEndTime = "Enter a valid time: HH:MM";
    }

    // Cross-field date logic checks (only when individual fields are valid)
    if (!newErrors.startDate && !newErrors.startTime && !newErrors.endDate && !newErrors.endTime) {
      const start = new Date(toISO(startDate, startTime));
      const end = new Date(toISO(endDate, endTime));
      if (end <= start) {
        newErrors.endDate = "End date/time must be after the start date/time.";
      }
    }

    if (!newErrors.startDate && !newErrors.startTime && !newErrors.regEndDate && !newErrors.regEndTime) {
      const start = new Date(toISO(startDate, startTime));
      const regEnd = new Date(toISO(regEndDate, regEndTime));
      if (regEnd >= start) {
        newErrors.regEndDate = "Registration deadline must be before the event start time.";
      }
    }

    const maxP = parseInt(maxParticipants, 10);
    if (!maxParticipants) {
      newErrors.maxParticipants = "Max participants is required.";
    } else if (isNaN(maxP) || maxP < 1) {
      newErrors.maxParticipants = "Must be a positive number.";
    }

    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      venue: venue.trim(),
      category,
      organisationId: parseInt(organisationId, 10),
      contactEmail: contactEmail.trim() || undefined,
      maxParticipants: parseInt(maxParticipants, 10),
      startTime: toISO(startDate, startTime),
      endTime: toISO(endDate, endTime),
      registrationEnd: toISO(regEndDate, regEndTime),
    };

    try {
      setSubmitting(true);
      await api.post("/api/events", payload);
      Alert.alert("Success", "Event created and submitted for approval.", [
        { text: "OK", onPress: () => setCurrentRoute("dashboard") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputTheme = { colors: { background: theme.colors.surface } };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineSmall" style={[styles.heading, { color: theme.colors.onBackground }]}>
        Create New Event
      </Text>

      <TextInput
        label="Event Title *"
        value={title}
        onChangeText={(v) => { setTitle(v); clearError("title"); }}
        mode="outlined"
        style={styles.input}
        theme={inputTheme}
        error={!!errors.title}
      />
      <HelperText type="error" visible={!!errors.title}>{errors.title}</HelperText>

      <TextInput
        label="Description *"
        value={description}
        onChangeText={(v) => { setDescription(v); clearError("description"); }}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
        theme={inputTheme}
        error={!!errors.description}
      />
      <HelperText type="error" visible={!!errors.description}>{errors.description}</HelperText>

      <TextInput
        label="Venue *"
        value={venue}
        onChangeText={(v) => { setVenue(v); clearError("venue"); }}
        mode="outlined"
        style={styles.input}
        theme={inputTheme}
        error={!!errors.venue}
      />
      <HelperText type="error" visible={!!errors.venue}>{errors.venue}</HelperText>

      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        Hosting Organization *
      </Text>
      {orgsLoading ? (
        <ActivityIndicator style={{ alignSelf: "flex-start", marginVertical: 8 }} />
      ) : myOrgs.length > 0 ? (
        <>
          <SegmentedButtons
            value={organisationId}
            onValueChange={(v) => { setOrganisationId(v); clearError("organisationId"); }}
            buttons={myOrgs}
            style={{ marginBottom: 4 }}
          />
          <HelperText type="error" visible={!!errors.organisationId}>{errors.organisationId}</HelperText>
        </>
      ) : (
        <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
          You are not part of any Organizations. You cannot host events.
        </Text>
      )}

      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        Category *
      </Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            mode={category === cat.value ? "contained" : "outlined"}
            compact
            style={styles.catChip}
            onPress={() => setCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </View>

      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        Start Date &amp; Time *
      </Text>
      <View style={styles.row}>
        <View style={{ flex: 2, marginRight: 8 }}>
          <TextInput
            label="YYYY-MM-DD"
            value={startDate}
            onChangeText={(v) => { setStartDate(formatDateInput(v)); clearError("startDate"); }}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
            error={!!errors.startDate}
          />
          <HelperText type="error" visible={!!errors.startDate}>{errors.startDate}</HelperText>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            label="HH:MM"
            value={startTime}
            onChangeText={(v) => { setStartTime(formatTimeInput(v)); clearError("startTime"); }}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
            error={!!errors.startTime}
          />
          <HelperText type="error" visible={!!errors.startTime}>{errors.startTime}</HelperText>
        </View>
      </View>

      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        End Date &amp; Time *
      </Text>
      <View style={styles.row}>
        <View style={{ flex: 2, marginRight: 8 }}>
          <TextInput
            label="YYYY-MM-DD"
            value={endDate}
            onChangeText={(v) => { setEndDate(formatDateInput(v)); clearError("endDate"); }}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
            error={!!errors.endDate}
          />
          <HelperText type="error" visible={!!errors.endDate}>{errors.endDate}</HelperText>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            label="HH:MM"
            value={endTime}
            onChangeText={(v) => { setEndTime(formatTimeInput(v)); clearError("endTime"); }}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
            error={!!errors.endTime}
          />
          <HelperText type="error" visible={!!errors.endTime}>{errors.endTime}</HelperText>
        </View>
      </View>

      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        Registration Deadline *
      </Text>
      <HelperText type="info" visible>
        Must be before the event start time.
      </HelperText>
      <View style={styles.row}>
        <View style={{ flex: 2, marginRight: 8 }}>
          <TextInput
            label="YYYY-MM-DD"
            value={regEndDate}
            onChangeText={(v) => { setRegEndDate(formatDateInput(v)); clearError("regEndDate"); }}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
            error={!!errors.regEndDate}
          />
          <HelperText type="error" visible={!!errors.regEndDate}>{errors.regEndDate}</HelperText>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            label="HH:MM"
            value={regEndTime}
            onChangeText={(v) => { setRegEndTime(formatTimeInput(v)); clearError("regEndTime"); }}
            mode="outlined"
            style={styles.input}
            theme={inputTheme}
            keyboardType="numeric"
            error={!!errors.regEndTime}
          />
          <HelperText type="error" visible={!!errors.regEndTime}>{errors.regEndTime}</HelperText>
        </View>
      </View>

      <TextInput
        label="Max Participants *"
        value={maxParticipants}
        onChangeText={(v) => { setMaxParticipants(v); clearError("maxParticipants"); }}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        theme={inputTheme}
        error={!!errors.maxParticipants}
      />
      <HelperText type="error" visible={!!errors.maxParticipants}>{errors.maxParticipants}</HelperText>

      <TextInput
        label="Contact Email"
        value={contactEmail}
        onChangeText={(v) => { setContactEmail(v); clearError("contactEmail"); }}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        theme={inputTheme}
        error={!!errors.contactEmail}
      />
      <HelperText type="error" visible={!!errors.contactEmail}>{errors.contactEmail}</HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting || myOrgs.length === 0}
        style={styles.submitBtn}
        contentStyle={{ paddingVertical: 6 }}
      >
        Submit for Approval
      </Button>

      <Button
        mode="text"
        onPress={() => setCurrentRoute("dashboard")}
        style={{ marginTop: 8 }}
      >
        Cancel
      </Button>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  heading: { fontWeight: "bold", marginBottom: 20 },
  input: { marginBottom: 0 },
  label: { marginBottom: 6, fontWeight: "600" },
  row: { flexDirection: "row", marginBottom: 4 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  catChip: { marginBottom: 4 },
  submitBtn: { marginTop: 8, borderRadius: 8 },
});
