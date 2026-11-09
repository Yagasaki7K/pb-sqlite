import { generateStaticParamsFor, importPage } from 'nextra/pages';
import type { ReactElement } from 'react';
import { notFound } from 'next/navigation';

async function loadPage(pathSegments: string[]) {
  const result = await importPage(pathSegments);
  return result ?? null;
}

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata({ params }: { params: Promise<{ mdxPath?: string[] }> }) {
  const { mdxPath } = await params;
  const result = await loadPage(mdxPath ?? []);
  if (!result) notFound();
  const { metadata } = result;
  return metadata;
}

export default async function Page({ params }: { params: Promise<{ mdxPath?: string[] }> }): Promise<ReactElement> {
  const resolvedParams = await params;
  const result = await loadPage(resolvedParams.mdxPath ?? []);
  if (!result) notFound();
  const { default: MDXContent } = result;
  return (
    <main>
      <MDXContent params={resolvedParams} />
    </main>
  );
}
