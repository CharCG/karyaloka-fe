import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useGetWallet, useGetWithdrawals, useWithdraw } from "../api/wallet";

import HeaderBar from "../../../shared/components/HeaderBar";
import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import WalletIcon from "../../../assets/icons/wallet.svg?react";

function formatBudget(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "Rp0";
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function Wallet() {
  const { data: wallet, isLoading: isWalletLoading } = useGetWallet();
  const { data: withdrawals, isLoading: isWithdrawalsLoading } = useGetWithdrawals();
  const withdrawMutation = useWithdraw();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const balance = Number(wallet?.balance) || 0;

  const handleWithdraw = async () => {
    setError("");
    setSuccess("");

    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid withdrawal amount");
      return;
    }

    if (numAmount > balance) {
      setError("Insufficient balance");
      return;
    }

    try {
      await withdrawMutation.mutateAsync({ amount: numAmount });
      setSuccess(`Successfully requested withdrawal of ${formatBudget(numAmount)}`);
      setAmount("");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to process withdrawal";
      setError(Array.isArray(msg) ? msg[0] : msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base pb-12">
      <HeaderBar title="Wallet" showBack variant="surface" />

      <div className="px-5 py-6 flex flex-col gap-6">
        <div className="bg-primary text-white rounded-lg p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-5 h-5 text-white/80" />
            <span className="text-body-sm text-white/80 font-medium">Available Balance</span>
          </div>

          <div className="text-h1 font-semibold text-white">
            {isWalletLoading ? <Skeleton width={180} height={36} /> : formatBudget(balance)}
          </div>
        </div>

        <div className="bg-background-surface rounded-lg p-5 border border-border flex flex-col gap-4">
          <h3 className="text-body font-semibold text-text-primary">Withdraw Funds</h3>

          {error && (
            <div className="p-3 bg-error-bg text-error text-body-sm rounded-lg border border-error-border">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-success-bg text-success text-body-sm rounded-lg border border-success-border">
              {success}
            </div>
          )}

          <Input
            label="Withdrawal Amount"
            name="amount"
            placeholder="Enter amount to withdraw"
            prefix="Rp"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            requiredMark
          />

          <Button
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending || !amount || balance <= 0}
          >
            {withdrawMutation.isPending ? "Processing..." : "Request Withdrawal"}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-body font-semibold text-text-primary">Withdrawal History</h3>

          {isWithdrawalsLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton height={60} borderRadius={8} />
              <Skeleton height={60} borderRadius={8} />
            </div>
          ) : !withdrawals || withdrawals.length === 0 ? (
            <div className="bg-background-surface rounded-lg p-6 border border-border text-center">
              <p className="text-body-sm text-text-secondary">No withdrawal history yet.</p>
            </div>
          ) : (
            <div className="bg-background-surface rounded-lg border border-border overflow-hidden">
              {withdrawals.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex items-center justify-between border-b border-border last:border-b-0"
                >
                  <div className="flex flex-col">
                    <span className="text-body font-semibold text-text-primary">
                      {formatBudget(item.amount)}
                    </span>
                    <span className="text-caption text-text-tertiary">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`text-caption px-3 py-1 rounded-full font-semibold ${
                      item.status === "APPROVED"
                        ? "bg-success-bg text-success"
                        : item.status === "REJECTED"
                        ? "bg-error-bg text-error"
                        : "bg-warning-bg text-warning"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
