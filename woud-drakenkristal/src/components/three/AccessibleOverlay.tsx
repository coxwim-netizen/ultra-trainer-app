/**
 * The keyboard/screen-reader path for a 3D scene. A WebGL <canvas> is opaque
 * to the accessibility tree, so every 3D interactive scene renders this as a
 * DOM SIBLING of its <Canvas> (never nested inside it, e.g. not via drei's
 * <Html>) - that keeps this fully independent of whether WebGL/R3F mounts at
 * all, which matters both for real screen-reader users and for tests (jsdom
 * cannot mount <Canvas> - see Spike3D findings, Stage 0).
 *
 * Visually hidden, not display:none, so it stays in the accessibility tree
 * and is reachable by Tab. Since these buttons are never visible to a
 * pointer/touch user, there is no gesture to bypass here - unlike the 2D
 * mechanics' keyboardOnlyActivation() trick, a plain onClick is correct.
 */
export interface AccessibleOverlayTarget {
  id: string
  label: string
  onActivate: () => void
  disabled?: boolean
}

interface AccessibleOverlayProps {
  groupLabel: string
  targets: AccessibleOverlayTarget[]
}

export function AccessibleOverlay({ groupLabel, targets }: AccessibleOverlayProps) {
  return (
    <div className="visually-hidden" role="group" aria-label={groupLabel}>
      {targets.map((target) => (
        <button type="button" key={target.id} disabled={target.disabled} onClick={target.onActivate}>
          {target.label}
        </button>
      ))}
    </div>
  )
}
