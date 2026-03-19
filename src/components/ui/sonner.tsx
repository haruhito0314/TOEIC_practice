import { Toaster as SonnerToaster } from "sonner";

export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      richColors
      toastOptions={{
        style: {
          fontFamily: "'Noto Sans JP', sans-serif",
          borderRadius: "12px",
        },
      }}
      {...props}
    />
  );
}
