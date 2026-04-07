/**
 * Responsive Layout Controller
 * Manages responsive layout adaptation across different device types
 */

export interface Breakpoints {
  mobile: number;    // 0-767px
  tablet: number;    // 768-1023px
  desktop: number;   // 1024px+
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveLayoutController {
  initialize(breakpoints: Breakpoints): void;
  getDeviceType(): DeviceType;
  onResize(callback: (deviceType: DeviceType) => void): void;
  applyLayout(deviceType: DeviceType): void;
  isTouchDevice(): boolean;
}

export class ResponsiveLayoutControllerImpl implements ResponsiveLayoutController {
  private breakpoints: Breakpoints = {
    mobile: 767,
    tablet: 1023,
    desktop: 1024
  };
  
  private resizeObserver: ResizeObserver | null = null;
  private resizeCallbacks: Array<(deviceType: DeviceType) => void> = [];
  private currentDeviceType: DeviceType = 'desktop';

  initialize(breakpoints: Breakpoints): void {
    this.breakpoints = breakpoints;
    this.currentDeviceType = this.getDeviceType();
    
    // Set up ResizeObserver for viewport changes
    this.resizeObserver = new ResizeObserver(() => {
      const newDeviceType = this.getDeviceType();
      if (newDeviceType !== this.currentDeviceType) {
        this.currentDeviceType = newDeviceType;
        this.applyLayout(newDeviceType);
        this.notifyResizeCallbacks(newDeviceType);
      }
    });
    
    // Observe the document body
    this.resizeObserver.observe(document.body);
    
    // Apply initial layout
    this.applyLayout(this.currentDeviceType);
  }

  getDeviceType(): DeviceType {
    const width = window.innerWidth;
    
    if (width <= this.breakpoints.mobile) {
      return 'mobile';
    } else if (width <= this.breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  onResize(callback: (deviceType: DeviceType) => void): void {
    this.resizeCallbacks.push(callback);
  }

  applyLayout(deviceType: DeviceType): void {
    // Update data attribute on body for CSS targeting
    document.body.setAttribute('data-device-type', deviceType);
    
    // Apply device-specific classes
    document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
    document.body.classList.add(`device-${deviceType}`);
  }

  isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }

  private notifyResizeCallbacks(deviceType: DeviceType): void {
    this.resizeCallbacks.forEach(callback => callback(deviceType));
  }

  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.resizeCallbacks = [];
  }
}
