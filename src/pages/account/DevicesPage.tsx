import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone, Monitor, Loader2, AlertCircle, ArrowLeft,
  Trash2, Plus, Shield, CheckCircle, XCircle,
} from "lucide-react";
import { authClient, getErrorMessage } from "@/lib/api";
import type { DeviceView, ApiError } from "@/lib/types";
import { PortalLayout } from "@/pages/account/AccountPages";

// ── Auth Guard ──────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!authClient.isAuthenticated()) {
        navigate("/login", { replace: true });
        return;
      }
      setChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (checking) {
    return (
      <PortalLayout title="Devices">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PortalLayout>
    );
  }

  return <>{children}</>;
}

function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="bg-card border-border border-red-500/20">
      <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button size="sm" variant="outline" className="text-xs" onClick={onRetry}>
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ── Devices Page (/account/devices) ──────────────────────────────────
export function DevicesPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<DeviceView[]>([]);
  const [deviceLimit, setDeviceLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authClient.getDevices();
      setDevices(res.devices ?? []);
      setDeviceLimit(res.device_limit);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(getErrorMessage(apiErr));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authClient.isAuthenticated()) fetchDevices();
  }, []);

  const handleRevoke = async (deviceId: string) => {
    setRevokingId(deviceId);
    setProcessingAction(true);
    try {
      await authClient.revokeDevice(deviceId);
      setDevices((prev) => prev.filter((d) => d.device_id !== deviceId));
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(getErrorMessage(apiErr));
    } finally {
      setRevokingId(null);
      setProcessingAction(false);
    }
  };

  const handleAddDevice = async () => {
    setProcessingAction(true);
    setError(null);
    try {
      const newDev = await authClient.addDevice("New Device", "unknown");
      setDevices((prev) => [...prev, newDev]);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(getErrorMessage(apiErr));
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout title="Devices">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PortalLayout>
    );
  }

  if (error) {
    return (
      <PortalLayout title="Devices">
        <ErrorBox message={error} onRetry={fetchDevices} />
      </PortalLayout>
    );
  }

  const devicesUsed = devices.length;

  return (
    <AuthGuard>
      <PortalLayout title="Devices">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/account")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Devices</h1>
              <p className="text-sm text-muted-foreground">Manage devices connected to your account</p>
            </div>
          </div>

          {/* Device usage */}
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-500" />
                  <span className="text-sm text-foreground font-medium">Device Limit</span>
                </div>
                <span className="text-sm text-foreground">
                  {devicesUsed} / {deviceLimit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (devicesUsed / deviceLimit) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add device button */}
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-8"
              onClick={handleAddDevice}
              disabled={processingAction || devicesUsed >= deviceLimit}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Device
            </Button>
          </div>

          {/* Device list */}
          {devices.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Smartphone className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No devices connected yet.</p>
                <Button
                  size="sm"
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white text-xs"
                  onClick={handleAddDevice}
                  disabled={processingAction}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Your First Device
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {devices.map((dev) => (
                <div
                  key={dev.device_id}
                  className="flex items-center justify-between rounded border border-border bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    {dev.platform.toLowerCase().includes("ios") ||
                    dev.platform.toLowerCase().includes("ipados") ||
                    dev.platform.toLowerCase().includes("iphone") ? (
                      <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-foreground">{dev.device_name}</p>
                        {dev.trusted ? (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0">
                            <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                            Trusted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-[10px] px-1.5 py-0">
                            Untrusted
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {dev.platform}
                        {dev.app_version && ` • v${dev.app_version}`}
                        {dev.last_active_at && ` • ${formatLastActive(dev.last_active_at)}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => handleRevoke(dev.device_id)}
                    disabled={revokingId === dev.device_id || processingAction}
                  >
                    {revokingId === dev.device_id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    <span className="ml-1 hidden sm:inline">Revoke</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PortalLayout>
    </AuthGuard>
  );
}

function formatLastActive(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}
