import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGuard } from "~/components/AuthGuard";

export const Route = createFileRoute("/dashboard/voice")({
  component: () => (
    <AuthGuard>
      <VoiceRecording />
    </AuthGuard>
  ),
});

function VoiceRecording() {
  const [step, setStep] = useState<"intro" | "recording" | "done">("intro");
  const [isRecording, setIsRecording] = useState(false);

  const script = `Once upon a time, in a land not too far away, there lived a brave little child named Leo. Every night, Leo would look up at the stars and wonder what adventures awaited. Tonight was going to be special—the biggest adventure yet.`;

  const startRecording = () => {
    setStep("recording");
    setIsRecording(true);
    // TODO: Wire up actual browser MediaRecorder API
    setTimeout(() => {
      setIsRecording(false);
      setStep("done");
    }, 3000);
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Voice Recording</span>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Record Your Voice</h1>
          <p className="mt-3 text-gray-400">
            Read this short script aloud. It takes about 3 minutes and lets us
            narrate every story in your voice.
          </p>
        </div>

        {step === "intro" && (
          <div className="mt-10">
            {/* Tips */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: "🔇", title: "Quiet Space", desc: "Find a quiet room with minimal background noise." },
                { icon: "🎙️", title: "Natural Voice", desc: "Speak naturally — like you're reading to your child." },
                { icon: "😊", title: "Have Fun", desc: "Use different voices for characters. Your child will love it!" },
              ].map((tip) => (
                <div key={tip.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <div className="mb-2 text-2xl">{tip.icon}</div>
                  <h3 className="text-sm font-semibold text-white">{tip.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">{tip.desc}</p>
                </div>
              ))}
            </div>

            {/* Script preview */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="mb-3 text-sm font-semibold text-white">📝 Your Script</h3>
              <div className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-gray-300">
                {script}
              </div>
            </div>

            <button
              onClick={startRecording}
              className="mx-auto mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r bg-golden-amber px-8 py-3.5 text-base font-semibold text-white transition-all hover:hover:bg-amber-400"
            >
              🎤 Start Recording
            </button>
          </div>
        )}

        {step === "recording" && (
          <div className="mt-10 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-lavender-soft bg-lavender-soft/10 animate-pulse">
              <span className="text-5xl">🎤</span>
            </div>
            <p className="mt-6 text-lg font-semibold text-white">Recording...</p>
            <p className="mt-2 text-sm text-gray-400">
              Read the script naturally. We'll stop automatically after 3 minutes.
            </p>
            <div className="mx-auto mt-6 h-2 w-full max-w-md rounded-full bg-white/5">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-golden-amber to-lavender-soft" />
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="mt-10 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
              <span className="text-5xl">✅</span>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">Voice Recorded!</h2>
            <p className="mt-2 text-gray-400">
              Your voice has been captured. Every story from now on will be narrated by you.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => setStep("intro")}
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Re-record
              </button>
              <Link
                to="/dashboard/library"
                className="rounded-xl bg-gradient-to-r bg-golden-amber px-6 py-3 text-sm font-semibold text-white transition-all hover:hover:bg-amber-400"
              >
                Generate Your First Story →
              </Link>
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="mt-10 rounded-xl border border-lavender-soft/20 bg-lavender-soft/5 p-4">
          <p className="text-xs text-lavender-soft">
            🔒 Your voice recording is encrypted and used only for your account.
            You can delete it anytime from settings.
          </p>
        </div>
      </div>
    </div>
  );
}