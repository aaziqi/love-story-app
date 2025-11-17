import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    // no-op
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 text-gray-800">
          <div className="max-w-md text-center">
            <div className="text-2xl font-bold mb-3">页面加载出错</div>
            <div className="text-sm mb-4">{String(this.state.error || '')}</div>
            <button className="px-4 py-2 rounded-lg bg-deepPink text-white" onClick={() => window.location.reload()}>刷新重试</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}