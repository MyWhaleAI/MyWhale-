"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Clock, Mail, MessageSquare, Smartphone, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateFollowerPreferences } from "@/actions/follower-actions";
import { useToast } from "@/hooks/use-toast";

interface SettingsSidebarProps {
  onClose?: () => void;
}

// Define the preferences type with default values
const DEFAULT_PREFERENCES = {
  alerts: {
    buys: true,
    mints: true,
    staking: true,
    governance: true,
  },
  delivery: {
    email: true,
    telegram: true,
    sms: false,
  },
  timeSettings: {
    timezone: "UTC (GMT+0)",
    frequency: "Real-time",
  },
};

// Define the preferences type
interface NotificationPreferences {
  alerts: {
    buys: boolean;
    mints: boolean;
    staking: boolean;
    governance: boolean;
  };
  delivery: {
    email: boolean;
    telegram: boolean;
    sms: boolean;
  };
  timeSettings: {
    timezone: string;
    frequency: string;
  };
}

export function SettingsSidebar({ onClose }: SettingsSidebarProps) {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Fetch user preferences when wallet connects
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!publicKey) return;

      try {
        // This would be replaced with a real API call to get user preferences
        const response = await fetch(`/api/followers/${publicKey.toString()}/preferences`);
        if (response.ok) {
          const data = await response.json();
          // Ensure we have complete preferences with defaults for missing values
          setPreferences({
            alerts: {
              buys: data.preferences?.alerts?.buys ?? true,
              mints: data.preferences?.alerts?.mints ?? true,
              staking: data.preferences?.alerts?.staking ?? true,
              governance: data.preferences?.alerts?.governance ?? true,
            },
            delivery: {
              email: data.preferences?.delivery?.email ?? true,
              telegram: data.preferences?.delivery?.telegram ?? true,
              sms: data.preferences?.delivery?.sms ?? false,
            },
            timeSettings: {
              timezone: data.preferences?.timeSettings?.timezone ?? "UTC (GMT+0)",
              frequency: data.preferences?.timeSettings?.frequency ?? "Real-time",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        // If there's an error, ensure we have default values
        setPreferences(DEFAULT_PREFERENCES);
      }
    };

    fetchPreferences();
  }, [publicKey]);

  const handleSavePreferences = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to save preferences",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateFollowerPreferences(publicKey.toString(), preferences);

      if (result.success) {
        toast({
          title: "Preferences saved",
          description: "Your notification preferences have been updated",
          variant: "default",
        });
      } else {
        throw new Error(result.error || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateAlertPreference = (key: keyof typeof preferences.alerts, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      alerts: {
        ...prev.alerts,
        [key]: value,
      },
    }));
  };

  const updateDeliveryPreference = (key: keyof typeof preferences.delivery, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [key]: value,
      },
    }));
  };

  const updateTimeSettings = (key: keyof typeof preferences.timeSettings, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      timeSettings: {
        ...prev.timeSettings,
        [key]: value,
      },
    }));
  };

  // Ensure we have valid preferences with fallbacks
  const safePreferences = {
    alerts: preferences?.alerts || DEFAULT_PREFERENCES.alerts,
    delivery: preferences?.delivery || DEFAULT_PREFERENCES.delivery,
    timeSettings: preferences?.timeSettings || DEFAULT_PREFERENCES.timeSettings,
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
            <Settings className="h-4 w-4 text-gray-700" />
          </div>
          <span className="text-base font-bold text-gray-800">Settings</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Alert Preferences</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                <Bell className="h-3 w-3 text-teal-600" />
              </div>
              <Label htmlFor="buys" className="text-gray-700 text-xs">
                Buys
              </Label>
            </div>
            <Switch id="buys" checked={safePreferences.alerts.buys} onCheckedChange={(checked) => updateAlertPreference("buys", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-purple-600">
                  <path d="M12 22V8"></path>
                  <path d="m5 12 7-4 7 4"></path>
                  <path d="M5 16l7-4 7 4"></path>
                  <path d="M5 20l7-4 7 4"></path>
                </svg>
              </div>
              <Label htmlFor="mints" className="text-gray-700 text-xs">
                Mints
              </Label>
            </div>
            <Switch id="mints" checked={safePreferences.alerts.mints} onCheckedChange={(checked) => updateAlertPreference("mints", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-blue-600">
                  <path d="M12 2v20"></path>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <Label htmlFor="staking" className="text-gray-700 text-xs">
                Staking
              </Label>
            </div>
            <Switch id="staking" checked={safePreferences.alerts.staking} onCheckedChange={(checked) => updateAlertPreference("staking", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-amber-600">
                  <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
                  <path d="m13 13 6 6"></path>
                </svg>
              </div>
              <Label htmlFor="governance" className="text-gray-700 text-xs">
                Governance
              </Label>
            </div>
            <Switch id="governance" checked={safePreferences.alerts.governance} onCheckedChange={(checked) => updateAlertPreference("governance", checked)} />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Delivery Method</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                <Mail className="h-3 w-3 text-teal-600" />
              </div>
              <Label htmlFor="email" className="text-gray-700 text-xs">
                Email
              </Label>
            </div>
            <Switch id="email" checked={safePreferences.delivery.email} onCheckedChange={(checked) => updateDeliveryPreference("email", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-blue-600" />
              </div>
              <Label htmlFor="telegram" className="text-gray-700 text-xs">
                Telegram
              </Label>
            </div>
            <Switch id="telegram" checked={safePreferences.delivery.telegram} onCheckedChange={(checked) => updateDeliveryPreference("telegram", checked)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                <Smartphone className="h-3 w-3 text-gray-600" />
              </div>
              <div>
                <Label htmlFor="sms" className="text-gray-700 text-xs">
                  SMS
                </Label>
                <p className="text-xs text-gray-500">Coming soon</p>
              </div>
            </div>
            <Switch id="sms" disabled checked={safePreferences.delivery.sms} onCheckedChange={(checked) => updateDeliveryPreference("sms", checked)} />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Time Settings</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="h-3 w-3 text-purple-600" />
              </div>
              <Label htmlFor="timezone" className="text-gray-700 text-xs">
                Time Zone
              </Label>
            </div>
            <select
              id="timezone"
              className="text-xs bg-gray-100 border-0 rounded-lg px-2 py-1 text-gray-700"
              value={safePreferences.timeSettings.timezone}
              onChange={(e) => updateTimeSettings("timezone", e.target.value)}>
              <option>UTC (GMT+0)</option>
              <option>EST (GMT-5)</option>
              <option>PST (GMT-8)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Bell className="h-3 w-3 text-emerald-600" />
              </div>
              <Label htmlFor="frequency" className="text-gray-700 text-xs">
                Alert Frequency
              </Label>
            </div>
            <select
              id="frequency"
              className="text-xs bg-gray-100 border-0 rounded-lg px-2 py-1 text-gray-700"
              value={safePreferences.timeSettings.frequency}
              onChange={(e) => updateTimeSettings("frequency", e.target.value)}>
              <option>Real-time</option>
              <option>Hourly digest</option>
              <option>Daily digest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <Button className="w-full flex items-center justify-center gap-2" onClick={handleSavePreferences} disabled={isSaving || !publicKey}>
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
