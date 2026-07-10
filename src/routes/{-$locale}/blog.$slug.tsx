import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { getPost, POSTS } from "@/data/posts";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    if (!loaderData) {
      return {
        meta: [
          { title: "Post not found | TransferAround" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.post;
    const path = `/blog/${params.slug}`;
    return buildHead({
      locale,
      path,
      title: `${p.title} · TransferAround Blog`,
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
            publisher: { "@type": "Organization", name: "TransferAround", url: SITE_URL },
            mainEntityOfPage: `${SITE_URL}${path}`,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: p.title, item: `${SITE_URL}${path}` },
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
  const { post } = Route.useLoaderData();
  const t = useT();
  const related = post.related
    .map((slug) => POSTS.find((p) => p.slug === slug))
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
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
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

          <div className="mt-10 rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="font-display text-lg">{t.home.ctaTitle}</div>
            <p className="mt-1 text-sm text-primary-foreground/75">{t.home.ctaSubtitle}</p>
            <Link
              to="/{-$locale}/book"
              className="mt-4 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              {t.common.getPrice}
            </Link>
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
