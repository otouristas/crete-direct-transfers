import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { getDict, localePath, useLocale, useT, type Dict, type Locale } from "@/i18n";
import { getLocalizedPost, getLocalizedService } from "@/i18n/content";
import type { Post } from "@/data/posts";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import { CtaBand } from "@/components/sections/cta-band";

function commercialLinkForPost(
  slug: string,
  t: Dict,
  locale: Locale,
): { path: string; label: string } {
  switch (slug) {
    case "heraklion-airport-to-chania-options":
      return {
        path: "/airports/crete-heraklion-airport-transfers-her/transfer-from-heraklion-airport-to-chania",
        label: t.airportPages.transferFromTo("Heraklion Airport", "Chania"),
      };
    case "taxi-vs-prebooked-transfer-crete":
      return {
        path: "/services/airport-transfers",
        label: getLocalizedService(locale, "airport-transfers")?.name ?? t.nav.airportTransfers,
      };
    case "souda-port-cruise-ferry-arrivals":
      return { path: "/ports/souda-port-transfers", label: "Souda Port" };
    case "crete-with-kids-child-seats":
      return {
        path: "/services/group-transfers",
        label: getLocalizedService(locale, "group-transfers")?.name ?? t.nav.services,
      };
    case "night-arrivals-heraklion-airport":
      return {
        path: "/airports/crete-heraklion-airport-transfers-her",
        label: t.seo.airportTitle("Heraklion Airport", "HER"),
      };
    case "chania-old-town-arrival-tips":
      return {
        path: "/airports/chania-international-airport-transfers-chq/transfer-from-chania-airport-to-chania-old-town",
        label: t.airportPages.transferFromTo("Chania Airport", "Chania Old Town"),
      };
    default:
      return { path: "/services", label: t.nav.services };
  }
}

export const Route = createFileRoute("/{-$locale}/blog/$slug")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const post = getLocalizedPost(locale, params.slug);
    if (!post) throw notFound();
    return { post } as { post: Post };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [{ title: t.seo.notFound("Post") }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.post;
    const path = `/blog/${params.slug}`;
    const canonical = buildCanonicalUrl(locale, path);
    return buildHead({
      locale,
      path,
      title: t.seo.postTitle(p.title),
      description: p.description,
      ogImage: p.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: p.title,
            description: p.description,
            image: p.heroImage,
            datePublished: p.publishedAt,
            dateModified: p.updatedAt ?? p.publishedAt,
            author: { "@type": "Person", name: p.author.name },
            publisher: { "@id": ORGANIZATION_ID },
            mainEntityOfPage: canonical,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: t.nav.home,
                item: buildCanonicalUrl(locale, "/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t.nav.blog,
                item: buildCanonicalUrl(locale, "/blog"),
              },
              { "@type": "ListItem", position: 3, name: p.title, item: canonical },
            ],
          },
          ...(p.faq
            ? [
                {
                  "@type": "FAQPage",
                  mainEntity: p.faq.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                },
              ]
            : []),
        ],
      },
    });
  },
  component: BlogPost,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-display text-primary">{t.notFound.title}</h1>
      <Link
        to="/{-$locale}/blog"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        {t.nav.blog}
      </Link>
    </div>
  );
}

function BlogPost() {
  const { post } = Route.useLoaderData() as { post: Post };
  const t = useT();
  const locale = useLocale();
  const commercialLink = commercialLinkForPost(post.slug, t, locale);
  const related = post.related
    .map((slug) => getLocalizedPost(locale, slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <section className="relative">
        <div
          className="aspect-[16/7] bg-cover bg-center md:aspect-[16/5]"
          style={{ backgroundImage: `url(${post.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-6 pb-10 text-primary-foreground">
          <nav className="mb-4 flex gap-2 text-xs text-primary-foreground/70">
            <Link to="/{-$locale}" className="hover:text-accent">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/blog" className="hover:text-accent">
              {t.nav.blog}
            </Link>
          </nav>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            {t.blog.categories[post.category]}
          </span>
          <h1 className="mt-3 max-w-3xl text-3xl font-display md:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-primary-foreground/80">
            <span>{t.blog.byAuthor(post.author.name)}</span>
            <span>·</span>
            <span>{post.author.role}</span>
            <span>·</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} {t.common.minRead}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[220px_1fr]">
        {/* TOC */}
        <aside className="hidden h-fit lg:sticky lg:top-24 lg:block">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t.blog.tocTitle}
          </div>
          <nav className="mt-4 space-y-2 border-l border-border text-sm">
            {post.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="-ml-px block border-l-2 border-transparent pl-4 text-muted-foreground transition hover:border-accent hover:text-primary"
              >
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>

        {/* Article */}
        <article className="min-w-0 max-w-2xl">
          <p className="text-xl leading-relaxed text-foreground/90">{post.description}</p>
          {post.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="mt-10 text-2xl font-display text-primary">{s.heading}</h2>
              {s.body.map((paragraph, i) => (
                <p key={i} className="mt-4 leading-relaxed text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {post.faq && post.faq.length > 0 && (
            <section className="mt-12 rounded-2xl border border-border bg-muted/60 p-6">
              <h2 className="text-xl font-display text-primary">{t.nav.faq}</h2>
              <div className="mt-4 space-y-4 text-sm">
                {post.faq.map((f) => (
                  <div key={f.q}>
                    <div className="font-semibold text-foreground">{f.q}</div>
                    <p className="mt-1 text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {post.sources && post.sources.length > 0 ? (
            <section className="mt-10 border-t border-border pt-8">
              <h2 className="text-lg font-display text-primary">{t.blog.sourcesTitle}</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {post.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      rel="noreferrer"
                      target="_blank"
                      className="text-accent-deep underline decoration-accent/50 underline-offset-4"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-10 rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="font-display text-lg">{t.home.ctaTitle}</div>
            <p className="mt-1 text-sm text-primary-foreground/75">{t.home.ctaSubtitle}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={localePath(locale, commercialLink.path)}
                className="inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                {commercialLink.label}
              </a>
              <Link
                to="/{-$locale}/book"
                className="inline-flex rounded-xl border border-primary-foreground/25 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                {t.common.getPrice}
              </Link>
            </div>
          </div>
        </article>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <h2 className="mb-6 text-2xl font-display text-primary">{t.blog.relatedTitle}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/{-$locale}/blog/$slug"
                params={{ slug: p.slug }}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-accent-deep">
                  {t.blog.categories[p.category]}
                </span>
                <div className="mt-2 font-display text-lg leading-snug text-primary">{p.title}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {p.readingMinutes} {t.common.minRead}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
