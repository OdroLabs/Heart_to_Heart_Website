"use client";

import { useState } from "react";
import { Reply, Loader2, X } from "lucide-react";
import { replyToContactMessage } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "./toast";

export function ReplyMessageButton({
  messageId,
  toEmail,
  toName,
  subject,
}: {
  messageId: number;
  toEmail: string;
  toName: string;
  subject: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast, update } = useToast();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Reply"
        onClick={() => setOpen(true)}
      >
        <Reply className="h-4 w-4" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 text-left">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Reply to {toName}</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              action={async (fd) => {
                setSending(true);
                const toastId = toast({
                  title: "Sending…",
                  variant: "loading",
                });
                try {
                  const result = await replyToContactMessage(messageId, fd);
                  if (result.ok) {
                    update(toastId, {
                      title: "Reply sent",
                      variant: "success",
                    });
                    setOpen(false);
                  } else {
                    update(toastId, {
                      title: "Not sent",
                      description: result.error,
                      variant: "error",
                    });
                  }
                } catch {
                  update(toastId, {
                    title: "Not sent",
                    description:
                      "Could not reach the server. Check your connection and try again.",
                    variant: "error",
                  });
                } finally {
                  setSending(false);
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1.5">
                <Label className="text-[13px] text-muted-foreground font-medium">
                  To
                </Label>
                <Input value={toEmail} disabled className="bg-muted/40" />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reply-subject"
                  className="text-[13px] text-muted-foreground font-medium"
                >
                  Subject
                </Label>
                <Input
                  id="reply-subject"
                  name="subject"
                  defaultValue={subject ? `Re: ${subject}` : "Re: your message"}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="reply-body"
                  className="text-[13px] text-muted-foreground font-medium"
                >
                  Message
                </Label>
                <Textarea id="reply-body" name="body" rows={6} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
