// DemoAccountList.tsx - Quick-fill demo account rows. Props: accounts, onSelect.
import { cn } from "@/lib/utils";
import type { DemoAccount } from "@/data/loginContent";

type DemoAccountListProps = {
  accounts: DemoAccount[];
  onSelect: (account: DemoAccount) => void;
};

export function DemoAccountList({ accounts, onSelect }: DemoAccountListProps) {
  return (
    <div className="space-y-2">
      {accounts.map((account) => (
        <button
          key={account.email}
          type="button"
          className="st-row flex w-full items-center gap-3 rounded-md border border-line bg-card px-3 py-2.5 text-left hover:border-neutral-300 hover:bg-neutral-50"
          onClick={() => onSelect(account)}
        >
          <span className={cn("shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-bold", account.toneClass)}>
            {account.role}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">{account.email}</span>
            <span className="block text-xs text-neutral-500">Mật khẩu: {account.password}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
