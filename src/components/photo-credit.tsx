import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { imageCredit, type PlaceImage } from "@/lib/place-image";

/**
 * Photographer attribution for a Pexels image.
 *
 * The Pexels API guidelines require crediting the photographer and linking back
 * to Pexels wherever their photo is shown, so every hero and card image that
 * comes out of the manifest renders one of these.
 *
 * `overlay` styles it for placement on top of a dark image; the default styles
 * it for a light surface beneath one.
 */
export function PhotoCredit({
  image,
  overlay = false,
  className,
}: {
  image: PlaceImage;
  overlay?: boolean;
  className?: string;
}) {
  const t = useT();
  const credit = imageCredit(image);

  return (
    <p
      className={cn(
        "text-[11px] leading-none",
        overlay
          ? "absolute bottom-2 right-3 z-10 text-white/55 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]"
          : "text-muted-foreground/70",
        className,
      )}
    >
      {t.common.photoBy}{" "}
      <a
        href={credit.photographerUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="underline-offset-2 hover:underline"
      >
        {image.photographer}
      </a>{" "}
      {t.common.photoOn}{" "}
      <a
        href={credit.photoUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="underline-offset-2 hover:underline"
      >
        Pexels
      </a>
    </p>
  );
}
