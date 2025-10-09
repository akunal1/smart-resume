import {
  ChatMessage,
  MeetingRequest,
  EmailRequest,
  Mode,
  AISummaryResponse,
  MeetingResponse,
  EmailResponse,
} from "../types";
import { MAX_CONVERSATION_LENGTH, MAX_MESSAGES_HISTORY } from "../consts";

class SchedulingController {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  // Generate AI summary from chat history
  async generateSummary(
    chatHistory: ChatMessage[]
  ): Promise<AISummaryResponse> {
    const recentMessages = chatHistory.slice(-MAX_MESSAGES_HISTORY);

    const response = await fetch(`${this.baseUrl}/api/ai/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatHistory: recentMessages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    return response.json();
  }

  // Schedule a meeting
  async scheduleMeeting(meetingData: MeetingRequest): Promise<MeetingResponse> {
    // Validate required fields
    if (
      !meetingData.userEmail ||
      !meetingData.dateISO ||
      !meetingData.endDateISO
    ) {
      throw new Error("Missing required meeting fields");
    }

    // Ensure attendees include both emails
    const attendees = Array.from(
      new Set([
        meetingData.userEmail,
        "mail.kunal71@gmail.com",
        ...meetingData.attendees.filter(
          (email) =>
            email !== meetingData.userEmail &&
            email !== "mail.kunal71@gmail.com"
        ),
      ])
    );

    const payload = {
      ...meetingData,
      attendees,
    };

    const response = await fetch(`${this.baseUrl}/api/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to schedule meeting: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Send email
  async sendEmail(emailData: EmailRequest): Promise<EmailResponse> {
    // Validate required fields
    if (!emailData.userEmail) {
      throw new Error("User email is required");
    }

    const response = await fetch(`${this.baseUrl}/api/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to send email: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Main handler that orchestrates the entire flow
  async handleSchedulingRequest(
    chatHistory: ChatMessage[],
    userData: MeetingRequest | EmailRequest,
    mode: Mode
  ): Promise<
    { summary: AISummaryResponse } & (MeetingResponse | EmailResponse)
  > {
    // Generate AI summary first
    const summary = await this.generateSummary(chatHistory);

    // Prepare conversation history (truncated if needed)
    const conversationText = this.formatConversationHistory(chatHistory);

    // Update the request data with summary and conversation
    const enrichedData = {
      ...userData,
      summary: summary.summary,
      conversation: conversationText,
    };

    // Execute the appropriate action
    if (mode === "meeting") {
      const meetingData = enrichedData as MeetingRequest;
      const result = await this.scheduleMeeting(meetingData);
      return { summary, ...result };
    } else {
      const emailData = enrichedData as EmailRequest;
      // Override subject if not provided
      if (!emailData.subject) {
        emailData.subject = summary.suggestedTitle || "Project Update";
      }
      const result = await this.sendEmail(emailData);
      return { summary, ...result };
    }
  }

  // Format conversation history for inclusion in email/meeting
  private formatConversationHistory(chatHistory: ChatMessage[]): string {
    const recentMessages = chatHistory.slice(-MAX_MESSAGES_HISTORY);
    let conversation = "";

    for (const message of recentMessages) {
      const timestamp = message.timestamp
        ? new Date(message.timestamp).toLocaleString()
        : "";
      const role = message.role === "user" ? "You" : "Assistant";
      conversation += `[${timestamp}] ${role}: ${message.content}\n\n`;
    }

    // Truncate if too long
    if (conversation.length > MAX_CONVERSATION_LENGTH) {
      conversation =
        conversation.substring(0, MAX_CONVERSATION_LENGTH) +
        "\n\n[Conversation truncated...]";
    }

    return conversation.trim();
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate meeting time is in the future
  validateMeetingTime(dateISO: string): boolean {
    const meetingTime = new Date(dateISO);
    const now = new Date();
    return meetingTime > now;
  }
}

export const schedulingController = new SchedulingController();
export default SchedulingController;
