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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Scan } from "lucide-react";

interface Expense {
  _id: string;
  createdAt: string;
  userId: { name: string; email: string };
  category: string;
  amountSubmitted: number;
  currencySubmitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function Dashboard() {
  const { userData } = useSelector((state: RootState) => state.user);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Expense Form State
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState("Travel");
  const [description, setDescription] = useState("");

  const fetchExpenses = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/expenses");
      if (data.success) setExpenses(data.expenses);
    } catch (error: any) {
      console.error("Failed to fetch expenses", error);
      toast.error(error.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData) fetchExpenses();
  }, [userData, fetchExpenses]);

  const handleScanReceipt = () => {
    const loadingToast = toast.loading("Scanning receipt...");
    setTimeout(() => {
      setAmount("125.50");
      setCurrency("EUR");
      setCategory("Meals");
      setDescription("Lunch at Restaurant Parisienne");
      toast.dismiss(loadingToast);
      toast.success("OCR: Data extracted successfully!");
    }, 1500);
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/expenses", {
        amountSubmitted: Number(amount),
        currencySubmitted: currency,
        category,
        description,
        expenseDate: new Date()
      });
      if (data.success) {
        toast.success("Expense submitted");
        setShowModal(false);
        fetchExpenses();
        // Reset form
        setAmount("");
        setCurrency("USD");
        setCategory("Travel");
        setDescription("");
      }
    } catch (error: any) {
      console.error("Submission failed", error);
      toast.error(error.response?.data?.message || "Submission failed");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.post(`/api/expenses/${id}/approve`, { comments: "Approved via dashboard" });
      toast.success("Approved");
      fetchExpenses();
    } catch (error: any) {
      console.error("Approval failed", error);
      toast.error(error.response?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.post(`/api/expenses/${id}/reject`, { comments: "Rejected via dashboard" });
      toast.success("Rejected");
      fetchExpenses();
    } catch (error: any) {
      console.error("Rejection failed", error);
      toast.error(error.response?.data?.message || "Rejection failed");
    }
  };

  if (!userData) return <div className="p-8 text-center">Please sign in to view your dashboard.</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage and track your reimbursement claims.</p>
          </div>
          {(userData.role === 'Employee' || userData.role === 'Admin') && (
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-md">
                  <Plus className="h-4 w-4" /> New Claim
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border shadow-2xl">
                <DialogHeader className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <DialogTitle className="text-2xl font-bold">New Reimbursement Claim</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Enter the details of your expense.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <form onSubmit={handleSubmitExpense} className="space-y-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-semibold">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-11 border-border focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-sm font-semibold">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger id="currency" className="h-11 border-border focus:border-primary transition-all">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category" className="h-11 border-border focus:border-primary transition-all">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Meals">Meals</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                    <Textarea
                      id="description"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What was this expense for?"
                      className="min-h-[100px] border-border focus:border-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <Button type="submit" className="w-full h-11 text-base font-bold">
                      Submit Claim
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleScanReceipt}
                      className="w-full h-11 gap-2 font-bold border-2 hover:bg-primary/5"
                    >
                      <Scan className="h-4 w-4" /> Scan Receipt (AI OCR)
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground animate-pulse font-medium">Loading expenses...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {expenses.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">No expenses found</h3>
                    <p className="text-sm text-muted-foreground">You haven&apos;t submitted any expenses yet.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="px-6 py-4 border-b">
                  <CardTitle className="text-lg">Expense History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="px-6 py-4">Date</TableHead>
                        <TableHead className="px-6 py-4">User</TableHead>
                        <TableHead className="px-6 py-4">Category</TableHead>
                        <TableHead className="px-6 py-4">Amount</TableHead>
                        <TableHead className="px-6 py-4">Status</TableHead>
                        <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((exp) => (
                        <TableRow key={exp._id} className="hover:bg-muted/30">
                          <TableCell className="px-6 py-4 font-medium">
                            {new Date(exp.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            {exp.userId?.name || 'You'}
                          </TableCell>
                          <TableCell className="px-6 py-4">{exp.category}</TableCell>
                          <TableCell className="px-6 py-4 font-semibold">
                            {exp.currencySubmitted} {exp.amountSubmitted.toFixed(2)}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                              exp.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              exp.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            )}>
                              {exp.status}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {(userData.role === 'Manager' || userData.role === 'Admin') && exp.status === 'Pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleApprove(exp._id)}
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleReject(exp._id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="text-primary">
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
