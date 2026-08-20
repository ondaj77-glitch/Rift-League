import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Rift Legacy App Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleClearData = () => {
    localStorage.removeItem('rift-legacy-save-v2');
    localStorage.removeItem('rift-legacy-career');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-4 shadow-2xl">
            <div className="text-5xl">⚙️</div>
            <h2 className="text-2xl font-black text-amber-400 font-heading">
              Něco se pokazilo / An Error Occurred
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Došlo k nečekané chybě vykreslení. Můžeš obnovit aplikaci bez ztráty postupu nebo resetovat data, pokud byla poškozena.
            </p>
            {this.state.error && (
              <pre className="text-[11px] text-left bg-slate-950 p-3 rounded-lg border border-slate-800 text-red-400 overflow-x-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg"
              >
                🔄 Obnovit Hru (Reload)
              </button>
              <button
                onClick={this.handleClearData}
                className="bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-400 border border-slate-700 py-2.5 px-4 rounded-xl text-xs transition-all font-semibold"
              >
                Nová Hra / Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
