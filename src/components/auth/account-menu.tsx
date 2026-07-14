import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, Car, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import { useT } from "@/i18n";

function initialsOf(name: string | null | undefined, email: string | undefined): string {
  const source = name?.trim() || email || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

/** Desktop header slot: skeleton → "Sign in" → avatar dropdown. */
export function AccountMenu() {
  const t = useT();
  const { session, ready, signOut } = useAuth();
  const profile = useProfile();
  const navigate = useNavigate();

  if (!ready) {
    return <div className="hidden h-9 w-9 animate-pulse rounded-full bg-muted md:block" />;
  }

  if (!session) {
    return (
      <Link
        to="/{-$locale}/login"
        className="hidden rounded-full px-3 py-2 text-sm font-medium transition hover:bg-muted md:inline-flex"
      >
        {t.nav.signIn}
      </Link>
    );
  }

  const isDriver = profile.data?.role === "driver";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden rounded-full outline-none ring-accent focus-visible:ring-2 md:block">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback className="bg-accent/15 text-xs font-semibold text-accent-deep">
            {initialsOf(profile.data?.full_name, session.user.email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
          {session.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/{-$locale}/account" className="flex cursor-pointer items-center gap-2">
            <CalendarCheck className="h-4 w-4" />
            {t.nav.myBookings}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/{-$locale}/account/profile" className="flex cursor-pointer items-center gap-2">
            <UserRound className="h-4 w-4" />
            {t.nav.profile}
          </Link>
        </DropdownMenuItem>
        {isDriver && (
          <DropdownMenuItem asChild>
            <Link to="/{-$locale}/driver" className="flex cursor-pointer items-center gap-2">
              <Car className="h-4 w-4" />
              {t.nav.driverDashboard}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2"
          onSelect={async () => {
            await signOut();
            navigate({ to: "/{-$locale}" });
          }}
        >
          <LogOut className="h-4 w-4" />
          {t.nav.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Account links for the full-screen mobile menu (dark primary background). */
export function MobileAccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const t = useT();
  const { session, ready, signOut } = useAuth();
  const profile = useProfile();
  const navigate = useNavigate();

  if (!ready) return null;

  if (!session) {
    return (
      <Link to="/{-$locale}/login" onClick={onNavigate} className="transition hover:text-accent">
        {t.nav.signIn}
      </Link>
    );
  }

  return (
    <>
      <Link to="/{-$locale}/account" onClick={onNavigate} className="transition hover:text-accent">
        {t.nav.myBookings}
      </Link>
      <Link
        to="/{-$locale}/account/profile"
        onClick={onNavigate}
        className="transition hover:text-accent"
      >
        {t.nav.profile}
      </Link>
      {profile.data?.role === "driver" && (
        <Link to="/{-$locale}/driver" onClick={onNavigate} className="transition hover:text-accent">
          {t.nav.driverDashboard}
        </Link>
      )}
      <button
        type="button"
        className="text-left transition hover:text-accent"
        onClick={async () => {
          await signOut();
          onNavigate();
          navigate({ to: "/{-$locale}" });
        }}
      >
        {t.nav.signOut}
      </button>
    </>
  );
}
