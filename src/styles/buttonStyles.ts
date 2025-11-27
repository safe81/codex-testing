// Using const assertions to give TS a more specific type
export const baseButton =
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed text-sm' as const;

export const primaryButton =
  `${baseButton} px-5 py-3 bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-600 shadow-lg shadow-pink-900/20` as const;

export const secondaryButton =
  `${baseButton} px-4 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500` as const;
  
export const successButton =
  `${baseButton} px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500` as const;

export const ghostButton =
  `${baseButton} px-3 py-1 bg-transparent text-gray-400 hover:text-white focus:ring-gray-400` as const;
