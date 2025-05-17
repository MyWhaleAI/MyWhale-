"use client";

import type React from "react";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, Tag, Eye, EyeOff, MessageSquare, ExternalLink, Edit, Twitter, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { truncateAddress } from "@/lib/utils";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TopBar } from "@/components/top-bar";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { updateWhaleProfile, type WhaleProfileUpdateData } from "@/actions/profile-actions";

export default function WhaleDashboard() {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [monetizationModel, setMonetizationModel] = useState("free");
  const [whaleData, setWhaleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWhale, setIsWhale] = useState(false);
  const [formData, setFormData] = useState<WhaleProfileUpdateData>({
    displayName: whaleData?.display_name || "",
    bio: whaleData?.bio || "",
    twitter: whaleData?.twitter || "",
    telegram: whaleData?.telegram || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Fetch whale data when wallet connects
  useEffect(() => {
    async function fetchWhaleData() {
      if (!publicKey) {
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClientComponentClient();
        const walletAddress = publicKey.toString();

        // Check if user is an approved whale
        const { data, error } = await supabase.from("whale_applications").select("*").eq("wallet_address", walletAddress).eq("status", "approved").single();

        if (error) {
          console.error("Error fetching whale data:", error);
          setIsLoading(false);
          setIsWhale(false);
          return;
        }

        setWhaleData(data);
        setIsWhale(true);
        setIsLoading(false);

        // Set form data
        setFormData({
          displayName: data.display_name || "",
          bio: data.bio || "",
          twitter: data.twitter || "",
          telegram: data.telegram || "",
        });

        // Set monetization model if available
        if (data.monetization_model) {
          setMonetizationModel(data.monetization_model);
        }
      } catch (err) {
        console.error("Failed to fetch whale data:", err);
        setIsLoading(false);
        setIsWhale(false);
      }
    }

    fetchWhaleData();
  }, [publicKey]);

  // Mock data for the feed
  const feedItems = [
    {
      id: 1,
      time: "3m ago",
      action: "Bought $SOL",
      platform: "Jupiter",
      value: "$9,000",
      aiSummary: "Likely swing trade on volatility",
      hidden: false,
    },
    {
      id: 2,
      time: "2h ago",
      action: "Staked 3,200 SOL",
      platform: "Marinade",
      value: "—",
      aiSummary: "Signaling long-term yield farming",
      hidden: false,
    },
    {
      id: 3,
      time: "Yesterday",
      action: "Minted NFT",
      platform: "Mad Lads",
      value: "1 NFT",
      aiSummary: "Participating in hyped mint",
      hidden: false,
    },
  ];

  // If not connected, show connect wallet prompt
  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <TopBar />
        <Card className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-teal-500 to-blue-500 text-white">
            <h1 className="text-2xl font-bold mb-2">🐋 Whale Dashboard</h1>
            <p className="text-teal-50">Access your whale profile, stats, and monetization settings.</p>
          </div>
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Whale Access Only</h2>
            <p className="text-gray-600 mb-6">This dashboard is only accessible to verified whales. Please connect your wallet to continue.</p>
            <Button onClick={() => setVisible(true)} className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white flex items-center gap-2 mx-auto">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <TopBar />
        <Card className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Whale Dashboard</h2>
            <p className="text-gray-600">Please wait while we load your whale profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not a whale, show not authorized message
  if (!isWhale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <TopBar />
        <Card className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200 bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <h1 className="text-2xl font-bold mb-2">🐋 Whale Dashboard</h1>
            <p className="text-red-50">This dashboard is only for approved whales.</p>
          </div>
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Not Authorized</h2>
            <p className="text-gray-600 mb-6">Your wallet is not registered as an approved whale. Please apply to become a whale or use the regular dashboard.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => (window.location.href = "/apply")} className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                Apply to Become a Whale
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
                Go to User Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Save profile changes
  const saveProfileChanges = async () => {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      // Update monetization model in the form data
      const profileData = {
        ...formData,
        monetizationModel,
      };

      const result = await updateWhaleProfile(publicKey.toString(), profileData);

      if (result.success) {
        toast.success("Profile changes saved successfully!");
      } else {
        throw new Error(result.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use the TopBar component */}
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">🐋 Whale Dashboard</h1>
          <p className="text-gray-600">Manage your whale profile, view stats, and control monetization settings.</p>
        </div>

        {/* At-a-Glance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-teal-600" />
                </div>
              </div>
              <h3 className="text-gray-500 font-medium mb-1 text-sm">Followers</h3>
              <div className="text-2xl font-bold text-gray-800">{whaleData?.followers_count || 0}</div>
              <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>+{Math.floor(Math.random() * 50)} this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <h3 className="text-gray-500 font-medium mb-1 text-sm">Total Revenue</h3>
              <div className="text-2xl font-bold text-gray-800">${Math.floor(Math.random() * 5000)}</div>
              <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>+${Math.floor(Math.random() * 500)} last 7 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-500 font-medium mb-1 text-sm">30-Day ROI</h3>
              <div className="text-2xl font-bold text-gray-800">{whaleData?.roi || "+0%"}</div>
              <div className="flex items-center gap-1.5 text-emerald-600 mt-1 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>+{(Math.random() * 5).toFixed(1)}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <h3 className="text-gray-500 font-medium mb-1 text-sm">Strategy Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {whaleData?.tags?.map((tag: string, index: number) => (
                  <span key={index} className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                )) || (
                  <>
                    <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">DeFi</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">NFT</span>
                  </>
                )}
              </div>
              <div className="text-gray-500 mt-1 text-xs">Visible to followers</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="feed">Your Feed</TabsTrigger>
            <TabsTrigger value="monetization">Monetization</TabsTrigger>
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Feed Preview Tab */}
          <TabsContent value="feed" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Your Feed Preview</h2>
                <p className="text-gray-500 text-sm">What your followers see</p>
              </div>

              <div className="divide-y divide-gray-100">
                {feedItems.map((item) => (
                  <div key={item.id} className={`p-4 transition-colors hover:bg-gray-50 ${item.hidden ? "opacity-50" : ""}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {whaleData?.display_name?.substring(0, 2).toUpperCase() || "WH"}
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium text-sm">{whaleData?.display_name || "@Whale"}</div>
                          <div className="text-gray-500 text-xs">{item.time}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>

                    <div className="mb-2">
                      <div className="font-medium text-gray-800 text-sm">{item.action}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-gray-800">{item.value}</span>
                        {item.platform && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{item.platform}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-600 text-xs border-t border-gray-100 pt-2 mt-1">
                      <span className="font-medium text-teal-600">AI:</span> {item.aiSummary}
                    </div>

                    <div className="flex justify-end gap-1 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                        {item.hidden ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {item.hidden ? "Show" : "Hide"}
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Boost
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Graph */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Performance</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    7d
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg bg-teal-50 border-teal-200 text-teal-700">
                    30d
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    90d
                  </Button>
                </div>
              </div>

              <div className="p-4 h-64">
                <PerformanceChart />
              </div>
            </div>
          </TabsContent>

          {/* Monetization Tab */}
          <TabsContent value="monetization" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Monetization Settings</h2>
                <p className="text-gray-500 text-sm">Manage how you earn from your following</p>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-gray-800 font-medium mb-3">Monetization Model</h3>
                  <RadioGroup value={monetizationModel} onValueChange={setMonetizationModel} className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free" className="cursor-pointer">
                        Free Access
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <RadioGroupItem value="token" id="token" />
                      <Label htmlFor="token" className="cursor-pointer">
                        Token-gated (e.g. Hold 10 $WHALE)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                      <RadioGroupItem value="subscription" id="subscription" />
                      <Label htmlFor="subscription" className="cursor-pointer">
                        Subscription ($4.99/mo)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-800 font-medium">Payment Wallet</h3>
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm">{truncateAddress(publicKey?.toString() || "", 8, 8)}</div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-gray-800 font-medium">Tipping Enabled</h3>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-gray-500 text-sm">Allow followers to send you tips for valuable insights</p>
                </div>

                <div>
                  <h3 className="text-gray-800 font-medium mb-3">Recent Earnings</h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Last 7 days:</span>
                      <span className="font-bold text-gray-800">${Math.floor(Math.random() * 500)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Top Supporter:</span>
                      <span className="font-medium text-gray-800">@YieldChad</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Visibility Tab */}
          <TabsContent value="visibility" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Manage Visibility</h2>
                <p className="text-gray-500 text-sm">Decide what's shown in your public feed</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="token-transfers" defaultChecked />
                      <Label htmlFor="token-transfers" className="cursor-pointer">
                        Show all token transfers
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="staking" defaultChecked />
                      <Label htmlFor="staking" className="cursor-pointer">
                        Show staking/unstaking
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nft-transfers" />
                      <Label htmlFor="nft-transfers" className="cursor-pointer">
                        Hide NFT transfers
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="balance-changes" />
                      <Label htmlFor="balance-changes" className="cursor-pointer">
                        Hide wallet balance changes
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">🛡️</span>
                    Only public blockchain data is ever used. We never post private messages or off-chain behavior.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">Edit Profile</h2>
                <p className="text-gray-500 text-sm">Update your public profile information</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="displayName" className="text-gray-700 font-medium">
                    Display Name / Alias
                  </Label>
                  <Input id="displayName" value={formData.displayName} onChange={handleInputChange} className="mt-1.5 border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-gray-700 font-medium">
                    Bio
                  </Label>
                  <Textarea id="bio" value={formData.bio} onChange={handleInputChange} className="mt-1.5 min-h-[100px] border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
                </div>

                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">Socials</Label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="twitter" placeholder="Twitter / X" value={formData.twitter} onChange={handleInputChange} className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="telegram" placeholder="Telegram" value={formData.telegram} onChange={handleInputChange} className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                  </div>
                </div>

                <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full" onClick={saveProfileChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">© 2023 SolWhale Tracker. All rights reserved.</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="#" className="text-gray-600 hover:text-teal-600 flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>How is ROI calculated?</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-teal-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>How do I get more followers?</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-teal-600 flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
