import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  onError: () => void
}

class ModalErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export default ModalErrorBoundary
