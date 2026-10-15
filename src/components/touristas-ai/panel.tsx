import { useRouterState } from "@tanstack/react-router";
import { RideAIPlanner } from "@/components/ride-ai-planner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTouristasAi } from "./provider";

export function TouristasAiPanel({ className }: { className?: string }) {
  const { isOpen, openTouristas, closeTouristas, pendingPrompt } = useTouristasAi();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (/\/touristas-ai\/?$/.test(pathname)) return null;
  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => openTouristas()}
          className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-2xl bg-[#245BEB] px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:brightness-110 ${className || ""}`}
        >
          <img src="/brand/rider-icon-v3.png" alt="" width="28" height="28" />
          <span>Ride with AI</span>
        </button>
      )}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) closeTouristas();
        }}
      >
        <DialogContent className="h-[min(850px,94dvh)] max-w-2xl gap-0 overflow-hidden rounded-3xl border-0 p-0 [&>button]:hidden">
          <DialogTitle className="sr-only">Ride with AI</DialogTitle>
          <DialogDescription className="sr-only">
            Describe your transfer, choose exact places and review a proposal before payment.
          </DialogDescription>
          <RideAIPlanner initialPrompt={pendingPrompt} onClose={closeTouristas} />
        </DialogContent>
      </Dialog>
    </>
  );
}
export function BookingAssistant(props: { className?: string }) {
  return <TouristasAiPanel {...props} />;
}
