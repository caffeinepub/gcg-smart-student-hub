import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type UserRole = AccessControl.UserRole;

  type StudentProfile = {
    name : Text;
    course : Text;
    year : Nat;
    studentId : Text;
    phone : Text;
    email : Text;
    profileImage : Text;
  };

  type Subject = {
    id : Nat;
    name : Text;
    professorName : Text;
    examDate : Time.Time;
    practicalDate : Time.Time;
    attendancePercent : Nat;
    marksObtained : Nat;
    maxMarks : Nat;
    isCompleted : Bool;
  };

  type Assignment = {
    id : Nat;
    subjectId : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    isSubmitted : Bool;
    submittedAt : ?Time.Time;
  };

  type CalendarEventType = {
    #exam;
    #assignment;
    #practical;
    #holiday;
  };

  type CalendarEvent = {
    id : Nat;
    title : Text;
    date : Time.Time;
    eventType : CalendarEventType;
    description : Text;
  };

  type ChatMessage = {
    id : Nat;
    senderId : Principal;
    receiverId : Principal;
    content : Text;
    timestamp : Time.Time;
    isRead : Bool;
  };

  type NotificationType = {
    #assignmentReminder;
    #examReminder;
    #general;
  };

  type Notification = {
    id : Nat;
    title : Text;
    message : Text;
    notificationType : NotificationType;
    timestamp : Time.Time;
    isRead : Bool;
  };

  type PerformanceData = {
    subjectId : Nat;
    month : Nat;
    attendancePercent : Nat;
    marksPercent : Nat;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let studentProfiles = Map.empty<Principal, StudentProfile>();
  let subjects = Map.empty<Nat, Subject>();
  let assignments = Map.empty<Nat, Assignment>();
  let calendarEvents = Map.empty<Nat, CalendarEvent>();
  let chatMessages = Map.empty<Nat, ChatMessage>();
  let userNotifications = Map.empty<Principal, List.List<Notification>>();
  let performanceDataStore = Map.empty<Principal, List.List<PerformanceData>>();

  var nextSubjectId = 1;
  var nextAssignmentId = 1;
  var nextCalendarEventId = 1;
  var nextChatMessageId = 1;
  var nextNotificationId = 1;

  // Helper Modules
  module StudentProfile {
    public func compare(a : StudentProfile, b : StudentProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module Subject {
    public func compare(a : Subject, b : Subject) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module Assignment {
    public func compare(a : Assignment, b : Assignment) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  module CalendarEvent {
    public func compare(a : CalendarEvent, b : CalendarEvent) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  module ChatMessage {
    public func compare(a : ChatMessage, b : ChatMessage) : Order.Order {
      if (a.timestamp < b.timestamp) { #less } else if (a.timestamp > b.timestamp) {
        #greater
      } else { #equal };
    };
  };

  module Notification {
    public func compare(a : Notification, b : Notification) : Order.Order {
      Text.compare(a.title, b.title);
    };
  };

  public type ChatMessageInput = {
    receiverId : Principal;
    content : Text;
  };

  // Required Profile Functions (matching frontend expectations)
  public query ({ caller }) func getCallerUserProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their own profile");
    };
    studentProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?StudentProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    studentProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their own profile");
    };
    studentProfiles.add(caller, profile);
  };

  // Legacy Student Profile Functions (kept for backward compatibility)
  public query ({ caller }) func getStudentProfile() : async ?StudentProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their own profile");
    };
    studentProfiles.get(caller);
  };

  public query ({ caller }) func getAllStudentProfiles() : async [StudentProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all student profiles");
    };
    studentProfiles.values().toArray().sort();
  };

  public shared ({ caller }) func saveStudentProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their own profile");
    };
    studentProfiles.add(caller, profile);
  };

  // Subject Functions
  public query ({ caller }) func getAllSubjects() : async [Subject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access subjects");
    };
    subjects.values().toArray().sort();
  };

  public shared ({ caller }) func createSubject(subject : Subject) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create subjects");
    };

    let newSubject = {
      subject with
      id = nextSubjectId;
    };
    subjects.add(nextSubjectId, newSubject);
    nextSubjectId += 1;
    newSubject.id;
  };

  public shared ({ caller }) func updateSubject(subject : Subject) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update subjects");
    };
    if (not subjects.containsKey(subject.id)) {
      Runtime.trap("Subject not found");
    };
    subjects.add(subject.id, subject);
  };

  // Assignment Functions
  public query ({ caller }) func getAllAssignments() : async [Assignment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access assignments");
    };
    assignments.values().toArray().sort();
  };

  public shared ({ caller }) func createAssignment(assignment : Assignment) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create assignments");
    };

    let newAssignment = {
      assignment with
      id = nextAssignmentId;
      isSubmitted = false;
      submittedAt = null;
    };
    assignments.add(nextAssignmentId, newAssignment);
    nextAssignmentId += 1;
    newAssignment.id;
  };

  public shared ({ caller }) func submitAssignment(assignmentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit assignments");
    };
    switch (assignments.get(assignmentId)) {
      case (null) { Runtime.trap("Assignment not found") };
      case (?assignment) {
        let updatedAssignment = {
          assignment with
          isSubmitted = true;
          submittedAt = ?Time.now();
        };
        assignments.add(assignmentId, updatedAssignment);
      };
    };
  };

  // Calendar Event Functions
  public query ({ caller }) func getAllCalendarEvents() : async [CalendarEvent] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access calendar events");
    };
    calendarEvents.values().toArray().sort();
  };

  public shared ({ caller }) func createCalendarEvent(event : CalendarEvent) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create calendar events");
    };

    let newEvent = {
      event with
      id = nextCalendarEventId;
    };
    calendarEvents.add(nextCalendarEventId, newEvent);
    nextCalendarEventId += 1;
    newEvent.id;
  };

  // Chat Functions
  public query ({ caller }) func getChatHistory(withUser : Principal) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat history");
    };
    chatMessages.values().toArray().sort().filter(
      func(message) {
        (message.senderId == caller and message.receiverId == withUser) or (message.senderId == withUser and message.receiverId == caller)
      }
    );
  };

  public shared ({ caller }) func sendMessage(input : ChatMessageInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let newMessage : ChatMessage = {
      id = nextChatMessageId;
      senderId = caller;
      receiverId = input.receiverId;
      content = input.content;
      timestamp = Time.now();
      isRead = false;
    };
    chatMessages.add(nextChatMessageId, newMessage);
    nextChatMessageId += 1;
    newMessage.id;
  };

  // Notification Functions
  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their notifications");
    };
    switch (userNotifications.get(caller)) {
      case (null) { [] };
      case (?notifications) {
        notifications.toArray().sort();
      };
    };
  };

  public shared ({ caller }) func addNotification(notification : Notification, receiver : Principal) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can send notifications");
    };

    let newNotification = {
      notification with
      id = nextNotificationId;
      timestamp = Time.now();
      isRead = false;
    };

    let existingNotifications = switch (userNotifications.get(receiver)) {
      case (null) { List.empty<Notification>() };
      case (?notifs) { notifs };
    };

    existingNotifications.add(newNotification);
    userNotifications.add(receiver, existingNotifications);

    nextNotificationId += 1;
    newNotification.id;
  };

  // Performance Data Functions
  public query ({ caller }) func getPerformanceData() : async [PerformanceData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their performance data");
    };
    switch (performanceDataStore.get(caller)) {
      case (null) { [] };
      case (?data) { data.toArray() };
    };
  };

  public shared ({ caller }) func addPerformanceData(data : PerformanceData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add their performance data");
    };

    let existingData = switch (performanceDataStore.get(caller)) {
      case (null) { List.empty<PerformanceData>() };
      case (?pdata) { pdata };
    };

    existingData.add(data);
    performanceDataStore.add(caller, existingData);
  };

  // Seed Demo Data
  public shared ({ caller }) func seedDemoData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed demo data");
    };

    // Seed Subjects
    let biology : Subject = {
      id = nextSubjectId;
      name = "Biology";
      professorName = "Dr. Shilpa";
      examDate = Time.now();
      practicalDate = Time.now();
      attendancePercent = 85;
      marksObtained = 80;
      maxMarks = 100;
      isCompleted = false;
    };
    subjects.add(nextSubjectId, biology);
    nextSubjectId += 1;

    let chemistry : Subject = {
      biology with
      id = nextSubjectId;
      name = "Chemistry";
      professorName = "Dr. Priya";
    };
    subjects.add(nextSubjectId, chemistry);
    nextSubjectId += 1;

    let physics : Subject = {
      chemistry with
      id = nextSubjectId;
      name = "Physics";
      professorName = "Dr. Ghanshyam";
    };
    subjects.add(nextSubjectId, physics);
    nextSubjectId += 1;

    // Seed Assignments
    let assignment1 : Assignment = {
      id = nextAssignmentId;
      subjectId = 1;
      title = "Biology Assignment 1";
      description = "Complete the chapter on cells";
      dueDate = Time.now() + 60480000000000; // 1 week
      isSubmitted = false;
      submittedAt = null;
    };
    assignments.add(nextAssignmentId, assignment1);
    nextAssignmentId += 1;

    let assignment2 : Assignment = {
      id = nextAssignmentId;
      subjectId = 2;
      title = "Chemistry Lab Report";
      description = "Submit the experiment report";
      dueDate = Time.now() + 120960000000000; // 2 weeks
      isSubmitted = false;
      submittedAt = null;
    };
    assignments.add(nextAssignmentId, assignment2);
    nextAssignmentId += 1;

    // Seed Calendar Events
    let examEvent : CalendarEvent = {
      id = nextCalendarEventId;
      title = "Biology Exam";
      date = Time.now() + 2592000000000000; // 1 month
      eventType = #exam;
      description = "Final exam for biology";
    };
    calendarEvents.add(nextCalendarEventId, examEvent);
    nextCalendarEventId += 1;

    let holidayEvent : CalendarEvent = {
      id = nextCalendarEventId;
      title = "Summer Vacation";
      date = Time.now() + 604800000000000; // 1 week
      eventType = #holiday;
      description = "Start of summer vacation";
    };
    calendarEvents.add(nextCalendarEventId, holidayEvent);
    nextCalendarEventId += 1;
  };
};
