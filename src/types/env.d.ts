declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONVEX_DEPLOYMENT: string;
      NEXT_PUBLIC_CONVEX_URL: string;
      NEXT_GEMINI_API_KEY: string;
      NEXT_PUBLIC_VIRTUAL_NUMBER: string;
    }
  }
}


export { }