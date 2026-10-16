import { redirect } from 'next/navigation'

// Plan details live at /plans/[id]; this old route has no plan ID.
export default function LegacyPlanDetailPage() {
  redirect('/plans')
}
