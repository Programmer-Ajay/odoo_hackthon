"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Settings, ShieldCheck, Mail } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  managerId?: string;
}

interface Rule {
  _id: string;
  ruleName: string;
  ruleType: string;
  percentageThreshold?: number;
  assignedApprovers?: string[];
}

export default function AdminPage() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  // User Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [managerId, setManagerId] = useState("");

  // Rule Form State
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("Sequential");
  const [threshold, setThreshold] = useState("");
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, rRes] = await Promise.all([
        axios.get("/api/user/all"),
        axios.get("/api/rules")
      ]);
      setUsers(uRes.data.users);
      setRules(rRes.data.rules);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast.error("Failed to fetch administrative data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData?.role === 'Admin') fetchData();
  }, [userData, fetchData]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user", { name, email, role, managerId });
      if (data.success) {
        toast.success("User created. Sending invite...");
        await axios.post("/api/user/invite", { email });
        toast.success("Invite sent!");
        fetchData();
        setName(""); setEmail(""); setManagerId("");
      }
    } catch (error: any) {
      console.error("Failed to create user", error);
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApprovers.length === 0) {
      return toast.error("Please select at least one approver");
    }
    try {
      const { data } = await axios.post("/api/rules", {
        ruleName,
        ruleType,
        percentageThreshold: ruleType === 'Percentage' ? Number(threshold) : null,
        assignedApprovers: selectedApprovers
      });
      if (data.success) {
        toast.success("Rule created");
        fetchData();
        setRuleName(""); setThreshold(""); setSelectedApprovers([]);
      }
    } catch (error: any) {
      console.error("Failed to create rule", error);
      toast.error(error.response?.data?.message || "Failed to create rule");
    }
  };

  const toggleApprover = (id: string) => {
    setSelectedApprovers(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  if (userData?.role !== 'Admin') return <div className="p-8 text-center">Access Denied.</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Administration</h1>
            <p className="text-muted-foreground">Manage users, roles, and approval workflows.</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-muted/50 p-1">
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <UserPlus className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="rules" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <ShieldCheck className="h-4 w-4" /> Approval Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="md:col-span-1 h-fit shadow-lg border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl">Add New User</CardTitle>
                  <CardDescription>Invite a new member to your organization.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                      <Input id="name" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="h-10 border-border focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                      <Input id="email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" className="h-10 border-border focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-semibold">Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role" className="h-10 border-border focus:border-primary transition-all">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manager" className="text-sm font-semibold">Reporting Manager</Label>
                      <Select value={managerId} onValueChange={(val) => setManagerId(val === "none" ? "" : val)}>
                        <SelectTrigger id="manager" className="h-10 border-border focus:border-primary transition-all">
                          <SelectValue placeholder="Select manager (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Manager</SelectItem>
                          {users.filter(u => u.role === 'Manager' || u.role === 'Admin').map(u => (
                            <SelectItem key={u._id} value={u._id}>{u.name} ({u.role})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full h-11 font-bold shadow-md gap-2">
                      <Mail className="h-4 w-4" /> Create & Send Invite
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 shadow-lg border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Organization Directory</CardTitle>
                    <CardDescription>View and manage all users in your company.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="px-6 py-4 font-bold">User</TableHead>
                        <TableHead className="px-6 py-4 font-bold">Role</TableHead>
                        <TableHead className="px-6 py-4 font-bold">Manager</TableHead>
                        <TableHead className="px-6 py-4 text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading directory...</TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No users found.</TableCell>
                        </TableRow>
                      ) : users.map(u => (
                        <TableRow key={u._id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium">{u.name}</span>
                              <span className="text-xs text-muted-foreground">{u.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                              u.role === 'Admin' ? 'bg-primary/10 text-primary' :
                              u.role === 'Manager' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            )}>
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm">
                            {users.find(m => m._id === u.managerId)?.name || <span className="text-muted-foreground italic text-xs">None</span>}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="md:col-span-1 h-fit shadow-lg border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl">Configure Rule</CardTitle>
                  <CardDescription>Set up approval logic for expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRule} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ruleName" className="text-sm font-semibold">Rule Name</Label>
                      <Input id="ruleName" required value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder="Global Approval" className="h-10 border-border focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ruleType" className="text-sm font-semibold">Rule Type</Label>
                      <Select value={ruleType} onValueChange={setRuleType}>
                        <SelectTrigger id="ruleType" className="h-10 border-border focus:border-primary transition-all">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sequential">Sequential</SelectItem>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                          <SelectItem value="SpecificApprover">Specific Approver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {ruleType === 'Percentage' && (
                      <div className="space-y-2">
                        <Label htmlFor="threshold" className="text-sm font-semibold">Threshold (%)</Label>
                        <Input id="threshold" type="number" required value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="60" className="h-10 border-border focus:border-primary transition-all" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Assign Approvers</Label>
                      <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto space-y-2 bg-background">
                        {users.filter(u => u.role === 'Manager' || u.role === 'Admin').map(u => (
                          <div key={u._id} className="flex items-center space-x-3 hover:bg-muted/50 p-1.5 rounded transition-colors">
                            <input
                              type="checkbox"
                              id={`approver-${u._id}`}
                              checked={selectedApprovers.includes(u._id)}
                              onChange={() => toggleApprover(u._id)}
                              className="w-4 h-4 text-primary rounded border-border focus:ring-primary accent-primary cursor-pointer"
                            />
                            <Label htmlFor={`approver-${u._id}`} className="font-normal cursor-pointer flex-1">
                              {u.name} <span className="text-muted-foreground text-xs ml-1">({u.role})</span>
                            </Label>
                          </div>
                        ))}
                        {users.filter(u => u.role === 'Manager' || u.role === 'Admin').length === 0 && (
                          <p className="text-xs text-muted-foreground italic">No managers or admins available.</p>
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 font-bold shadow-md gap-2">
                      <Settings className="h-4 w-4" /> Create Rule
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="md:col-span-2 grid gap-4">
                {loading ? (
                  <p className="text-center py-10 text-muted-foreground">Loading rules...</p>
                ) : rules.length === 0 ? (
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="py-10 text-center text-muted-foreground">
                      <Settings className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      No approval rules configured yet.
                    </CardContent>
                  </Card>
                ) : rules.map(r => (
                  <Card key={r._id} className="hover:bg-muted/10 transition-colors shadow-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground">{r.ruleName || 'Unnamed Rule'}</CardTitle>
                        <CardDescription className="uppercase tracking-widest text-[10px] font-bold text-primary">{r.ruleType}</CardDescription>
                      </div>
                      <div className="text-right">
                        {r.ruleType === 'Percentage' && <p className="text-2xl font-bold text-primary">{r.percentageThreshold}%</p>}
                        <p className="text-xs text-muted-foreground mt-1">{r.assignedApprovers?.length || 0} Approvers</p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
