import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

/*
  Which task sections are advertised in the interface.

  This is presentation only. Task support, routing and data fetching are
  untouched — `/profile` and `/profile/<slug>` still render exactly as before,
  and profile posts still flow through search and related feeds. The keys below
  simply never appear as a navigation link, chip or picker button.
*/
export const hiddenNavTasks: readonly TaskKey[] = ['profile']

export function isNavVisibleTask(key: TaskKey) {
  return !hiddenNavTasks.includes(key)
}

/** Enabled task sections, minus the ones hidden from the interface. */
export function navTasks() {
  return SITE_CONFIG.tasks.filter((task) => task.enabled && isNavVisibleTask(task.key))
}
