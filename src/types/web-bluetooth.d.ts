// Web Bluetooth API Type Declarations for TypeScript (tsc) compilation
/// <reference types="web-bluetooth" />

export {};

declare global {
  interface Navigator {
    bluetooth?: Bluetooth;
  }
}
