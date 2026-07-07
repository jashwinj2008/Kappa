import React from 'react';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for Next.js build-time prerendering
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} allProducts={products} />;
}
