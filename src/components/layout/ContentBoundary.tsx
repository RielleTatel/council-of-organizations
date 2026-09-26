import { Component, type ReactNode } from "react";

export function ContentUnavailable({ retry }: { retry?: () => void }) {
  return (
    <section className="mx-auto max-w-[700px] px-6 py-32 text-center">
      <h1 className="font-display text-3xl text-trust-blue">
        Content is unavailable
      </h1>
      <p className="mt-4 font-body text-fabric-dark">
        We could not load the published website content. Please try again.
      </p>
      <button
        className="cms-btn mt-6"
        onClick={retry ?? (() => window.location.reload())}
      >
        Try again
      </button>
    </section>
  );
}
export class ContentBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <ContentUnavailable /> : this.props.children;
  }
}
