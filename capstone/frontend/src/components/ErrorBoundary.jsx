import { Component } from "react";

// Catches render-time errors anywhere below it so a single component
// failure shows a friendly fallback instead of a blank white screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex min-h-screen items-center justify-center bg-cream px-4 dark:bg-night-soft">
          <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-card dark:bg-night-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream text-4xl dark:bg-night">
              ⚠️
            </div>
            <h1 className="mt-6 text-2xl font-extrabold dark:text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-muted dark:text-white/60">
              An unexpected error occurred. Please try again.
            </p>
            <button onClick={this.handleReload} className="btn-primary mt-6">
              Back to home
            </button>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
