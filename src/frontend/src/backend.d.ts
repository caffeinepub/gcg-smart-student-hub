import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StudentProfile {
    studentId: string;
    profileImage: string;
    name: string;
    year: bigint;
    email: string;
    phone: string;
    course: string;
}
export type Time = bigint;
export interface ChatMessageInput {
    content: string;
    receiverId: Principal;
}
export interface Notification {
    id: bigint;
    title: string;
    notificationType: NotificationType;
    isRead: boolean;
    message: string;
    timestamp: Time;
}
export interface CalendarEvent {
    id: bigint;
    title: string;
    date: Time;
    description: string;
    eventType: CalendarEventType;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    isRead: boolean;
    receiverId: Principal;
    timestamp: Time;
    senderId: Principal;
}
export interface Assignment {
    id: bigint;
    isSubmitted: boolean;
    title: string;
    dueDate: Time;
    submittedAt?: Time;
    description: string;
    subjectId: bigint;
}
export interface PerformanceData {
    month: bigint;
    marksPercent: bigint;
    subjectId: bigint;
    attendancePercent: bigint;
}
export interface Subject {
    id: bigint;
    professorName: string;
    isCompleted: boolean;
    marksObtained: bigint;
    practicalDate: Time;
    name: string;
    maxMarks: bigint;
    attendancePercent: bigint;
    examDate: Time;
}
export enum CalendarEventType {
    practical = "practical",
    assignment = "assignment",
    exam = "exam",
    holiday = "holiday"
}
export enum NotificationType {
    examReminder = "examReminder",
    general = "general",
    assignmentReminder = "assignmentReminder"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addNotification(notification: Notification, receiver: Principal): Promise<bigint>;
    addPerformanceData(data: PerformanceData): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAssignment(assignment: Assignment): Promise<bigint>;
    createCalendarEvent(event: CalendarEvent): Promise<bigint>;
    createSubject(subject: Subject): Promise<bigint>;
    getAllAssignments(): Promise<Array<Assignment>>;
    getAllCalendarEvents(): Promise<Array<CalendarEvent>>;
    getAllStudentProfiles(): Promise<Array<StudentProfile>>;
    getAllSubjects(): Promise<Array<Subject>>;
    getCallerUserProfile(): Promise<StudentProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(withUser: Principal): Promise<Array<ChatMessage>>;
    getNotifications(): Promise<Array<Notification>>;
    getPerformanceData(): Promise<Array<PerformanceData>>;
    getStudentProfile(): Promise<StudentProfile | null>;
    getUserProfile(user: Principal): Promise<StudentProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: StudentProfile): Promise<void>;
    saveStudentProfile(profile: StudentProfile): Promise<void>;
    seedDemoData(): Promise<void>;
    sendMessage(input: ChatMessageInput): Promise<bigint>;
    submitAssignment(assignmentId: bigint): Promise<void>;
    updateSubject(subject: Subject): Promise<void>;
}
