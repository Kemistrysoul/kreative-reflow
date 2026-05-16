import type React from 'react';
import { StickyNextArticleCard, type NextArticle } from './sticky-next-article-card';

type ArticleBodyProps = {
  id: string;
  nextArticle: NextArticle;
  children: React.ReactNode;
};

export function ArticleBody({ id, nextArticle, children }: ArticleBodyProps) {
  return (
    <div className="content-gutter grid gap-12 pb-24 pt-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:pt-20">
      <article
        id={id}
        className="mx-auto min-w-0 max-w-[56rem] lg:ml-[9vw] lg:mr-0 min-[1800px]:ml-[14vw]"
      >
        {children}
      </article>
      <aside className="relative hidden w-[18rem] justify-self-end lg:block">
        <StickyNextArticleCard article={nextArticle} />
      </aside>
    </div>
  );
}
