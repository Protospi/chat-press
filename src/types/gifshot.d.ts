declare module 'gifshot' {
  interface GifshotOptions {
    images: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
  }

  interface GifshotResponse {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image?: string;
  }

  interface Gifshot {
    createGIF(
      options: GifshotOptions,
      callback: (response: GifshotResponse) => void
    ): void;
  }

  const gifshot: Gifshot;
  export default gifshot;
} 