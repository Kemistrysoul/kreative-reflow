import { JsonLd } from '@/components/JsonLd';
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
  siteName,
} from '@/lib/seo';
import { ServiceDetailPage, type ServiceDetailPageProps } from './service-detail-page';

type ServiceRouteProps = {
  detail: ServiceDetailPageProps;
  path: string;
};

export function ServiceRoute({ detail, path }: ServiceRouteProps) {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'Services', path: '/services' },
            { name: detail.title, path },
          ]),
          serviceJsonLd({
            name: detail.title,
            description: detail.intro,
            path,
          }),
          faqJsonLd(
            detail.faqs.map((item) => ({
              question: item.question,
              answer: item.answer,
            })),
          ),
        ]}
      />
      <ServiceDetailPage {...detail} />
    </>
  );
}
