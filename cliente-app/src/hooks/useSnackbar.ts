import { useState } from "react";

type SnackbarType = "error" | "success";

export function useSnackbar() {
  const [snack, setSnack] = useState<{ type: SnackbarType; msg: string } | null>(null);

  function showSnack(type: SnackbarType, msg: string) {
    setSnack({ type, msg });
    setTimeout(() => setSnack(null), 3500);
  }

  return { snack, showSnack };
}
