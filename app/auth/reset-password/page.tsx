// app/auth/reset-password/page.tsx
import { Suspense } from "react"
import ResetPasswordPage from "./ResetPasswordPage"

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordPage />
    </Suspense>
  )
}
