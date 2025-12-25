"use client"
import { useMemo } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { User2, Mail, Settings, Bell, Shirt, Heart, Shield, Globe2, Phone, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import SavedOutfits from "./saved-outfits"
import LikedItems from "./liked-items"

export function ProfileTabs() {
  const { user, profile } = useAuth()

  const profileCompleteness = useMemo(() => {
    if (!profile) return 0
    const fields = [
      profile.full_name,
      profile.username,
      profile.bio,
      profile.phone,
      profile.street_address,
      profile.city,
      profile.country,
    ]
    const filledFields = fields.filter(Boolean).length
    return Math.round((filledFields / fields.length) * 100)
  }, [profile])
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="profile" className="data-[state=active]:bg-[#00C4B4]/20 data-[state=active]:text-[#00C4B4]">
          <User2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="likes" className="data-[state=active]:bg-[#00C4B4]/20 data-[state=active]:text-[#00C4B4]">
          <Heart className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Likes</span>
        </TabsTrigger>
        <TabsTrigger value="outfits" className="data-[state=active]:bg-[#00C4B4]/20 data-[state=active]:text-[#00C4B4]">
          <Shirt className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Outfits</span>
        </TabsTrigger>
        <TabsTrigger value="email" className="data-[state=active]:bg-[#00C4B4]/20 data-[state=active]:text-[#00C4B4]">
          <Mail className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Email</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="data-[state=active]:bg-[#00C4B4]/20 data-[state=active]:text-[#00C4B4]"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="data-[state=active]:bg-[#00C4B4]/20 data-[state=active]:text-[#00C4B4]"
        >
          <Bell className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Notify</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-[#0A0A1A] border-[#00C4B4]/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="h-5 w-5 text-[#00C4B4]" />
                Profile at a glance
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#111] border border-[#00C4B4]/10">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Globe2 className="h-4 w-4 text-[#00C4B4]" />
                  Public handle
                </div>
                <p className="mt-2 text-white text-lg">@{profile?.username || "Not set"}</p>
                <Badge className="mt-3 bg-[#00C4B4] text-black w-fit">Verified</Badge>
              </div>
              <div className="p-4 rounded-lg bg-[#111] border border-[#00C4B4]/10">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Phone className="h-4 w-4 text-[#00C4B4]" />
                  Contact
                </div>
                <p className="mt-2 text-white text-lg">{profile?.phone || "Not set"}</p>
                <p className="text-sm text-zinc-400">Reachable for delivery updates</p>
              </div>
              <div className="p-4 rounded-lg bg-[#111] border border-[#00C4B4]/10">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 text-[#00C4B4]" />
                  Default location
                </div>
                <p className="mt-2 text-white text-lg">
                  {profile?.city && profile?.country
                    ? `${profile.city}, ${profile.country}`
                    : profile?.street_address || "Not set"}
                </p>
                <p className="text-sm text-zinc-400">Used for checkout auto-fill</p>
              </div>
              <div className="p-4 rounded-lg bg-[#111] border border-[#00C4B4]/10">
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Profile completeness</span>
                  <span className="text-white">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="mt-3" />
                <p className="text-sm text-zinc-400 mt-2">
                  {profileCompleteness === 100
                    ? "Profile complete!"
                    : "Add missing fields to complete"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A1A] border-[#00C4B4]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#00C4B4]" />
                Quick actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-gradient-to-r from-[#007BFF] to-[#00C4B4]">
                <Link href="/profile/settings">Edit profile</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-[#00C4B4]/40 text-[#00C4B4]">
                <Link href="/profile/settings">Update avatar</Link>
              </Button>
              <Button variant="outline" className="w-full border-[#00C4B4]/40 text-[#00C4B4]">
                Manage visibility
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="likes" className="space-y-6">
        <Card className="bg-[#0A0A1A] border-[#00C4B4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#FF6B6B]" />
              Liked outfits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LikedItems />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="outfits" className="space-y-6">
        <Card className="bg-[#0A0A1A] border-[#00C4B4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shirt className="h-5 w-5 text-[#00C4B4]" />
              Saved outfits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SavedOutfits />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="email" className="space-y-6">
        <Card className="bg-[#0A0A1A] border-[#00C4B4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#00C4B4]" />
              Inbox preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-white font-medium">Primary email</p>
              <p className="text-sm text-zinc-400">{user?.email || "Not set"}</p>
            </div>
            <Separator className="bg-zinc-800" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Order updates</p>
                  <p className="text-sm text-zinc-400">Shipping, delivery, receipts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Product news</p>
                  <p className="text-sm text-zinc-400">Launches and early access</p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings" className="space-y-6">
        <Card className="bg-[#0A0A1A] border-[#00C4B4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#00C4B4]" />
              Account controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#00C4B4]/10">
              <div>
                <p className="text-white">Two-factor auth</p>
                <p className="text-sm text-zinc-400">Protect logins with 2FA</p>
              </div>
              <Button variant="outline" className="border-[#00C4B4]/40 text-[#00C4B4]">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#00C4B4]/10">
              <div>
                <p className="text-white">Session management</p>
                <p className="text-sm text-zinc-400">View and revoke active sessions</p>
              </div>
              <Button variant="outline" className="border-[#00C4B4]/40 text-[#00C4B4]">Review</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications" className="space-y-6">
        <Card className="bg-[#0A0A1A] border-[#00C4B4]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#00C4B4]" />
              Notification controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">App pushes</p>
                <p className="text-sm text-zinc-400">Outfit tips and reminders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">SMS alerts</p>
                <p className="text-sm text-zinc-400">Delivery and order status</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ProfileTabs
