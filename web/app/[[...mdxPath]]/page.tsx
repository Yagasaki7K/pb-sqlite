import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents as getMDXComponents } from '../mdx-components';
import { createElement, type ReactNode } from 'react';

type PageWrapperProps = {
  children: ReactNode;
  toc: unknown;
  metadata: unknown;
  sourceCode?: string;
};

type MdxComponent = (props: { params: { mdxPath?: string[] } }) => ReactNode;
type PageWrapper = (props: PageWrapperProps) => ReactNode;
type UntypedCreateElement = (type: unknown, props: Record<string, unknown>) => ReactNode;

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
  const Wrapper = getMDXComponents().wrapper as unknown as PageWrapper;
  const Content = MDXContent as unknown as MdxComponent;
  const createElementUntyped = createElement as unknown as UntypedCreateElement;
  const content = createElementUntyped(Content, { params: resolvedParams });
  return createElementUntyped(Wrapper, { toc, metadata, sourceCode, children: content });
}
