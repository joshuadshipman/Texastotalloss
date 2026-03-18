import { redirect } from 'next/navigation';

export default function RootPage() {
    // For now, redirect to the new Hub
    redirect('/admin');
}
