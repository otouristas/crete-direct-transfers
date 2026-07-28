import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";
import { useT } from "@/i18n";

function StoreBadge({ href, src, alt }: { href?: string; src: string; alt: string }) {
  const img = (
    <img
      src={src}
      alt={alt}
      className="w-[150px] object-contain transition hover:opacity-85"
      width={150}
      height={44}
      loading="lazy"
      decoding="async"
    />
  );
  if (!href) return img;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/60"
      title={alt}
    >
      {img}
    </a>
  );
}

export function AccountAppDownload() {
  const t = useT();
  return (
    <section className="hidden pb-10 lg:block">
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
        <div aria-hidden className="absolute inset-0">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-5rem] right-[-5rem] h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative grid items-center gap-10 px-8 py-12 md:grid-cols-2 md:px-12 lg:px-20">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {t.account.appTitle}
            </h2>
            <p className="mt-4 max-w-xl text-primary-foreground/70 md:text-lg">
              {t.account.appSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <div className="flex flex-col gap-y-4">
                <StoreBadge
                  href={APP_STORE_URL}
                  src="/footer/apple-store.svg"
                  alt={t.footer.downloadAppStore}
                />
                <StoreBadge
                  href={PLAY_STORE_URL}
                  src="/footer/google-play.svg"
                  alt={t.footer.downloadPlayStore}
                />
              </div>
              <p className="text-xs text-primary-foreground/50">{t.account.appCaption}</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
              <img
                src="/logo.png"
                alt=""
                className="h-full w-full object-contain opacity-90"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
