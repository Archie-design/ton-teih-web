"use client";

import { useState } from "react";

interface SubmitStatus {
    type: string;
    msg: string;
}

export function useContactForm(opts?: { onSuccess?: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
        type: "",
        msg: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: "", msg: "" });

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Submission failed");

            setSubmitStatus({
                type: "success",
                msg: "感謝您的諮詢！我們將儘快與您聯繫。",
            });
            form.reset();

            if (opts?.onSuccess) {
                setTimeout(opts.onSuccess, 3000);
            } else {
                setTimeout(() => setSubmitStatus({ type: "", msg: "" }), 5000);
            }
        } catch (err) {
            console.error("Submission error:", err);
            setSubmitStatus({ type: "error", msg: "發送失敗，請稍後再試。" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return { isSubmitting, submitStatus, handleSubmit };
}
