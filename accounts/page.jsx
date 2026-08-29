"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Loader2,
} from "lucide-react";

export default function Page() {
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingAccount, setEditingAccount] = useState(null);

  const [form, setForm] = useState({
    mt_account_number: "",
    balance: "",
  });

  useEffect(() => {
    // fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/accounts");

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const data = await response.json();

      setAccounts(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingAccount(null);

    setForm({
      mt_account_number: "",
      balance: "",
    });

    setDialogOpen(true);
  }

  function openEditDialog(account) {
    setEditingAccount(account);

    setForm({
      mt_account_number: account.mt_account_number || "",
      balance:
        account.balance !== null && account.balance !== undefined
          ? String(account.balance)
          : "",
    });

    setDialogOpen(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const isEditing = Boolean(editingAccount);

      const url = isEditing
        ? `/api/accounts/${editingAccount._id}`
        : "/api/accounts";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mt_account_number: form.mt_account_number,
          balance: Number(form.balance) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save account");
      }

      if (isEditing) {
        setAccounts((current) =>
          current.map((account) =>
            account._id === data._id ? data : account
          )
        );
      } else {
        setAccounts((current) => [data, ...current]);
      }

      setDialogOpen(false);

      setEditingAccount(null);

      setForm({
        mt_account_number: "",
        balance: "",
      });
    } catch (error) {
      console.error(error);

      setError(error.message || "Failed to save account.");
    } finally {
      setSaving(false);
    }
  }

  const [accountToDelete, setAccountToDelete] = useState(null);

  function confirmDelete(account) {
    setAccountToDelete(account); // Opens the Shadcn dialog
  }
  async function handleDelete() {
    if (!accountToDelete) return;

    try {
      setDeletingId(accountToDelete._id);
      setError("");

      const response = await fetch(
        `/api/accounts/${accountToDelete._id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      setAccounts((current) =>
        current.filter((item) => item._id !== accountToDelete._id)
      );
      
      setAccountToDelete(null); // Close dialog on success
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to delete account.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Accounts
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage your trading accounts and balances.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button onClick={openCreateDialog}>
                        <Plus className="mr-2 size-4" />
              Add Account
          </Button> } />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAccount
                  ? "Edit Account"
                  : "Add Account"}
              </DialogTitle>

              <DialogDescription>
                {editingAccount
                  ? "Update the account details."
                  : "Add a trading account to your journal."}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="mt_account_number">
                  MT Account Number
                </Label>

                <Input
                  id="mt_account_number"
                  name="mt_account_number"
                  value={form.mt_account_number}
                  onChange={handleChange}
                  placeholder="12345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">
                  Balance
                </Label>

                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  value={form.balance}
                  onChange={handleChange}
                  placeholder="10000"
                />
              </div>

              <DialogFooter>
                <DialogClose render={
                    <Button
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                }/>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}

                  {editingAccount
                    ? "Update Account"
                    : "Create Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : accounts.length === 0 ? (
        /* Empty state */
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Wallet className="size-6 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-medium">
            No accounts yet
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add your first trading account to get started.
          </p>

          <Button
            className="mt-4"
            onClick={openCreateDialog}
          >
            <Plus className="mr-2 size-4" />
            Add Account
          </Button>
        </div>
      ) : (
        /* Account table */
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    MT Account Number
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Balance
                  </th>

                  <th className="w-32 px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {accounts.map((account) => (
                  <tr
                    key={account._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-4 font-medium">
                      {account.mt_account_number}
                    </td>

                    <td className="px-4 py-4 text-right tabular-nums">
                      {Number(account.balance || 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            openEditDialog(account)
                          }
                          title="Edit account"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => confirmDelete(account)}
                          disabled={
                            deletingId === account._id
                          }
                          title="Delete account"
                        >
                          {deletingId === account._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                        <AlertDialog 
                          open={!!accountToDelete} 
                          onOpenChange={(open) => !open && setAccountToDelete(null)}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete account{" "}
                                <span className="font-semibold">{accountToDelete?.mt_account_number}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deletingId !== null}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.preventDefault(); // Prevents auto-closing so loader can run
                                  handleDelete();
                                }}
                                disabled={deletingId !== null}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deletingId ? "Deleting..." : "Continue"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
