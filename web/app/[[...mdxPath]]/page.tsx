import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents as getMDXComponents } from '../mdx-components';
import type { ComponentType, ReactNode } from 'react';

type PageWrapperProps = {
  children: ReactNode;
  toc: unknown;
  metadata: unknown;
  sourceCode?: string;
};

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata({ params }: { params: Promise<{ mdxPath?: string[] }> }) {
  const { mdxPath } = await params;
  const { metadata } = await importPage(mdxPath ?? []);
  return metadata;
}

export default async function Page({ params }: { params: Promise<{ mdxPath?: string[] }> }) {
  const resolvedParams = await params;
  const result = await importPage(resolvedParams.mdxPath ?? []);
  const { default: MDXContent, toc, metadata, sourceCode } = result;
  const Wrapper = getMDXComponents().wrapper as unknown as ComponentType<PageWrapperProps>;
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent params={resolvedParams} />
    </Wrapper>
  );
}
