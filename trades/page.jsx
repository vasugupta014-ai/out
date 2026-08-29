"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardDescription, CardFooter, CardContent } from "@/components/ui/card";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const emptyForm = {
  accountId: "",
  ticket: "",
  symbol: "",
  entryPrice: "",
  exitPrice: "",
  takeProfit: "",
  stopLoss: "",
  openedAt: "",
  closedAt: "",
  tradeNotes: "",
  closeType: "",
};

export default function Page() {
  const [trades, setTrades] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [tradesResponse, accountsResponse] = await Promise.all([
        fetch("/api/trades"),
        fetch("/api/accounts"),
      ]);

      const tradesData = await tradesResponse.json();
      const accountsData = await accountsResponse.json();

      if (!tradesResponse.ok) {
        throw new Error(tradesData.error || "Failed to load trades");
      }

      if (!accountsResponse.ok) {
        throw new Error(accountsData.error || "Failed to load accounts");
      }

      setTrades(tradesData);
      setAccounts(accountsData);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  function editTrade(trade) {
    setEditingId(trade._id);

    setForm({
      accountId: trade.accountId?._id || trade.accountId || "",

      ticket: trade.ticket || "",

      symbol: trade.symbol || "",

      entryPrice:
        trade.entryPrice !== null && trade.entryPrice !== undefined
          ? String(trade.entryPrice)
          : "",

      exitPrice:
        trade.exitPrice !== null && trade.exitPrice !== undefined
          ? String(trade.exitPrice)
          : "",

      takeProfit:
        trade.takeProfit !== null && trade.takeProfit !== undefined
          ? String(trade.takeProfit)
          : "",

      stopLoss:
        trade.stopLoss !== null && trade.stopLoss !== undefined
          ? String(trade.stopLoss)
          : "",

      openedAt: formatDateForInput(trade.openedAt),

      closedAt: formatDateForInput(trade.closedAt),

      tradeNotes: trade.tradeNotes || "",

      closeType: trade.closeType || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.accountId) {
        setError("Please select an account.");
        return;
      }

      const url = editingId
        ? `/api/trades/${editingId}`
        : "/api/trades";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save trade");
      }

      if (editingId) {
        setTrades((current) =>
          current.map((trade) =>
            trade._id === editingId ? data : trade
          )
        );

        setSuccess("Trade updated successfully.");
      } else {
        setTrades((current) => [data, ...current]);

        setSuccess("Trade created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to save trade");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTrade(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trade?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/trades/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete trade");
      }

      setTrades((current) =>
        current.filter((trade) => trade._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Trade deleted successfully.");
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to delete trade");
    }
  }

  function getAccountNumber(accountId) {
    const account = accounts.find(
      (item) =>
        String(item._id) ===
        String(accountId?._id || accountId)
    );

    return account?.mt_account_number || "Unknown";
  }

  function formatDate(value) {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString();
  }

  function formatDateForInput(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Trade Positions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manually create and manage trade positions.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}
        <Card>
            <CardContent>
                <form
                onSubmit={handleSubmit}
                >
                  <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                      {editingId ? "Edit Trade" : "Add Trade"}
                      </h2>

                      {editingId && (
                      <Button
                          type="Button"
                          onClick={resetForm}
                          variant="secondary"
                      >
                          Cancel Edit
                      </Button>
                      )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div>

                      <NativeSelect
                          size="default"
                          name="accountId"
                          value={form.accountId}
                          onChange={handleChange}
                          required
                          className="w-full "
                      >
                          <NativeSelectOption value="">
                          Select Account
                          </NativeSelectOption>

                          {accounts.map((account) => (
                          <NativeSelectOption
                              key={account._id}
                              value={account._id}
                          >
                              {account.mt_account_number}
                          </NativeSelectOption>
                          ))}
                      </NativeSelect>
                      </div>

                      <Input
                      label="Ticket"
                      name="ticket"
                      value={form.ticket}
                      onChange={handleChange}
                      placeholder="Ticket number"
                      />

                      <Input
                      label="Symbol"
                      name="symbol"
                      value={form.symbol}
                      onChange={handleChange}
                      placeholder="EURUSD"
                      />

                      <Input
                      label="Entry Price"
                      name="entryPrice"
                      type="number"
                      step="any"
                      value={form.entryPrice}
                      onChange={handleChange}
                      placeholder="0.00000"
                      />

                      <Input
                      label="Exit Price"
                      name="exitPrice"
                      type="number"
                      step="any"
                      value={form.exitPrice}
                      onChange={handleChange}
                      placeholder="0.00000"
                      />

                      <Input
                      label="Take Profit"
                      name="takeProfit"
                      type="number"
                      step="any"
                      value={form.takeProfit}
                      onChange={handleChange}
                      placeholder="0.00000"
                      />

                      <Input
                      label="Stop Loss"
                      name="stopLoss"
                      type="number"
                      step="any"
                      value={form.stopLoss}
                      onChange={handleChange}
                      placeholder="0.00000"
                      />

                      <Input
                      label="Opened At"
                      name="openedAt"
                      type="datetime-local"
                      value={form.openedAt}
                      onChange={handleChange}
                      />

                      <Input
                      label="Closed At"
                      name="closedAt"
                      type="datetime-local"
                      value={form.closedAt}
                      onChange={handleChange}
                      />

                      <div>

                      <NativeSelect
                          name="closeType"
                          value={form.closeType}
                          onChange={handleChange}
                          className="w-full"
                      >
                          <NativeSelectOption value="">
                          Select Close Type
                          </NativeSelectOption>

                          <NativeSelectOption value="Take Profit">
                          Take Profit
                          </NativeSelectOption>

                          <NativeSelectOption value="Stop Loss">
                          Stop Loss
                          </NativeSelectOption>

                          <NativeSelectOption value="Manual">
                          Manual
                          </NativeSelectOption>

                          <NativeSelectOption value="Breakeven">
                          Breakeven
                          </NativeSelectOption>

                          <NativeSelectOption value="Other">
                          Other
                          </NativeSelectOption>
                      </NativeSelect>
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                      <label className="mb-1 block text-sm font-medium">
                          Trade Notes
                      </label>

                      <Textarea
                          name="tradeNotes"
                          value={form.tradeNotes}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Write trade notes..."
                          className="w-full rounded-lg border px-3 py-2"
                      />
                      </div>
                  </div>

                  <div className="mt-6">
                      <Button
                      type="submit"
                      disabled={saving}
                      >
                      {saving
                          ? "Saving..."
                          : editingId
                          ? "Update Trade"
                          : "Create Trade"}
                      </Button>
                  </div>
                </form>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <h2 className="text-xl font-semibold">
                Trade Positions
            </h2>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="p-6 text-sm text-gray-500">
                    Loading trades...
                    </div>
                ) : trades.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                    No trades found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[1300px] text-sm">
                        <thead className="border-b">
                        <tr>
                            <th className="px-4 py-3 text-left">
                            Account
                            </th>

                            <th className="px-4 py-3 text-left">
                            Ticket
                            </th>

                            <th className="px-4 py-3 text-left">
                            Symbol
                            </th>

                            <th className="px-4 py-3 text-left">
                            Entry
                            </th>

                            <th className="px-4 py-3 text-left">
                            Exit
                            </th>

                            <th className="px-4 py-3 text-left">
                            TP
                            </th>

                            <th className="px-4 py-3 text-left">
                            SL
                            </th>

                            <th className="px-4 py-3 text-left">
                            Opened
                            </th>

                            <th className="px-4 py-3 text-left">
                            Closed
                            </th>

                            <th className="px-4 py-3 text-left">
                            Close Type
                            </th>

                            <th className="px-4 py-3 text-left">
                            Notes
                            </th>

                            <th className="px-4 py-3 text-right">
                            Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {trades.map((trade) => (
                            <tr
                            key={trade._id}
                            className="border-b last:border-b-0"
                            >
                            <td className="px-4 py-3">
                                {getAccountNumber(trade.accountId)}
                            </td>

                            <td className="px-4 py-3">
                                {trade.ticket || "-"}
                            </td>

                            <td className="px-4 py-3 font-medium">
                                {trade.symbol || "-"}
                            </td>

                            <td className="px-4 py-3">
                                {trade.entryPrice ?? "-"}
                            </td>

                            <td className="px-4 py-3">
                                {trade.exitPrice ?? "-"}
                            </td>

                            <td className="px-4 py-3">
                                {trade.takeProfit ?? "-"}
                            </td>

                            <td className="px-4 py-3">
                                {trade.stopLoss ?? "-"}
                            </td>

                            <td className="px-4 py-3">
                                {formatDate(trade.openedAt)}
                            </td>

                            <td className="px-4 py-3">
                                {formatDate(trade.closedAt)}
                            </td>

                            <td className="px-4 py-3">
                                {trade.closeType || "-"}
                            </td>

                            <td className="max-w-[250px] px-4 py-3">
                                <div className="truncate">
                                {trade.tradeNotes || "-"}
                                </div>
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                <Button
                                    type="Button"
                                    onClick={() => editTrade(trade)}
                                >
                                    Edit
                                </Button>

                                <Button
                                    type="Button"
                                    onClick={() =>
                                    deleteTrade(trade._id)
                                    }
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
