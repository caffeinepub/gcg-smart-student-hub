import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Assignment,
  CalendarEvent,
  ChatMessage,
  Notification,
  PerformanceData,
  StudentProfile,
  Subject,
} from "../backend";
import { useActor } from "./useActor";

export function useStudentProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile | null>({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSubjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCalendarEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCalendarEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllAssignments() {
  const { actor, isFetching } = useActor();
  return useQuery<Assignment[]>({
    queryKey: ["assignments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePerformanceData() {
  const { actor, isFetching } = useActor();
  return useQuery<PerformanceData[]>({
    queryKey: ["performanceData"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPerformanceData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllStudentProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<StudentProfile[]>({
    queryKey: ["allStudentProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudentProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChatHistory(withUser: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory", withUser?.toString()],
    queryFn: async () => {
      if (!actor || !withUser) return [];
      return actor.getChatHistory(withUser);
    },
    enabled: !!actor && !isFetching && !!withUser,
    refetchInterval: 5000,
  });
}

export function useUpdateSubject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subject: Subject) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSubject(subject);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: StudentProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["studentProfile"] }),
  });
}

export function useSubmitAssignment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assignmentId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitAssignment(assignmentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] }),
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      receiverId,
    }: { content: string; receiverId: Principal }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage({ content, receiverId });
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["chatHistory", vars.receiverId.toString()],
      }),
  });
}
