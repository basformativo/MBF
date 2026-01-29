
import { directus } from './directus';
import { readItems } from '@directus/sdk';
import { getImageUrl } from './courses';

export interface NewsItem {
  id: string;
  titulo: string;
  slug: string;
  fecha: string;
  categoria: string;
  imagen: string;
  resumen: string;
  contenido: string;
  autor: string;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const result = await directus.request(readItems('noticias', {
      sort: ['-date_created']
    }));
    return result as unknown as NewsItem[];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const result = await directus.request(readItems('noticias', {
      filter: { slug: { _eq: slug } },
      limit: 1
    }));
    return (result[0] as unknown as NewsItem) || null;
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    return null;
  }
}
