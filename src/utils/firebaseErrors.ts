import { FirebaseError } from 'firebase/app';

// Helper to translate Firebase error codes into user-friendly, translatable keys.
export const getFirebaseErrorTranslationKey = (error: unknown): string => {
  if (!(error instanceof FirebaseError)) {
    return 'errors.generic';
  }

  // Default key for unhandled codes
  const defaultKey = 'errors.generic';

  console.debug("[Firebase Error Handler] Code:", error.code);

  switch (error.code) {
    // --- AUTH ---
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'errors.auth.invalid_credential';
    
    case 'auth/too-many-requests':
      return 'errors.auth.too_many_requests';
      
    case 'auth/network-request-failed':
      return 'errors.auth.network_request_failed';

    case 'auth/email-already-in-use':
      return 'errors.auth.email_in_use';

    case 'auth/weak-password':
      return 'errors.auth.weak_password';
      
    case 'auth/invalid-email':
      return 'errors.auth.invalid_email';

    // --- STORAGE ---
    case 'storage/unauthorized':
      return 'errors.storage.unauthorized';

    // This is the generic CORS error often seen with misconfigured buckets or billing issues
    case 'storage/object-not-found': // Often a symptom of the CORS/Bucket issue
    case 'storage/unknown': // Catch-all for storage issues
      // A more specific check for the CORS message
      if (error.message.includes('CORS')) {
        return 'errors.storage.cors_or_bucket_error';
      }
      return 'errors.storage.generic';

    // --- FIRESTORE ---
    case 'permission-denied':
      return 'errors.firestore.permission_denied';

    default:
      console.warn(`[Firebase Error Handler] Unhandled error code: ${error.code}`);
      return defaultKey;
  }
};
