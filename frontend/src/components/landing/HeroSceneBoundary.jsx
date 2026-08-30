import { Component } from 'react';
import HeroSceneFallback from './HeroSceneFallback';

class HeroSceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error internally without crashing UI or throwing alert
    console.error('HeroScene WebGL Boundary Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <HeroSceneFallback theme={this.props.theme} />;
    }

    return this.props.children;
  }
}

export default HeroSceneBoundary;
