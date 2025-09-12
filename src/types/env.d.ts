declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONVEX_DEPLOYMENT: string;
      NEXT_PUBLIC_CONVEX_URL: string;
      NEXT_GEMINI_API_KEY: string;
      NEXT_OPENAI_KEY: string;
      NEXT_PUBLIC_VIRTUAL_NUMBER: string;
      NEXT_VIRTUAL_NUMBER: string;
      NEXT_TWILIO_SID: string;
      NEXT_TWILIO_AUTH_TOKEN: string;
      BACKEND_PORT: string;
      NEXT_AWS_ACCESS_KEY_ID: string;
      NEXT_AWS_SECRET_ACCESS_KEY: string;
      NEXT_AWS_REGION: string;
    }
  }
}


export { }