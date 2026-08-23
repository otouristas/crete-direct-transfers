import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/i18n";
import { getCountryImage, imageUrl } from "@/lib/place-image";
import { airportsInMarket } from "@/lib/coverage";
import { PhotoCredit } from "@/components/photo-credit";
import { cn } from "@/lib/utils";

type MarketCard = {
  slug: string;
  name: string;
  flag: string;
  mode: "instant" | "quote";
};

/**
 * Country tiles as photography rather than a text grid.
 *
 * The first market gets a double-width feature tile; the rest tile evenly. Each
 * photo comes from the Pexels manifest, so adding a market needs no asset work —
 * `npm run images:pexels` picks one up on the next run.
 */
export function DestinationCards({ markets }: { markets: MarketCard[] }) {
  const t = useT();
  if (markets.length === 0) return null;

  return (
    <div className="grid auto-rows-[13rem] gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market, index) => {
        const photo = getCountryImage(market.slug);
        const feature = index === 0;

        return (
          // The card is a <div>, not a <Link>: the photo credit inside it is
          // itself an anchor, and nesting anchors is invalid HTML that breaks
          // hydration. The Link overlays the card instead.
          <div
            key={market.slug}
            className={cn(
              "group relative isolate overflow-hidden rounded-2xl",
              feature ? "row-span-2 sm:col-span-2" : "",
            )}
          >
            <img
              src={imageUrl(photo, feature ? { width: 1200 } : { width: 700 })}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ backgroundColor: photo.avgColor }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />

            {/* Short cards give the label very little runway, so the ramp is
                steep at the base and clears fast — bright skies stay bright. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-primary from-0% via-primary/55 via-38% to-transparent to-78%"
            />

            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={`/{-$locale}/${market.slug}` as any}
              className="absolute inset-0 flex items-end justify-between gap-4 p-5 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="text-lg leading-none">
                    {market.flag}
                  </span>
                  <span
                    className={cn(
                      "truncate font-display leading-tight",
                      feature ? "text-3xl md:text-4xl" : "text-2xl",
                    )}
                  >
                    {market.name}
                  </span>
                </span>
                <span className="mt-1.5 block text-xs text-primary-foreground/75">
                  {t.home.countriesAirports(airportsInMarket(market.slug))}
                  {" · "}
                  {market.mode === "instant" ? t.home.countriesInstant : t.home.countriesQuote}
                </span>
              </span>
              <span
                aria-hidden
                className="mb-0.5 grid h-9 w-9 shrink-0 place-items-center self-end rounded-full bg-primary-foreground/15 backdrop-blur-sm transition duration-300 group-hover:bg-accent group-hover:text-accent-foreground"
              >
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>

            <PhotoCredit
              image={photo}
              overlay
              className="z-20 bottom-1 right-2 opacity-0 transition group-hover:opacity-100"
            />
          </div>
        );
      })}
    </div>
  );
}
