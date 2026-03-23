import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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
    try {
        let q = query(collection(db, 'content_library'), orderBy('published_at', 'desc'));
        if (category) {
            q = query(collection(db, 'content_library'), where('category', '==', category), orderBy('published_at', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ContentItem);
    } catch (error) {
        console.error('Error fetching library content:', error);
        return [];
    }
}

export async function getTrendingContent() {
    try {
        const q = query(
            collection(db, 'content_library'),
            where('is_trending', '==', true),
            limit(5)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ContentItem);
    } catch (error) {
        console.error('Error fetching trending content:', error);
        return [];
    }
}

export async function getContentBySlug(slug: string) {
    try {
        const q = query(collection(db, 'content_library'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ContentItem;
    } catch (error) {
        console.error('Error fetching content by slug:', error);
        return null;
    }
}

export async function upsertContent(content: Partial<ContentItem>) {
    // Basic slug generation if missing
    if (!content.slug && content.title) {
        content.slug = content.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    try {
        let docId = content.id;
        if (!docId && content.slug) {
             const existing = await getContentBySlug(content.slug);
             if (existing) docId = existing.id;
        }

        if (docId) {
             await setDoc(doc(db, 'content_library', docId), content, { merge: true });
             return { id: docId, ...content } as ContentItem;
        } else {
             const newId = content.slug || `generated-${Date.now()}`;
             await setDoc(doc(db, 'content_library', newId), content);
             return { id: newId, ...content } as ContentItem;
        }
    } catch (error) {
        console.error('Error upserting content:', error);
        throw error;
    }
}

export async function deleteContent(id: string) {
    try {
        await deleteDoc(doc(db, 'content_library', id));
        return true;
    } catch (error) {
        console.error('Error deleting content:', error);
        throw error;
    }
}
