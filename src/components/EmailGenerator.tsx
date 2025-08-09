"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Send, Sparkles, Users, AlertCircle, Check } from "lucide-react";

interface GeneratedEmail {
  subject: string;
  body: string;
}

export default function EmailGenerator() {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [currentRecipient, setCurrentRecipient] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const addRecipient = () => {
    if (
      currentRecipient &&
      currentRecipient.includes("@") &&
      !recipients.includes(currentRecipient)
    ) {
      setRecipients([...recipients, currentRecipient]);
      setCurrentRecipient("");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const generateEmail = async () => {
    if (!prompt.trim()) {
      setMessage("Please enter a prompt for the email");
      setMessageType("error");
      return;
    }

    setIsGenerating(true);
    setMessage("");

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate email");
      }

      setGeneratedEmail(data);
      setMessage("Email generated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to generate email"
      );
      setMessageType("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!generatedEmail || recipients.length === 0) {
      setMessage("Please generate an email and add recipients");
      setMessageType("error");
      return;
    }

    setIsSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          subject: generatedEmail.subject,
          body: generatedEmail.body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setMessage(data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to send email"
      );
      setMessageType("error");
    } finally {
      setIsSending(false);
    }
  };

  const updateEmailField = (field: "subject" | "body", value: string) => {
    if (generatedEmail) {
      setGeneratedEmail({
        ...generatedEmail,
        [field]: value,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-medium text-slate-800 tracking-tight">
              AI Emailinator
            </h1>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Generate personalized emails with AI and send them to multiple
            recipients instantly.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <Card
            className={`border-l-4 ${
              messageType === "success"
                ? "border-l-green-500 bg-green-50"
                : "border-l-red-500 bg-red-50"
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                {messageType === "success" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={`text-sm ${
                    messageType === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {message}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Recipients */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recipients
                </CardTitle>
                <CardDescription className="text-xs">
                  Add email addresses of recipients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={currentRecipient}
                    onChange={(e) => setCurrentRecipient(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                    className="text-sm"
                  />
                  <Button onClick={addRecipient} size="sm" variant="outline">
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recipients.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="text-xs px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeRecipient(email)}
                    >
                      {email} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email Prompt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Email Prompt
                </CardTitle>
                <CardDescription className="text-xs">
                  Describe what kind of email you want to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="e.g., Write a professional follow-up email after a meeting about project collaboration..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="text-sm"
                />
                <Button
                  onClick={generateEmail}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Email */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Generated Email
                </CardTitle>
                <CardDescription className="text-xs">
                  Review and edit your AI-generated email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedEmail ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        Subject
                      </label>
                      <Input
                        value={generatedEmail.subject}
                        onChange={(e) =>
                          updateEmailField("subject", e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">
                        Email Body
                      </label>
                      <Textarea
                        value={generatedEmail.body}
                        onChange={(e) =>
                          updateEmailField("body", e.target.value)
                        }
                        rows={8}
                        className="text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={sendEmail}
                        disabled={isSending || recipients.length === 0}
                        className="flex-1"
                      >
                        {isSending ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send to {recipients.length} recipient
                            {recipients.length !== 1 ? "s" : ""}
                          </>
                        )}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Email Preview</DialogTitle>
                            <DialogDescription>
                              How your email will appear to recipients
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium text-sm">Subject:</h3>
                              <p className="text-sm text-slate-600">
                                {generatedEmail.subject}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">Body:</h3>
                              <div className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded border">
                                {generatedEmail.body}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No email generated yet</p>
                    <p className="text-xs">
                      Create a prompt and click "Generate Email" to start
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
