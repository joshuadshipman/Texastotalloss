import { createClient } from '@supabase/supabase-js';

// Initialize client (Client-side usage mainly, or use a separate admin client for server-side if needed)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ContentItem {
    id: string;
    slug: string;
    title: string;
    video_url?: string;
    category: string;
    description?: string;
    transcript?: string;
    is_trending: boolean;
    published_at?: string;
}

export async function getLibraryContent(category?: string) {
    let query = supabase
        .from('content_library')
        .select('*')
        .order('published_at', { ascending: false });

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching library content:', error);
        return [];
    }
    return data as ContentItem[];
}

export async function getTrendingContent() {
    const { data, error } = await supabase
        .from('content_library')
        .select('*')
        .eq('is_trending', true)
        .limit(5);

    if (error) {
        console.error('Error fetching trending content:', error);
        return [];
    }
    return data as ContentItem[];
}

export async function getContentBySlug(slug: string) {
    const { data, error } = await supabase
        .from('content_library')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching content by slug:', error);
        return null;
    }
    return data as ContentItem;
}
