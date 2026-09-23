import { useState, useCallback } from "react";

const PRIMARY_STATES = [
  "REQUESTED",
  "QUEUED",
  "CHUNKING",
  "DEDUPLICATING",
  "UPLOADING",
  "COMMITTED",
  "VERIFIED",
  "COMPLETED"
];

export function useStateMachine() {
  const [activeState, setActiveState] = useState("COMMITTED");
  const [activeFile, setActiveFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const runStateSequence = useCallback((fileName = "thesis_draft.docx", onComplete) => {
    setIsProcessing(true);
    setActiveFile(fileName);
    setActiveState("REQUESTED");

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < PRIMARY_STATES.length) {
        setActiveState(PRIMARY_STATES[step]);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        if (onComplete) onComplete();
      }
    }, 700); // 700ms per state = ~5.6s full sequence
  }, []);

  return { activeState, activeFile, isProcessing, runStateSequence, setActiveState };
}
