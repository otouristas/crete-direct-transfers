import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { POSTS } from "@/data/posts";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/blog/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/blog",
      title: t.blog.metaTitle,
      description: t.blog.metaDescription,
    });
  },
  component: BlogIndex,
});

function BlogIndex() {
  const t = useT();
  const posts = [...POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <PageHero
        eyebrow={t.blog.eyebrow}
        title={t.blog.title}
        subtitle={t.blog.subtitle}
        crumbs={[{ label: t.nav.blog }]}
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-14 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to="/{-$locale}/blog/$slug"
            params={{ slug: post.slug }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={post.heroImage}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-primary/85 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
                {t.blog.categories[post.category]}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h2 className="text-lg font-display leading-snug text-primary">{post.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {post.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingMinutes} {t.common.minRead}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
