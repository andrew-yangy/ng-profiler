declare const Zone;

export function scheduleOutsideOfZone(scheduledFn: () => void) {
  Zone.root.run(() => new Promise(r => r()).then(() => scheduledFn()));
}