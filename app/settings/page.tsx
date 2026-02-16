'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSettings, saveSettings, getUsers, saveUser, deleteUser, clearAllData, loadDemoData } from '@/lib/storage';
import type { Settings as SettingsType, User as UserType } from '@/lib/types';
import { Settings, User, Save, Loader2, UserPlus, Trash2, AlertTriangle, Globe, ShieldAlert, LayoutTemplate, Plus, X, Moon, Sun, Smartphone, Edit2, Check, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NamingConventionEditor } from '@/components/naming-convention-editor';
import { BrandManager } from '@/components/settings/brand-manager';
import { DesignSpecsManager } from '@/components/settings/design-specs-manager';
import { PlacementManager } from '@/components/settings/placement-manager';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ROLE_DESCRIPTIONS = {
    admin: "Full access to all settings, users, and billing.",
    editor: "Can create and edit briefs and templates. No access to user management.",
    content: "Can edit text content but cannot change designs.",
    design: "Can modify design templates and assets.",
    market_manager: "Manages briefs and users for their specific market region.",
    traffic: "Read-only access to export final packages.",
    reviewer: "Can comment and approve/reject briefs."
};

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = React.useState("general");
    const [saving, setSaving] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    // Settings State
    const [settings, setSettings] = React.useState<SettingsType>({
        appLanguage: 'en',
        workspaceName: '',
        defaultBrands: []
    });

    // Brand Input State
    const [newBrandInput, setNewBrandInput] = React.useState('');

    // User State
    const [users, setUsers] = React.useState<UserType[]>([]);
    const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<UserType | null>(null);
    const [userForm, setUserForm] = React.useState<Partial<UserType>>({
        name: '',
        email: '',
        role: 'editor'
    });

    // Reset Confirmation
    const [resetConfirm, setResetConfirm] = React.useState('');

    React.useEffect(() => {
        setMounted(true);
        const s = getSettings();
        setSettings(s);
        setUsers(getUsers());
    }, []);

    const addBrand = () => {
        if (!newBrandInput.trim()) return;
        const currentBrands = settings.defaultBrands || [];
        if (currentBrands.includes(newBrandInput.trim())) return;

        const updated = [...currentBrands, newBrandInput.trim()];
        setSettings({ ...settings, defaultBrands: updated });
        setNewBrandInput('');
    };

    const removeBrand = (brandToRemove: string) => {
        const updated = (settings.defaultBrands || []).filter(b => b !== brandToRemove);
        setSettings({ ...settings, defaultBrands: updated });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBrand();
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 600));
        saveSettings(settings);
        setSaving(false);
    };

    const handleOpenUserDialog = (user?: UserType) => {
        if (user) {
            setEditingUser(user);
            setUserForm(user);
        } else {
            setEditingUser(null);
            setUserForm({ name: '', email: '', role: 'editor' });
        }
        setIsUserDialogOpen(true);
    };

    const handleSaveUser = () => {
        if (!userForm.name || !userForm.email || !userForm.role) return;

        const newUser: UserType = {
            id: editingUser ? editingUser.id : crypto.randomUUID(),
            name: userForm.name,
            email: userForm.email,
            role: userForm.role as UserType['role']
        };

        saveUser(newUser);
        setUsers(getUsers());
        setIsUserDialogOpen(false);
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('Are you sure you want to remove this user?')) {
            deleteUser(id);
            setUsers(getUsers());
        }
    };

    const handleReset = () => {
        if (resetConfirm !== 'DELETE') return;
        clearAllData();
        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background text-foreground pb-32">
            <div className="container pt-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-6">
                    <div className="space-y-1">
                        <h1 className="h1 tracking-tight">Workspace Settings</h1>
                        <p className="text-lg text-muted-foreground font-normal">
                            Manage your workspace preferences, team members, and branding configuration.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="radius-btn font-semibold text-muted-foreground hover:text-foreground hidden md:flex"
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={saving}
                            className="min-w-[120px] radius-btn font-semibold shadow-sm"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {/* Tabs Section - ADS Style */}
                <div className="border-b border-border pb-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="bg-transparent gap-6 h-auto p-0">
                            {[
                                { id: 'general', label: 'General' },
                                { id: 'brands', label: 'Brands & Clients' },
                                { id: 'placements', label: 'Placements' },
                                { id: 'specs', label: 'Design Specs' },
                                { id: 'naming', label: 'Naming Convention' },
                                { id: 'users', label: 'Team Members' },
                                { id: 'danger', label: 'System' }
                            ].map(item => (
                                <TabsTrigger
                                    key={item.id}
                                    value={item.id}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-muted-foreground hover:text-foreground transition-colors px-1 pb-3 text-sm mb-[-2px]"
                                >
                                    {item.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Content Area */}
                        <div className="pt-8">
                            {/* GENERAL */}
                            <TabsContent value="general" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold text-foreground">General Settings</h2>
                                    <p className="text-xs text-muted-foreground">Manage workspace identity and preferences.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Workspace Identity */}
                                    <Card className="shadow-card border border-border radius-card bg-card overflow-hidden">
                                        <CardHeader className="flex flex-row items-start gap-4 p-6 pb-2 space-y-0">
                                            <div className="w-10 h-10 radius-md bg-muted flex items-center justify-center text-foreground shrink-0">
                                                <LayoutTemplate className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-bold text-foreground">Workspace Identity</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">Visual branding for teams</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-foreground">Workspace Name</Label>
                                                <Input
                                                    value={settings.workspaceName}
                                                    onChange={(e) => setSettings({ ...settings, workspaceName: e.target.value })}
                                                    placeholder="e.g. Acme Creative Studio"
                                                    className="h-10 radius-input border-border focus:border-primary font-medium bg-background"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Appearance */}
                                    <Card className="shadow-card border border-border radius-card bg-card overflow-hidden">
                                        <CardHeader className="flex flex-row items-start gap-4 p-6 pb-2 space-y-0">
                                            <div className="w-10 h-10 radius-md bg-muted flex items-center justify-center text-foreground shrink-0">
                                                <Sun className="w-5 h-5 dark:hidden" />
                                                <Moon className="w-5 h-5 hidden dark:block" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-bold text-foreground">Appearance</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">Interface customization</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-4">
                                            <div className="grid grid-cols-3 gap-3">
                                                {['light', 'dark', 'system'].map((mode) => (
                                                    <button
                                                        key={mode}
                                                        onClick={() => setTheme(mode)}
                                                        className={cn(
                                                            "flex flex-col items-center gap-2 p-3 radius-card border transition-all duration-200",
                                                            theme === mode
                                                                ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                                                                : "border-border bg-background text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                                                        )}
                                                    >
                                                        {mode === 'light' && <Sun className="w-5 h-5" />}
                                                        {mode === 'dark' && <Moon className="w-5 h-5" />}
                                                        {mode === 'system' && <Smartphone className="w-5 h-5" />}
                                                        <span className="text-[10px] font-bold capitalize tracking-wide">{mode}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Localization */}
                                    <Card className="shadow-card border border-border radius-card bg-card overflow-hidden">
                                        <CardHeader className="flex flex-row items-start gap-4 p-6 pb-2 space-y-0">
                                            <div className="w-10 h-10 radius-md bg-muted flex items-center justify-center text-foreground shrink-0">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-bold text-foreground">Localization</CardTitle>
                                                <CardDescription className="text-xs text-muted-foreground">Language & regional settings</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 pt-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-foreground">Default Language</Label>
                                                <Select
                                                    value={settings.appLanguage}
                                                    onValueChange={(v) => setSettings({ ...settings, appLanguage: v })}
                                                >
                                                    <SelectTrigger className="h-10 radius-input border-border focus:border-primary px-3 font-medium bg-background">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="radius-card border-border shadow-card">
                                                        <SelectItem value="en">English (International)</SelectItem>
                                                        <SelectItem value="es">Español</SelectItem>
                                                        <SelectItem value="fr">Français</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* BRANDS */}
                            <TabsContent value="brands" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <BrandManager />
                            </TabsContent>

                            {/* PLACEMENTS */}
                            <TabsContent value="placements" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <PlacementManager />
                            </TabsContent>

                            {/* DESIGN SPECS */}
                            <TabsContent value="specs" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <DesignSpecsManager />
                            </TabsContent>

                            {/* NAMING */}
                            <TabsContent value="naming" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <div className="container-standard-narrow space-y-6">
                                    <div className="text-center space-y-2">
                                        <h1 className="text-2xl font-bold text-foreground">File Naming Convention</h1>
                                        <p className="text-sm text-muted-foreground">Standardize how assets are named across your organization.</p>
                                    </div>
                                    <div className="bg-card radius-card shadow-card border border-border p-8">
                                        <NamingConventionEditor
                                            activeConvention={settings.activeNamingConvention}
                                            templates={settings.namingTemplates || []}
                                            onSave={(active, templates) => {
                                                setSettings(s => ({
                                                    ...s,
                                                    activeNamingConvention: active,
                                                    namingTemplates: templates
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* USERS */}
                            <TabsContent value="users" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h2 className="text-lg font-bold text-foreground">Team Members</h2>
                                            <p className="text-sm text-muted-foreground">Manage access and permissions for your team.</p>
                                        </div>
                                        <Button onClick={() => handleOpenUserDialog()} size="sm" className="radius-btn font-bold">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Add Member
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {users.map((user) => (
                                            <Card key={user.id} className="group hover:border-primary/50 transition-all bg-card border border-border shadow-card radius-card overflow-hidden">
                                                <CardContent className="p-6 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-12 h-12 radius-md bg-muted flex items-center justify-center text-foreground text-lg font-bold border border-border">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 radius-btn" onClick={() => handleOpenUserDialog(user)}>
                                                                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 radius-btn hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteUser(user.id)}>
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <h3 className="text-base font-bold text-foreground">{user.name}</h3>
                                                        <p className="text-xs text-muted-foreground font-medium">{user.email}</p>
                                                    </div>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="radius-btn px-2.5 h-6 capitalize font-bold text-[10px] shadow-none">
                                                        {user.role.replace('_', ' ')}
                                                    </Badge>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* SYSTEM / DANGER ZONE */}
                            <TabsContent value="danger" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500 focus-visible:outline-none space-y-6">
                                <div className="max-w-2xl mx-auto space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldAlert className="w-6 h-6 text-destructive" />
                                        </div>
                                        <h1 className="text-xl font-bold tracking-tight text-foreground">System Reset</h1>
                                        <p className="text-sm text-muted-foreground">Irreversible system-wide actions. Please proceed with caution.</p>
                                    </div>

                                    {/* Demo Data Section */}
                                    <Card className="border border-border radius-card shadow-card p-6 bg-card flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 radius-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Database className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-foreground">Load Demo Data</h3>
                                                <p className="text-xs text-muted-foreground">Inject 5 example briefings to test the application flows.</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => loadDemoData()}
                                            size="sm"
                                            className="min-w-[140px] radius-btn font-semibold shadow-sm"
                                        >
                                            <Database className="w-4 h-4 mr-2" />
                                            Generate Briefs
                                        </Button>
                                    </Card>

                                    <Card className="border border-destructive/20 shadow-none bg-destructive/5 radius-card p-8 text-center space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-destructive">Factory Reset</h3>
                                            <p className="text-destructive/80 text-xs font-medium leading-relaxed max-w-sm mx-auto">
                                                Delete all briefings, users, templates, and settings. This cannot be undone.
                                            </p>
                                        </div>

                                        <div className="max-w-xs mx-auto space-y-2">
                                            <Label className="text-[10px] font-bold text-destructive uppercase tracking-wider">Type <span className="text-foreground">DELETE</span> to confirm</Label>
                                            <Input
                                                value={resetConfirm}
                                                onChange={(e) => setResetConfirm(e.target.value)}
                                                className="h-10 text-center text-sm font-bold tracking-widest radius-input border-destructive/30 focus:border-destructive bg-background text-destructive"
                                                placeholder="DELETE"
                                            />
                                        </div>

                                        <Button
                                            variant="destructive"
                                            onClick={handleReset}
                                            disabled={resetConfirm !== 'DELETE'}
                                            className="w-full max-w-xs h-10 radius-btn shadow-sm text-xs font-bold"
                                        >
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Reset Workspace Data
                                        </Button>
                                    </Card>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* User Dialog */}
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogContent className="max-w-md p-6 radius-card border-border shadow-card bg-card">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="text-lg font-bold text-foreground">{editingUser ? 'Edit User' : 'Add Team Member'}</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                {editingUser ? 'Update user details and access level.' : 'Invite a new member to your creative workspace.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-foreground">Display Name</Label>
                                <Input
                                    value={userForm.name}
                                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="h-9 radius-input border-border font-medium bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-foreground">Email Address</Label>
                                <Input
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    placeholder="jane@studio.com"
                                    className="h-9 radius-input border-border font-medium bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-foreground">Role Assignment</Label>
                                <Select
                                    value={userForm.role}
                                    onValueChange={(v) => setUserForm({ ...userForm, role: v as UserType['role'] })}
                                >
                                    <SelectTrigger className="h-9 radius-input border-border font-medium bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="radius-card shadow-card border-border">
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="content">Content</SelectItem>
                                        <SelectItem value="design">Design</SelectItem>
                                        <SelectItem value="market_manager">Market Manager</SelectItem>
                                        <SelectItem value="traffic">Traffic</SelectItem>
                                        <SelectItem value="reviewer">Reviewer</SelectItem>
                                    </SelectContent>
                                </Select>
                                {userForm.role && (
                                    <div className="text-[10px] text-muted-foreground bg-muted/30 p-3 radius-md border border-border font-medium mt-2 leading-relaxed">
                                        <p className="font-bold text-foreground mb-1">Role Permissions</p>
                                        {ROLE_DESCRIPTIONS[userForm.role]}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)} size="sm" className="radius-btn font-semibold">Cancel</Button>
                            <Button onClick={handleSaveUser} size="sm" className="radius-btn font-semibold">
                                {editingUser ? 'Save Changes' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
