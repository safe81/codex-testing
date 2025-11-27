import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatusBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="bg-red-800 text-white text-center p-2 text-sm">
      Sem ligação à internet. Algumas funcionalidades podem não funcionar.
    </div>
  );
}
