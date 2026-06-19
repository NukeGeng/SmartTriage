// PublicHeader.tsx - Public navigation for the SmartTriage product landing page.
import Link from "next/link";
import { Search } from "lucide-react";

type PublicHeaderProps = {
  navItems: string[];
  searchPlaceholder: string;
};

export function PublicHeader({ navItems, searchPlaceholder }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-sticky border-b border-line/70 bg-command-bg/86 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2 px-4 py-3 sm:gap-3 sm:px-5 md:px-8 lg:gap-5 lg:py-4">
        <Link href="/" className="min-w-0 flex-1 truncate font-display text-lg font-black text-ink sm:text-2xl lg:flex-none">
          SmartTriage
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 text-sm font-bold text-ink lg:flex" aria-label="Điều hướng landing page">
          {navItems.map((item) => (
            <span key={item} className="cursor-default whitespace-nowrap">
              {item}
            </span>
          ))}
        </nav>

        <label className="hidden h-11 min-w-0 max-w-[300px] flex-1 items-center gap-3 rounded-pill bg-card px-4 text-sm text-ink shadow-soft md:flex lg:max-w-[340px] lg:flex-none">
          <span className="sr-only">Tìm kiếm tình huống SmartTriage</span>
          <input
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-neutral-500"
            placeholder={searchPlaceholder}
          />
          <Search className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
        </label>

        <div className="ml-auto flex shrink-0 items-center gap-2 text-sm font-bold lg:ml-0 lg:gap-3">
          <Link
            href="/login"
            className="st-button inline-flex h-10 items-center rounded-pill border border-line bg-card px-3 text-xs font-bold text-ink shadow-soft sm:px-4 sm:text-sm"
          >
            Đăng nhập
          </Link>
          <Link
            href="/demo"
            className="st-button inline-flex h-10 items-center rounded-pill bg-brand-600 px-3 text-xs font-bold text-white sm:px-5 sm:text-sm"
          >
            Xem thử
          </Link>
        </div>
      </div>
    </header>
  );
}
